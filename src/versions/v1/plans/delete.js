import { db } from "../../../index.js";
// Not Finished
const Delete = async (request, response, next) => {
  try {
    const { uid } = response.locals.user;
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Plan ID is required"
      });
    }

    const planRef = db.collection(`Users/${uid}/Plans`).doc(id);
    const planSnapshot = await planRef.get();

    if (!planSnapshot.exists) {
      return response.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    await planRef.delete();

    return response.status(200).json({
      success: true,
      message: "Plan deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
export default Delete;
