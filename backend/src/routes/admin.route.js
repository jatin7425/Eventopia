import express from "express";
import {
    getCollection,
    getCollectionData,
    updateCollectionItem,
    deleteCollectionItem
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/listCollection", getCollection);
router.post("/selecteColection/:collectionName", getCollectionData);
router.put('/collections/:collectionName', updateCollectionItem);
router.delete('/collections/:collectionName', deleteCollectionItem);

export default router;