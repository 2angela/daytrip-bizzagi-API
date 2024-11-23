import { Router } from "express";
import Login from "./login.js";
import SignUp from "./signup.js";

const authRouter = Router();
authRouter.post("/login", Login);
authRouter.post("/signup", SignUp);

authRouter.all("/", (request, response, next) => {
  try {
    return response.status(200).json({
      success: true,
      message: "OK",
      data: {
        path: request.originalUrl
      }
    });
  } catch (err) {
    next(err);
  }
});

export default authRouter;
