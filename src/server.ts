import express from "express";
import cors from "cors";
import "dotenv/config";
import pubRoutes from "./routes/public.routes.js";
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use("/", pubRoutes);

app.listen(PORT, () => {
  console.log("--------------------------------------------------");
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log("--------------------------------------------------");
});