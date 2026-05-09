import { z } from "zod";

export const createSpeakerSchema = z.object({
  fullName: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  links: z.array(z.string().url()).optional(),
});

export type CreateSpeakerInput = z.infer<typeof createSpeakerSchema>;