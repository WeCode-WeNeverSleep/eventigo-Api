import { z } from "zod";

export const createSessionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  roomId: z.string().uuid(),
  capacity: z.number().int().positive().optional(),
  speakerIds: z.array(z.string().uuid()).optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

