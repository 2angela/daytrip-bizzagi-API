import { Router } from "express";
import Auth from "../../../middlewares/auth.js";
import Create from "./create.js";
import List from "./list.js";
import Get from "./get.js";

const destinationsRouter = Router();
destinationsRouter.post("/create/:place_id", Auth, Create);
destinationsRouter.get("/list", Auth, List);
destinationsRouter.get("/list/:id", Auth, Get);

destinationsRouter.all("/", (request, response, next) => {
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

export default destinationsRouter;
