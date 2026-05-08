import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type { CreateSpeakerInput } from "../schemas/speaker.schema.js";

export class SpeakerService {
    static async getAllSpeakers() {
        return await prisma.speaker.findMany({
            include: {
                sessions: {
                    include: {
                        room: true,
                    },
                },
            },
            orderBy: {
                fullName: "asc",
            },
        });
    }

    static async createSpeaker(data: CreateSpeakerInput) {
        const { fullName, avatarUrl, bio, links } = data;

        const speakerData: Prisma.SpeakerCreateInput = {
            fullName,
            ...(avatarUrl !== undefined && { avatarUrl }),
            ...(bio !== undefined && { bio }),
            ...(links !== undefined && { links }),
        };

        return prisma.speaker.create({
            data: speakerData,
        });
    }
}