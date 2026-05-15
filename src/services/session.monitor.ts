import prisma from "../lib/prisma.js";
import { socketService } from "./socket.service.js";

class SessionMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 30 * 1000; // 30 seconds

  public start(): void {
    if (this.intervalId) return;
    
    console.log("Session Monitor started...");
    this.intervalId = setInterval(() => this.checkSessions(), this.CHECK_INTERVAL);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checkSessions() {
    try {
      const now = new Date();
      
      // Find sessions that just started or just ended
      // In a real production app, we'd track "lastNotificationSent" in DB 
      // to avoid spamming events every 30s.
      // For this implementation, we will emit if they are in the "transition window".
      
      const sessions = await prisma.session.findMany({
        where: {
          OR: [
            {
              startTime: {
                gte: new Date(now.getTime() - this.CHECK_INTERVAL),
                lte: now,
              },
            },
            {
              endTime: {
                gte: new Date(now.getTime() - this.CHECK_INTERVAL),
                lte: now,
              },
            },
          ],
        },
      });

      for (const session of sessions) {
        const isStarted = now >= session.startTime && now <= session.endTime;
        const isEnded = now > session.endTime;

        if (isStarted && now.getTime() <= session.startTime.getTime() + this.CHECK_INTERVAL) {
          socketService.emitToRoom(`session:${session.id}`, "session_started", {
            sessionId: session.id,
            message: "The session is now LIVE!",
          });
        }

        if (isEnded) {
          socketService.emitToRoom(`session:${session.id}`, "session_ended", {
            sessionId: session.id,
            message: "The session has ended. It is now read-only.",
          });
        }
      }
    } catch (error) {
      console.error("Session Monitor Error:", error);
    }
  }
}

export const sessionMonitor = new SessionMonitor();
