import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../index.js";

const List = async (request, response, next) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Destinations"));
    if (!querySnapshot) throw new Error("No data was found");

    let data = [];
    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

    return response.status(200).json({
      success: true,
      message: "Destinations data retrieved",
      data
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default List;
