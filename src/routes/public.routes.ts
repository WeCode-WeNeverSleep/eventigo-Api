import { Router } from "express";
import {
  getEventById,
  getEventsController,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/events", getEventsController);
router.get("/events/:eventId", getEventById);

export default router;
