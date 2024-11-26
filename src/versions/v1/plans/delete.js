import { db } from "../../../index.js";
import { doc, deleteDoc } from "firebase/firestore";

const Delete = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!id) throw new Error("uid and id are required");
    const { uid } = response.locals.user;
    if (!uid) throw new Error("User not found");

    const docRef = doc(db, "Users", uid, "Plans", id);
    await deleteDoc(docRef);

    return response.status(200).json({
      success: true,
      message: "Plan deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
export default Delete;
