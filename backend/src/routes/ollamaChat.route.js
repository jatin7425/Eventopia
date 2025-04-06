import express from 'express';
import { createChatCompletion, getChatHistory } from '../controllers/ollamamodel.controller.js';

const router = express.Router();

// Create new chat
router.post('/', createChatCompletion);

// Get user chat history
router.get('/history/:userId', getChatHistory);

export default router;