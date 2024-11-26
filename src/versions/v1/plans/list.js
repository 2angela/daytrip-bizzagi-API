import { db } from "../../../index.js";
import { collection, getDocs } from "firebase/firestore";

const List = async (request, response, next) => {
  try {
    const { uid } = response.locals.user;
    if (!uid) throw new Error("User not found");

    const querySnapshot = await getDocs(collection(db, "Users", uid, "Plans"));
    if (!querySnapshot) throw new Error("No data was found");

    let data = [];
    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

    return response.status(200).json({
      success: true,
      message: `Plans data for user ${uid} retrieved`,
      data
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default List;
