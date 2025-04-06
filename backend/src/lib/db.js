import mongoose from "mongoose";
import { initializeOllamaModel } from "../controllers/ollamamodel.controller.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        if (conn) {
            await initializeOllamaModel();
        }

    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
}

