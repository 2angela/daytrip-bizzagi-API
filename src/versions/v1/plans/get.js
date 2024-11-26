import { db } from "../../../index.js";

const Get = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Plan ID is required"
      });
    }

    const { uid } = response.locals.user;
    if (!uid) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing"
      });
    }

    const planRef = db.collection("Users").doc(uid).collection("Plans").doc(id);
    const planSnapshot = await planRef.get();

    if (!planSnapshot.exists) {
      return response.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const planData = planSnapshot.data();
    return response.status(200).json({
      success: true,
      message: "Plan retrieved successfully",
      data: planData
    });
  } catch (error) {
    next(error);
  }
};

export default Get;
