import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  createEventSchema,
  updateEventSchema,
} from "../schemas/event.schema.js";
import { EventService } from "../services/event.service.js";
import type { EventParams } from "../types/event.js";

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

export const createEventController = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user.id;

    if (!organizerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const parsed = createEventSchema.parse(req.body);

    const event = await EventService.createEvent(organizerId, parsed);

    return res.status(201).json(event);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (error instanceof Error && error.message === "Invalid date range") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAdminEventByIdController = async (
  req: Request<EventParams>,
  res: Response,
) => {
  try {
    const { eventId } = req.params;

    const event = await EventService.getEventAdminById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json(event);
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateEventController = async (
  req: Request<EventParams>,
  res: Response,
) => {
  try {
    const { eventId } = req.params;
    const parsed = updateEventSchema.parse(req.body);

    const event = await EventService.updateEvent(eventId, parsed);

    return res.status(200).json(event);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (error instanceof Error && error.message === "Invalid date range") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteEventController = async (
  req: Request<EventParams>,
  res: Response,
) => {
  try {
    const { eventId } = req.params;
    await EventService.deleteEvent(eventId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

