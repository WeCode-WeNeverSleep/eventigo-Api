import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "EventSync API is running 🚀",
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await prisma.$queryRaw`SELECT 1`;

        res.json({
            message: "Database connected ✅",
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database connection failed ❌",
        });
    }
});

app.listen(PORT, () => {
    console.log("--------------------------------------------------");
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log("--------------------------------------------------");
});