import { z } from "zod";

const dateTimeWithOffsetSchema = z.string().datetime({ offset: true });

export const createEventSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().optional(),
    startDate: dateTimeWithOffsetSchema,
    endDate: dateTimeWithOffsetSchema,
    location: z.string().min(2),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "startDate must be before endDate",
    path: ["endDate"],
  });

export type CreateEventInput = z.infer<typeof createEventSchema>;