import { Request, Response } from 'express';
import { 
  createOrGetChat, 
  getChatHistory, 
  listUserChats, 
  deleteChat, 
  processUserMessage 
} from '../services/chat.services';
import { CustomRequest } from '../interfaces/request.interfaces';

/**
 * Send a message to the AI assistant
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const { content, chatId } = req.body;
    
    if (!content || content.trim() === '') {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }
    
    const result = await processUserMessage(userId, { content, chatId });
    
    res.status(200).json({
      success: true,
      chat: {
        id: result.chat.id,
        title: result.chat.title
      },
      userMessage: result.userMessage,
      aiMessage: result.aiMessage
    });
  } catch (error: any) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      error: 'Failed to process message', 
      message: error.message 
    });
  }
};

/**
 * Get chat history
 */
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const chatId = req.params.chatId;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    
    // Verify the chat belongs to the user
    const chat = await createOrGetChat(userId, chatId);
    
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    
    const messages = await getChatHistory({ chatId, limit, page });
    
    res.status(200).json({
      success: true,
      chatId,
      messages,
      pagination: {
        page,
        limit
      }
    });
  } catch (error: any) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ 
      error: 'Failed to get chat history', 
      message: error.message 
    });
  }
};

/**
 * List all chats for a user
 */
export const getUserChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    
    const chats = await listUserChats(userId, limit, page);
    
    res.status(200).json({
      success: true,
      chats,
      pagination: {
        page,
        limit
      }
    });
  } catch (error: any) {
    console.error('Error listing user chats:', error);
    res.status(500).json({ 
      error: 'Failed to list chats', 
      message: error.message 
    });
  }
};

/**
 * Delete a chat
 */
export const removeChatById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const chatId = req.params.chatId;
    
    await deleteChat(chatId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ 
      error: 'Failed to delete chat', 
      message: error.message 
    });
  }
};