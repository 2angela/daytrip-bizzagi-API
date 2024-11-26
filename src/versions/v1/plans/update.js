import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../index.js";

const Update = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!id) throw new Error("uid and id are required");
    const { uid } = response.locals.user;
    if (!uid) throw new Error("User not found");

    if (!uid || !id || !data)
      throw new Error(
        "uid and id in params, and data in request body are required"
      );

    const docRef = doc(db, "Users", uid, "Plans", id);
    await updateDoc(docRef, { ...data });

    return response.status(200).json({
      success: true,
      message: `Plans data for id ${id} updated`,
      data
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default Update;
