import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import authRoutes from './routes/admin.routes.js';
import publicRoutes from "./routes/public.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use(publicRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EventSync API is running",
    });
});

app.listen(PORT, () => {
    console.log("--------------------------------------------------");
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log("--------------------------------------------------");
});