import type { Request, Response } from "express";
import { createSessionSchema } from "../schemas/session.schema.js";
import { ZodError } from "zod";
import * as sessionService from "../services/session.service.js";

export const createSessionHandler = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.eventId;

        if (typeof eventId !== "string") {
            return res.status(400).json({
                message: "Invalid eventId",
            });
        }

        const parsed = createSessionSchema.parse(req.body);

        const session = await sessionService.createSession(
            eventId,
            parsed
        );

        return res.status(201).json(session);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues,
            });
        }

        if (error instanceof Error && error.message === "Invalid time range") {
            return res.status(400).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getSessionsByEventHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const eventId = req.params.eventId;

        if (typeof eventId !== "string") {
            return res.status(400).json({
                message: "Invalid eventId",
            });
        }

        const sessions = await sessionService.getSessionsByEvent(eventId);

        return res.status(200).json(sessions);
    } catch (error: unknown) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getSessionByIdHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { eventId, sessionId } = req.params;

        if (
            typeof eventId !== "string" ||
            typeof sessionId !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid parameters",
            });
        }

        const session = await sessionService.getSessionById(
            eventId,
            sessionId
        );

        if (!session) {
            return res.status(404).json({
                message: "Session not found",
            });
        }

        return res.status(200).json(session);
    } catch (error: unknown) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};