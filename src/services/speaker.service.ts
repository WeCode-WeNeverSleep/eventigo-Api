import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import type { CreateSpeakerInput, UpdateSpeakerInput } from "../schemas/speaker.schema.js";

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

    static async getSpeakerById(speakerId: string) {
        return prisma.speaker.findUnique({
            where: {
                id: speakerId,
            },
        });
    }

    static async updateSpeaker(speakerId: string, data: UpdateSpeakerInput) {
        return prisma.speaker.update({
            where: {
                id: speakerId,
            },
            data: {
                ...(data.fullName !== undefined && { fullName: data.fullName }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
                ...(data.bio !== undefined && { bio: data.bio }),
                ...(data.links !== undefined && { links: data.links }),
            },
        });
    }

    static async deleteSpeaker(speakerId: string) {
        return prisma.speaker.delete({
            where: { id: speakerId },
        });
    }
}