import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import pubRoutes from "./routes/public.routes.js";
import adminRoutes from './routes/admin.routes.js';
import { socketConfig } from "./lib/socket.js";
import { socketService } from "./services/socket.service.js";
import { sessionMonitor } from "./services/session.monitor.js";
import { createQuestion, upvoteQuestion } from "./services/question.service.js";
import { isSessionLive } from "./services/session.service.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use("/", pubRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, socketConfig);

socketService.setIo(io as any);
sessionMonitor.start();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_session", async (sessionId: string) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const live = await isSessionLive(sessionId);
      if (!live) {
        throw new Error("This session is not currently live or does not exist");
      }

      socket.join(`session:${sessionId}`);
      
      socket.data.sessionId = sessionId;
      
      const rooms = Array.from(socket.rooms);
      console.log(`Socket ${socket.id} is now in rooms: ${JSON.stringify(rooms)}`);
      
      const anonymousId = `anon_${socket.id.substring(0, 8)}`;
      socket.data.userId = anonymousId;

      socket.emit("session_joined", {
        anonymousId,
        sessionId,
      });

      console.log(`Socket ${socket.id} joined session ${sessionId} as ${anonymousId}`);
    } catch (error: any) {
      socket.emit("error", { message: error.message || "Internal server error" });
    }
  });

  socket.on("post_question", async (dto: { content: string; authorName?: string }) => {
    try {
      const sessionId = socket.data.sessionId;
      if (!sessionId) {
        throw new Error("You must join a session first");
      }

      const roomName = `session:${sessionId}`;
      const clientsInRoom = io.sockets.adapter.rooms.get(roomName)?.size || 0;
      console.log(`Post Question: Room ${roomName} has ${clientsInRoom} clients. Socket ${socket.id} is emitting.`);

      await createQuestion(sessionId, dto);
    } catch (error: any) {
      socket.emit("error", { 
        message: error.message || "Failed to post question", 
        status: error.statusCode || error.status || 500 
      });
    }
  });

  socket.on("upvote_question", async (questionId: string) => {
    try {
      const userId = socket.data.userId;
      if (!userId) {
        throw new Error("User identification missing");
      }

      await upvoteQuestion(questionId, userId);
    } catch (error: any) {
      socket.emit("error", { 
        message: error.message || "Failed to upvote question", 
        status: error.statusCode || error.status || 500 
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log("--------------------------------------------------");
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log("--------------------------------------------------");
});
