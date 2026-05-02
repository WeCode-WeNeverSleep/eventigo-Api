import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import type { SessionWithRoom, SpeakerWithSessions } from "../types/speaker.js";

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

    if (!speakerId) {
      return res.status(400).json({ error: "speakerId is required" });
    }

    const speaker = (await prisma.speaker.findUnique({
      where: { id: speakerId },
      include: {
        sessions: {
          include: { room: true },
          orderBy: { startTime: "asc" },
        },
      },
    })) as SpeakerWithSessions;

    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }

    return res.json(toSpeakerResponse(speaker));
  } catch (error) {
    console.error("Get Speaker By Id Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
