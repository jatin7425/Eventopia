import express from "express";
import {
    createContact
} from "../controllers/contact.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createContact", createContact);

export default router;