import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type { CreateEventInput } from "../schemas/event.schema.js";

export class EventService {
  static async getEvents() {
    return await prisma.event.findMany({
      orderBy: {
        startDate: "asc",
      },
    });
  }

  static async getEventById(id: string) {
    return await prisma.event.findUnique({
      where: { id },
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
    });
  }

  static async createEvent(organizerId: string, data: CreateEventInput) {
    const { title, description, startDate, endDate, location } = data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new Error("Invalid date range");
    }

    const eventData: Prisma.EventCreateInput = {
      title,
      startDate: start,
      endDate: end,
      location,

      ...(description !== undefined && { description }),

      organizer: {
        connect: {
          id: organizerId,
        },
      },
    };

    return await prisma.event.create({
      data: eventData,
    });
  }
}
