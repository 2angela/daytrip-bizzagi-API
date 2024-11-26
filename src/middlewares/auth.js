import { firebaseAdmin } from "../index.js";
import { getAuth } from "firebase-admin/auth";

const Auth = async (request, response, next) => {
  try {
    // check if token is included in req headers
    const token = request.headers?.authorization?.split(" ")[1];
    if (!token) throw new Error("Authentication token is not provided");

    // check if token hasn't expired in firebase
    const authAdmin = getAuth(firebaseAdmin);
    const decodedToken = await authAdmin.verifyIdToken(token);
    response.locals.user = decodedToken;
    return next();
  } catch (err) {
    return response.status(401).json({
      success: false,
      message: "Unauthorized",
      error: err.message
    });
  }
};

export default Auth;
