import prisma from "../lib/prisma.js";
import type { CreateRoomInput, UpdateRoomInput } from "../schemas/room.schema.js";

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

  static async getRoomById(roomId: string) {
    return prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
  }

  static async updateRoom(roomId: string, data: UpdateRoomInput) {
    return prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        ...(data.name !== undefined && { name: data.name }),
      },
    });
  }
}