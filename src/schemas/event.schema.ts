import { z } from "zod";

export const createEventSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    location: z.string().min(2),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;