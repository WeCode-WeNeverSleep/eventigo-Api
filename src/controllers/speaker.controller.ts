import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import type { SessionWithRoom, SpeakerWithSessions, SpeakerParams } from "../types/speaker.js";
import { createSpeakerSchema, updateSpeakerSchema } from "../schemas/speaker.schema.js";
import { SpeakerService } from "../services/speaker.service.js";
import { ZodError } from "zod";

const toExternalLinks = (links: unknown): string[] => {
  if (!Array.isArray(links)) return [];
  return links.filter((x): x is string => typeof x === "string");
};

const toSpeakerResponse = (speaker: Exclude<SpeakerWithSessions, null>) => {
  const externalLinks = toExternalLinks(speaker.links);

  return {
    id: speaker.id,
    fullName: speaker.fullName,
    profilePictureUrl: speaker.avatarUrl ?? null,
    bio: speaker.bio ?? null,
    externalLinks,
    sessions: speaker.sessions.map((s: SessionWithRoom) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? null,
      startTime: s.startTime,
      endTime: s.endTime,
      capacity: s.capacity ?? null,
      room: s.room ? { id: s.room.id, name: s.room.name } : null,
    })),
  };
};

export const getSpeakerByIdController = async (req: Request, res: Response) => {
  try {
    const { speakerId } = req.params;

    if (typeof speakerId !== "string") {
      return res.status(400).json({ error: "Invalid speakerId" });
    }

    let speaker: SpeakerWithSessions;
    try {
      speaker = (await prisma.speaker.findUnique({
        where: { id: speakerId },
        include: {
          sessions: {
            include: { room: true },
            orderBy: { startTime: "asc" },
          },
        },
      })) as SpeakerWithSessions;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.toLowerCase().includes("uuid")) {
        return res.status(400).json({ error: "Invalid speakerId" });
      }

      throw error;
    }

    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }

    return res.json(toSpeakerResponse(speaker));
  } catch (error) {
    console.error("Get Speaker By Id Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createSpeakerController = async (req: Request, res: Response) => {
  try {
    const parsed = createSpeakerSchema.parse(req.body);

    const speaker = await SpeakerService.createSpeaker(parsed);

    return res.status(201).json(speaker);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllSpeakersController = async (req: Request, res: Response) => {
  try {
    const speakers = await SpeakerService.getAllSpeakers();

    return res.status(200).json(speakers);
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAdminSpeakerByIdController = async (
  req: Request<SpeakerParams>,
  res: Response
) => {
  try {
    const { speakerId } = req.params;

    const speaker = await SpeakerService.getSpeakerById(speakerId);

    if (!speaker) {
      return res.status(404).json({
        message: "Speaker not found",
      });
    }

    return res.status(200).json(speaker);
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateSpeakerController = async (
  req: Request<SpeakerParams>,
  res: Response
) => {
  try {
    const { speakerId } = req.params;
    const parsed = updateSpeakerSchema.parse(req.body);

    const speaker = await SpeakerService.updateSpeaker(speakerId, parsed);

    return res.status(200).json(speaker);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};