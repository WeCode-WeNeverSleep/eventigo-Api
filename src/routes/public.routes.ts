import { Router } from "express";
import {
  getEventByIdController,
  getEventsController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/events", getEventsController);
router.get("/events/:eventId", getEventByIdController);

export default router;
