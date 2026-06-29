import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createRoomSchema, updateRoomSchema } from "../schemas/room.schema.js";
import { RoomService } from "../services/room.service.js";
import type { RoomParams } from "../types/room.js";

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

export const getRoomByIdController = async (
  req: Request<RoomParams>,
  res: Response
) => {
  try {
    const { roomId } = req.params;

    const room = await RoomService.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json(room);
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateRoomController = async (
  req: Request<RoomParams>,
  res: Response
) => {
  try {
    const { roomId } = req.params;
    const parsed = updateRoomSchema.parse(req.body);

    const room = await RoomService.updateRoom(roomId, parsed);

    return res.status(200).json(room);
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

export const deleteRoomController = async (
  req: Request<RoomParams>,
  res: Response
) => {
  try {
    const { roomId } = req.params;
    await RoomService.deleteRoom(roomId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};