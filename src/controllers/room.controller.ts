import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createRoomSchema } from "../schemas/room.schema.js";
import { RoomService } from "../services/room.service.js";

export const createRoomController = async (req: Request, res: Response) => {
  try {
    const parsed = createRoomSchema.parse(req.body);

    const room = await RoomService.createRoom(parsed);

    return res.status(201).json(room);
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

export const getRoomsController = async (req: Request, res: Response) => {
  try {
    const rooms = await RoomService.getRooms();

    return res.status(200).json(rooms);
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};