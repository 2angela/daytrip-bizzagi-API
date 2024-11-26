import { db } from "../../../index.js";
import { doc, getDoc } from "firebase/firestore";

const Get = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!id) throw new Error("Destination id is required");
    const { uid } = response.locals.user;
    if (!uid) throw new Error("User not found");

    const docRef = doc(db, "Destinations", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("The requested data does not exist");

    const destination = docSnap.data();

    return response.status(200).json({
      success: true,
      message: "Destination retrieved successfully",
      data: {
        id: docSnap.id,
        ...destination
      }
    });
  } catch (error) {
    next(error);
  }
};

export default Get;
