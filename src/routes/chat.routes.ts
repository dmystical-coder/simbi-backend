import express, { Request, Response } from 'express';
import { sendMessage, getMessages, getUserChats, removeChatById } from '../controllers/chat.controllers';
import { authMiddleware } from "../middlewares/authentication.middlewares";
import { chatValidator } from "../validators/chat.validators";


const router = express.Router();


// Apply authentication middleware to all chat routes
router.use(authMiddleware);

// Get all user chats
router.get('/', getUserChats);



// Get chat history for a specific chat
router.get('/:chatId', getMessages);

// Send a message to the AI assistant
router.post('/message', chatValidator,sendMessage);

// Delete a chat
router.delete('/:chatId', removeChatById);


export default router;