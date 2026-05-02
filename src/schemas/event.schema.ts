import { z } from 'zod';

export const getEventsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
