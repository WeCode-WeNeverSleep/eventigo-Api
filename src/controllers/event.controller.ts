import type { Request, Response } from "express";
import { EventService } from "../services/event.service.js";

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const events = await EventService.getEvents();

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    if (typeof eventId !== "string") {
      return res.status(400).json({ error: "Invalid eventId" });
    }
    const event = await EventService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
