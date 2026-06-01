import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import { createSessionHandler } from "../controllers/session.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import { createEventController } from "../controllers/event.controller.js";
import { createRoomController, getRoomByIdController, getRoomsController, updateRoomController } from "../controllers/room.controller.js";
import { createSpeakerController } from "../controllers/speaker.controller.js";

const router = Router();

router.post("/login", loginController);

router.use(authenticateAdmin);

router.post("/events", createEventController);

router.get("/rooms", getRoomsController);
router.get("/rooms/:roomId", getRoomByIdController);
router.post("/rooms", createRoomController);
router.put("/rooms/:roomId", updateRoomController);

router.post("/events/:eventId/sessions", createSessionHandler);
router.post("/speakers", createSpeakerController)

export default router;