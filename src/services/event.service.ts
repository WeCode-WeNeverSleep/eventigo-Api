import prisma from "../lib/prisma.js";
import type { GetEventsQuery } from "../schemas/event.schema.js";

export class EventService {
  static async getEvents(params: GetEventsQuery) {
    const { limit, offset } = params;

    return await prisma.event.findMany({
      take: limit,
      skip: offset,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sessions: {
          include: {
            room: true,
            speakers: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }
}
