import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotification } from "../controllers/notification.controller.js";

const router = express.Router();

// Notification Routes
router.get('/get', protectRoute, getNotification);

export default router;
