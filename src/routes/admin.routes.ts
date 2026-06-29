import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import {
  createSessionHandler,
  getAdminSessionByIdHandler,
  getSessionsByEventHandler,
  updateSessionHandler,
} from "../controllers/session.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import {
  createEventController,
  getAdminEventByIdController,
  getEventsController,
  updateEventController,
  deleteEventController,
} from "../controllers/event.controller.js";
import {
  createRoomController,
  getRoomByIdController,
  getRoomsController,
  updateRoomController,
} from "../controllers/room.controller.js";
import {
  createSpeakerController,
  getAdminSpeakerByIdController,
  getAllSpeakersController,
  updateSpeakerController,
} from "../controllers/speaker.controller.js";

const router = Router();

router.post("/login", loginController);

router.use(authenticateAdmin);

router.get("/events", getEventsController);
router.get("/events/:eventId", getAdminEventByIdController);
router.post("/events", createEventController);
router.put("/events/:eventId", updateEventController);
router.delete("/events/:eventId", deleteEventController);

router.get("/rooms", getRoomsController);
router.get("/rooms/:roomId", getRoomByIdController);
router.post("/rooms", createRoomController);
router.put("/rooms/:roomId", updateRoomController);

router.post("/events/:eventId/sessions", createSessionHandler);
router.get("/events/:eventId/sessions", getSessionsByEventHandler);
router.get("/events/:eventId/sessions/:sessionId", getAdminSessionByIdHandler);
router.put("/events/:eventId/sessions/:sessionId", updateSessionHandler);

router.get("/speakers", getAllSpeakersController);
router.get("/speakers/:speakerId", getAdminSpeakerByIdController);
router.post("/speakers", createSpeakerController);
router.put("/speakers/:speakerId", updateSpeakerController);

export default router;

