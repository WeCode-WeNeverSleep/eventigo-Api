import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;