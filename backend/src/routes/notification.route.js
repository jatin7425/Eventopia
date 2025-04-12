import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotification, getNotificationFilters } from "../controllers/notification.controller.js";

const router = express.Router();

// Notification Routes
router.get('/get', protectRoute, getNotification);
router.get('/getFilters', protectRoute, getNotificationFilters)

export default router;
