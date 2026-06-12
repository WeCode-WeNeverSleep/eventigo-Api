import { z } from "zod";

const dateTimeWithOffsetSchema = z.string().datetime({ offset: true });

export const createSessionSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startTime: dateTimeWithOffsetSchema,
    endTime: dateTimeWithOffsetSchema,
    roomId: z.string().uuid(),
    capacity: z.number().int().positive().optional(),
    speakerIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "startTime must be before endTime",
    path: ["endTime"],
  });

export const updateSessionSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startTime: dateTimeWithOffsetSchema.optional(),
    endTime: dateTimeWithOffsetSchema.optional(),
    roomId: z.string().uuid().optional(),
    capacity: z.number().int().positive().optional(),
    speakerIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => {
    if (!data.startTime || !data.endTime) {
      return true;
    }

    return new Date(data.startTime) < new Date(data.endTime);
  }, {
    message: "startTime must be before endTime",
    path: ["endTime"],
  });

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;