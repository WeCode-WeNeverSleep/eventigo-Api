import type { CustomServer } from "../lib/socket.js";

class SocketService {
  private static instance: SocketService;
  private io: CustomServer | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public setIo(io: CustomServer): void {
    this.io = io;
  }

  public getIo(): CustomServer {
    if (!this.io) {
      throw new Error("Socket.io not initialized. Call setIo first.");
    }
    return this.io;
  }

  public emitToRoom(room: string, event: string, data: any): void {
    console.log(`[SocketService] Emitting ${event} to room: ${room}`);
    this.getIo().to(room).emit(event, data);
  }

  public emitToUser(socketId: string, event: string, data: any): void {
    this.getIo().to(socketId).emit(event, data);
  }
}

export const socketService = SocketService.getInstance();
