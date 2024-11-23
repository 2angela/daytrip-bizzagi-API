import router from "./v1/router.js";
import { Router } from "express";

const versionRouter = Router();
versionRouter.use("/v1", router);

versionRouter.all("/", (request, response) => {
  return response.status(200).json({
    success: true,
    message: "OK",
    data: {
      path: request.baseUrl,
      source: request.ip,
      hostname: request.hostname,
      time: new Date()
    }
  });
});

export default versionRouter;
