import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);

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