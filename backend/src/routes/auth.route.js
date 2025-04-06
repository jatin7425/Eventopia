import express from "express";
import { login, logout, signup, updateProfile, checkAuth, resetPassword, userById, getAllUsers, forgetPassword, requestPasswordReset } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/updateProfile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.post('/resetPassword', protectRoute, resetPassword);

router.get('/userById/:userId', protectRoute, userById);

router.get('/getAllUsers', protectRoute, getAllUsers);

router.post('/request-password-reset', requestPasswordReset);

router.post('/reset-password', forgetPassword);

export default router;
