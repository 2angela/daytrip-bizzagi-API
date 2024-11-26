import { db } from "../../../index.js";

const Update = async (request, response, next) => {
  try {
    const { uid } = response.locals.user;
    const { id } = request.params;
    const data = request.body;

    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Plan ID is required"
      });
    }

    if (!uid) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: User ID is missing"
      });
    }

    if (!data || Object.keys(data).length === 0) {
      return response.status(400).json({
        success: false,
        message: "Request body is required"
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

    await planRef.update(data);

    return response.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default Update;
