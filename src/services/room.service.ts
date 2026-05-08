import prisma from "../lib/prisma.js";
import type { CreateRoomInput } from "../schemas/room.schema.js";

export class RoomService {
  static async createRoom(data: CreateRoomInput) {
    return prisma.room.create({
      data: {
        name: data.name,
      },
    });
  }

  static async getRooms() {
    return prisma.room.findMany({
      orderBy: { name: "asc" },
    });
  }
}