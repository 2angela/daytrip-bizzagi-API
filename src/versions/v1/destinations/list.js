import { db } from "../../../index.js";

const List = async (request, response, next) => {
  try {
    const querySnapshot = await db.collection("Destinations").get();
    if (!querySnapshot) {
      return response.status(404).json({
        success: false,
        message: "No destinations found",
        data: [],
      });
    }

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return response.status(200).json({
      success: true,
      message: "Destinations data retrieved",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default List;
