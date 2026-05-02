
import { Router } from "express";
import { getSpeakerByIdController } from "../controllers/speaker.controller.js";

const router = Router();

router.get("/speakers/:speakerId", getSpeakerByIdController);

export default router;

