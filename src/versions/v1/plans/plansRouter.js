import { Router } from "express";
import Auth from "../../../middlewares/auth.js";
import Create from "./create.js";
import List from "./list.js";
import Get from "./get.js";
import Update from "./update.js";
import Delete from "./delete.js";

const plansRouter = Router();
plansRouter.post("/create", Auth, Create);
plansRouter.get("/list", Auth, List);
plansRouter.get("/list/:id", Auth, Get);
plansRouter.put("/update/:id", Auth, Update);
plansRouter.delete("/delete/:id", Auth, Delete);

plansRouter.all("/", (request, response, next) => {
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

export default plansRouter;
