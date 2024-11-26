import { admin } from "../firebase.js";

const Auth = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new Error("Authentication token is not provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Invalid token format");

    const decodedToken = await admin.auth().verifyIdToken(token);
    response.locals.user = decodedToken;
    return next();
  } catch (err) {
    return response.status(401).json({
      success: false,
      message: "Authentication failed",
      error: err.message,
    });
  }
};

export default Auth;
