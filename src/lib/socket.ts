import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export interface SocketData {
  userId?: string;
  sessionId?: string;
}

export type CustomSocket = Socket<any, any, SocketData>;
export type CustomServer = Server<any, any, SocketData>;

export const socketConfig = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};
