import { db } from "../../../index.js";

const Get = async (request, response, next) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Destination ID is required"
      });
    }

    const destinationRef = await db.collection("Destinations").doc(id);
    const destination = await destinationRef.get();

    if (!destination.exists) {
      return response.status(404).json({
        success: false,
        message: "Destination not found"
      });
    }

    return response.status(200).json({
      success: true,
      message: "Destination retrieved successfully",
      data: {
        id: destination.id,
        ...destination.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

export default Get;
