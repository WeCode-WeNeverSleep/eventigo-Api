import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type { CreateEventInput, UpdateEventInput } from "../schemas/event.schema.js";

export class EventService {
  static async getEvents() {
    return await prisma.event.findMany({
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
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

  static async getEventAdminById(id: string) {
    return await prisma.event.findUnique({
      where: { id },
    });
  }

  static async updateEvent(id: string, data: UpdateEventInput) {
    const start = data.startDate ? new Date(data.startDate) : undefined;
    const end = data.endDate ? new Date(data.endDate) : undefined;

    if (start && end && end <= start) {
      throw new Error("Invalid date range");
    }

    return await prisma.event.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(start !== undefined && { startDate: start }),
        ...(end !== undefined && { endDate: end }),
        ...(data.location !== undefined && { location: data.location }),
      },
    });
  }

  static async deleteEvent(id: string) {
    return await prisma.event.delete({
      where: { id },
    });
  }
}
