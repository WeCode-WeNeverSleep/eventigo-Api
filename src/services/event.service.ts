import prisma from "../lib/prisma.js";

export class EventService {
  static async getEvents() {
    return await prisma.event.findMany({
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
