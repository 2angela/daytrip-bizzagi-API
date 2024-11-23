import { Router } from "express";
import authRouter from "./auth/authRouter.js";
import destinationsRouter from "./destinations/destinationsRouter.js";
import plansRouter from "./plans/plansRouter.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/destinations", destinationsRouter);
router.use("/plans", plansRouter);

router.all("/", (request, response) => {
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

export default router;
