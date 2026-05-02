import type { Request, Response } from "express";
import { EventService } from "../services/event.service.js";
import { getEventsQuerySchema } from "../schemas/event.schema.js";

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const validatedQuery = getEventsQuerySchema.parse(req.query);
    const events = await EventService.getEvents(validatedQuery);

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500);
  }
};
