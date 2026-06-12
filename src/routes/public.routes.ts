import { Router } from "express";
import { getQuestions, postQuestion } from "../controllers/question.controller.js";
import {
  getEventByIdController,
  getEventsController,
} from "../controllers/event.controller.js";
import { getAllSpeakersController, getSpeakerByIdController } from "../controllers/speaker.controller.js";
import { getRoomsController } from "../controllers/room.controller.js";
import { getSessionByIdHandler, getSessionsByEventHandler } from "../controllers/session.controller.js";

const router = Router();

router.get("/events", getEventsController);
router.get("/events/:eventId", getEventByIdController);

router.get("/events/:eventId/sessions", getSessionsByEventHandler);
router.get("/events/:eventId/sessions/:sessionId", getSessionByIdHandler);

router.get("/sessions/:sessionId/questions", getQuestions);
router.post("/sessions/:sessionId/questions", postQuestion);

router.get("/speakers/:speakerId", getSpeakerByIdController);
router.get("/speakers", getAllSpeakersController)

router.get("/rooms", getRoomsController);

export default router;
