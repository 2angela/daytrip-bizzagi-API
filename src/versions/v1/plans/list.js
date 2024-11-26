import { db } from "../../../firebase.js";

const List = async (request, response) => {
  try {
    const userId = response.locals.user.uid;

    const plansRef = db.collection('Users').doc(userId).collection('Plans');
    const snapshot = await plansRef.get();

    if (snapshot.empty) {
      return response.status(404).json({
        success: false,
        message: "No plans found for this user",
      });
    }

    const plans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return response.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default List;