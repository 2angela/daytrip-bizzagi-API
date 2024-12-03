import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, gcs } from "../../../index.js";
import fs from "fs";

const Create = async (request, response, next) => {
  try {
    const { place_id: id } = request.params;
    if (!id) throw new Error("place id is required");

    const docRef = doc(db, "Destinations", id);
    // check if destination id exist in db
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
      throw new Error("Destination data exists, use GET method instead");

    // request place details
    const placeDetailsResponse = await fetch(
      `https://places.googleapis.com/v1/places/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": `${process.env.PLACES_API_KEY}`,
          "X-Goog-FieldMask":
            "location,displayName,types,primaryType,rating,formattedAddress,regularOpeningHours,photos"
        }
      }
    );

    if (placeDetailsResponse.status == 200) {
      const placeDetails = await placeDetailsResponse.json();
      // destructure response
      const {
        location,
        displayName,
        types,
        primaryType,
        rating,
        formattedAddress: address,
        regularOpeningHours,
        photos
      } = placeDetails;

      if (!location)
        throw new Error("couldn't find latitude and longitude of", id);

      const validDestinationTypes = [
        "tourist_attraction",
        "point_of_interest",
        "landmark",
        "amusement_park",
        "zoo"
      ];

      // reject request for non-travel places
      const checkTypes = types?.filter((el) =>
        validDestinationTypes.includes(el)
      );
      if (!checkTypes.length > 0 || !checkTypes)
        throw new Error(
          `Only travel destinations are allowed. Current destination types: ${types}. Allowed destinations: ${validDestinationTypes}`
        );

      const { latitude, longitude } = location;
      const { text: name } = displayName;
      const { periods } = regularOpeningHours || { periods: [] };

      // restructure periods array
      let opens = [];
      let closes = [];
      const checkDigit = (x) => {
        // convert one digit time format to two digits
        return x < 10 ? `0${x}` : x;
      };

      for (const period of periods) {
        const { hour: hourOpen, minute: minuteOpen } = period.open || {
          hour: 0,
          minute: 0
        };
        const { hour: hourClose, minute: minuteClose } = period.close || {
          hour: 0,
          minute: 0
        };
        opens.push(`${checkDigit(hourOpen)}:${checkDigit(minuteOpen)}`);
        closes.push(`${checkDigit(hourClose)}:${checkDigit(minuteClose)}`);
      }
      if (opens.length == 0) opens = ["00:00"]; // handler if regularOpeningHours is undefined
      if (closes.length == 0) closes = ["00:00"]; // handler if regularOpeningHours is undefined

      // request place photos
      let photosLinks = [];

      if (photos) {
        const photoLimit = photos.length < 5 ? photos.length : 5; // limit place photos to 5 only
        const photosArray = photos
          .slice(0, photoLimit)
          .map((photo) => photo.name);

        for (var i = 0; i < photoLimit; i++) {
          await fetch(
            `https://places.googleapis.com/v1/${photosArray[i]}/media?maxHeightPx=400&key=${process.env.PLACES_API_KEY}`
          )
            .then(async (res) => {
              // save the image
              const buffer = await res.arrayBuffer();
              fs.writeFileSync(`photo${i}.jpg`, Buffer.from(buffer));
            })
            .catch((err) => {
              throw new Error(err);
            });

          // store in cloud storage
          const bucketPath = `places/${id}/${i}.jpg`;
          await gcs.upload(`photo${i}.jpg`, {
            destination: bucketPath,
            public: true,
            metadata: {
              contentType: "image/jpeg"
            }
          });
          const url = `https://storage.googleapis.com/c242-dt01/places/${id}/${i}.jpg`;
          photosLinks.push(url);
          fs.unlink(`photo${i}.jpg`, (err) => {
            if (err) {
              throw new Error("failed to save images to cloud");
            }
          });
        }
      }

      // restructure
      const data = {
        latitude,
        longitude,
        name: name || "",
        types: types || [],
        primaryType: primaryType || "",
        address: address || "",
        rating: rating || "",
        opens,
        closes,
        photosList: photosLinks
      };

      // create new firestore destination document
      await setDoc(docRef, data);
      return response.status(201).json({
        success: true,
        message: "Destination details created",
        data
      });
    }
  } catch (err) {
    return next(err);
  }
};

export default Create;
