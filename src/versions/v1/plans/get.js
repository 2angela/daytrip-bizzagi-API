import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../index.js";

const Get = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!id) throw new Error("uid and id are required");
    const { uid } = response.locals.user;
    if (!uid) throw new Error("User not found");

    const docRef = doc(db, "Users", uid, "Plans", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("The requested data does not exist");

    const data = docSnap.data();

    // Sorts key 'data'
    if (data.data) {
      data.data = Object.keys(data.data)
        .sort()
        .reduce((sortedData, key) => {
          sortedData[key] = data.data[key];
          return sortedData;
        }, {});
    }

    return response.status(200).json({
      success: true,
      message: `Plans data for id ${id} retrieved`,
      data
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default Get;
