import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../index.js";
import axios from "axios";

const Create = async (request, response, next) => {
    try {
      const { uid } = response.locals.user;
      const { num_days, lokasi_user, places, start_date, end_date } = request.body;
  
      // Validasi data yang diperlukan
      if (!uid || !num_days || !lokasi_user || !places || !start_date || !end_date) {
        return response.status(400).json({
          success: false,
          message: "Missing required fields",
          data: { error: "uid, num_days, lokasi_user, and places are required" }
        });
      }
  
      if (!lokasi_user.latitude || !lokasi_user.longitude) {
        return response.status(400).json({
          success: false,
          message: "Invalid location data",
          data: { error: "lat and lng are required in lokasi_user" }
        });
      }
  
      if (!Array.isArray(places) || places.length === 0) {
        return response.status(400).json({
          success: false,
          message: "Invalid places data",
          data: { error: "places must be a non-empty array" }
        });
      }

      // Generate plan_id
      const plansCollection = collection(db, "Users", uid, "Plans");
      const querySnapshot = await getDocs(plansCollection);
      const planCount = querySnapshot.size;  
      const plan_id = `plan${planCount + 1}`;
  
      // Kirim request ke API model ML
      const mlApiResponse = await axios.post(
        "https://ml-api-304525226938.asia-southeast2.run.app/calculate_routes",
        {
          num_days,
          lokasi_user,
          places: places.map((place) => ({
            place_id: place.place_id,
            latitude: place.latitude,
            longitude: place.longitude,
            rating: place.rating,
            open_time: place.open_time,
            close_time: place.close_time
          }))
        }
      );
  
      // Proses respons dari API model ML
      const { routes } = mlApiResponse.data;
      
      if (!routes || routes.length === 0) {
        return response.status(400).json({
          success: false,
          message: "API model ML did not return routes",
          data: { error: "No routes found in API response" }
        });
      }
  
      // Bentuk data untuk disimpan ke Firestore
      const planData = {
        start_date: start_date || "default_start_date",
        end_date: end_date || "default_end_date",
        data: {}
      };
      
      routes.forEach((route, index) => {
        const dayKey = `day${index + 1}`;
        planData.data[dayKey] = route.places ? route.places.map((place) => place.place_id) : [];
      });
  
      // Simpan data ke Firestore
      const planRef = doc(db, "Users", uid, "Plans", plan_id);
      await setDoc(planRef, planData);
  
      return response.status(201).json({
        success: true,
        message: "Plan created successfully",
        data: planData
      });
    } catch (err) {
      console.error("Error creating plan:", err);
      next(err);
    }
};

export default Create;
