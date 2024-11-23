import { firebaseAuth } from "../index.js";

const Auth = (request, response, next) => {
  // uncomment after login handler is done
  //   try {
  //     // check if token is included in req headers
  //     const token = request.headers.authorization;
  //     if (!token) throw new Error("Authentication token is not provided");
  //
  //     // check if token is still active in firebase
  //     let checkRevoked = true;
  //     firebaseAuth()
  //       .verifyIdToken(token, checkRevoked)
  //       .then((payload) => {
  //         response.locals.user = payload;
  //         return next();
  //       })
  //       .catch((error) => {
  //         if (error.code == "auth/id-token-revoked") {
  //           throw new Error("Token has been revoked, please reauthenticate");
  //         } else {
  //           throw new Error("Token is invalid");
  //         }
  //       });
  //   } catch (err) {
  //     next(err);
  //   }
};

export default Auth;
