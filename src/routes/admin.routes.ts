import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import { createSessionHandler } from "../controllers/session.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginController);

router.use(authenticateAdmin);

router.post("/events/:eventId/sessions", createSessionHandler);

export default router;