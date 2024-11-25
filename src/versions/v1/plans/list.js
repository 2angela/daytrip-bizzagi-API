import { db } from "../../../index.js";

const List = async (request, response, next) => {
  try {
    const { uid } = response.locals.user;

    const plansSnapshot = await db.collection(`Users/${uid}/Plans`).get();
    const plans = plansSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    return response.status(200).json({
      success: true,
      message: "Plans retrieved successfully",
      data: plans
    });
  } catch (err) {
    next(err);
  }
};

export default List;
