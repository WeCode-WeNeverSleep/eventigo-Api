import type { Request, Response } from "express";
import { EventService } from "../services/event.service.js";

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const events = await EventService.getEvents();

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500);
  }
};
