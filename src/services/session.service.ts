import prisma from "../lib/prisma.js";
import type { CreateSessionInput, UpdateSessionInput } from "../schemas/session.schema.js";

export const createSession = async (
  eventId: string,
  data: CreateSessionInput,
) => {
  const {
    title,
    description,
    startTime,
    endTime,
    roomId,
    capacity,
    speakerIds,
  } = data;

  const sessionData = {
    title,
    startTime: new Date(startTime),
    endTime: new Date(endTime),

    ...(description !== undefined && { description }),
    ...(capacity !== undefined && { capacity }),

    event: {
      connect: { id: eventId },
    },

    room: {
      connect: { id: roomId },
    },

    ...(speakerIds?.length && {
      speakers: {
        connect: speakerIds.map((id) => ({ id })),
      },
    }),
  };

  return prisma.session.create({
    data: sessionData,
  });
};

export const getSessionsByEvent = async (eventId: string) => {
  return prisma.session.findMany({
    where: {
      eventId,
    },
    include: {
      room: true,
      speakers: true,
      questions: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const getSessionById = async (eventId: string, sessionId: string) => {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      eventId,
    },
    include: {
      room: true,
      speakers: true,
      questions: true,
    },
  });
};

export const findSessionById = async (sessionId: string) => {
  return prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });
};

export const isSessionLive = async (sessionId: string): Promise<boolean> => {
  const session = await findSessionById(sessionId);

  if (!session) {
    return false;
  }

  const now = new Date();

  return now >= session.startTime && now <= session.endTime;
};

export const updateSession = async (
  sessionId: string,
  data: UpdateSessionInput,
) => {
  const {
    title,
    description,
    startTime,
    endTime,
    roomId,
    capacity,
    speakerIds,
  } = data;

  return prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(startTime !== undefined && {
        startTime: new Date(startTime),
      }),
      ...(endTime !== undefined && {
        endTime: new Date(endTime),
      }),
      ...(capacity !== undefined && { capacity }),

      ...(roomId !== undefined && {
        room: {
          connect: {
            id: roomId,
          },
        },
      }),

      ...(speakerIds !== undefined && {
        speakers: {
          set: speakerIds.map((id) => ({ id })),
        },
      }),
    },
  });
};

export const getAdminSessionById = async (
  eventId: string,
  sessionId: string,
) => {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      eventId,
    },
  });
};