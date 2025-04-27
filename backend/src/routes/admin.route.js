import express from "express";
import { getCollection, getCollectionData } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/listCollection", getCollection);
router.get("/selecteColection/:collectionName", getCollectionData);

export default router;