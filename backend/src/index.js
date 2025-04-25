import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import vendorRoutes from "./routes/vendor.route.js";
import ollamaChatRoutes from "./routes/ollamaChat.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { connectDB } from "./lib/db.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Define routes after the CORS configuration
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/ollamaChat", ollamaChatRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
    connectDB();
});