import Groq from "groq-sdk";
import Config from "../config/settings";
import { PrismaClient } from "../prisma/generated/prisma";
import { Chat, ChatHistoryParams, CreateMessageDto, Message } from "../interfaces/chat.interfaces";
import { enhancedFormatAIResponse,removeSpecials } from "../utils/aiResponseFormate";

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: Config.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Simbi, a sassy and smart young girl child who acts as an AI study buddy. Your tone is playful, confident, and a little cheeky, but you're always helpful and kind. You help students understand their schoolwork, answer their questions, and share fun and useful study tips. You speak like a clever kid who's excited to learn and loves helping others learn too.`;

/**
 * Create a new chat or get an existing one
 */
export async function createOrGetChat(userId: string, chatId?: string): Promise<Chat> {
  if (chatId) {
    const existingChat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });

    if (existingChat && existingChat.userId === userId) {
      // Transform null title to undefined
      return {
        ...existingChat,
        messages: existingChat.messages.map(msg => ({
          ...msg,
          role: msg.role as "user" | "assistant"
        })),
        title: existingChat.title ?? undefined,
      };
    }

    throw new Error("Chat not found or unauthorized");
  }

  const newChat = await prisma.chat.create({
    data: {
      userId: userId,
      title: "New Conversation",
    },
  });

  // Transform null title to undefined
  return {
    ...newChat,
    title: newChat.title ?? undefined,
  };
}
/**
 * Get chat history for a specific chat
 */
export async function getChatHistory({ chatId, limit = 100, page = 1 }: ChatHistoryParams): Promise<Message[]> {
  const skip = (page - 1) * limit;
  
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
    take: limit,
    skip
  });
  
  return messages.map(msg => ({
    ...msg,
    role: msg.role as "user" | "assistant"
  }));
}

/**
 * List all chats for a user
 */
export async function listUserChats(userId: string, limit = 20, page = 1): Promise<Chat[]> {
  const skip = (page - 1) * limit;
  
  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return chats.map(chat => ({
    ...chat,
    messages: chat.messages.map(msg => ({
      ...msg,
      role: msg.role as "user" | "assistant"
    })),
    title: chat.title ?? undefined
  }));
}

/**
 * Delete a chat and all its messages
 */
export async function deleteChat(chatId: string, userId: string): Promise<void> {
  // Check if chat exists and belongs to the user
  const chat = await prisma.chat.findUnique({
    where: { id: chatId }
  });
  
  if (!chat || chat.userId !== userId) {
    throw new Error("Chat not found or unauthorized");
  }
  
  // Delete the chat (messages will be cascade deleted)
  await prisma.chat.delete({
    where: { id: chatId }
  });
}

/**
 * Generate a title for a chat based on the first user message
 */
async function generateChatTitle(userMessage: string): Promise<string> {
  try {
    const titleCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate a short, concise title (max 5 words) for a conversation that starts with this message. Return only the title text, nothing else."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 15
    });
    
    const title = titleCompletion.choices[0]?.message?.content?.trim() || "New Conversation";
    return title;
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Conversation";
  }
}

/**
 * Process a message from the user and get AI response
 */
export async function processUserMessage(userId: string, messageData: CreateMessageDto): Promise<{ 
    chat: Chat, 
    aiMessage: Message, 
    userMessage: Message 
}> {
    // Start a database transaction
    return prisma.$transaction(async (tx) => {
        // Get or create a chat
        let chat: Chat;
        const isNewChat = !messageData.chatId;
        
        // Get user information for personalization
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true }
        });

        if (isNewChat) {
            // Create a new chat
            const newChat = await tx.chat.create({
                data: {
                    userId,
                    title: "New Conversation" // Temporary title, will be updated later
                }
            });
            chat = {
                ...newChat,
                title: newChat.title ?? undefined
            };
        } else {
            // Get existing chat
            const existingChat = await tx.chat.findUnique({
                where: { id: messageData.chatId }
            });
            
            if (!existingChat || existingChat.userId !== userId) {
                throw new Error("Chat not found or unauthorized");
            }
            
            chat = {
                ...existingChat,
                title: existingChat.title ?? undefined
            };
        }
        
        // Save user message to the database
        const userMessage = await tx.message.create({
            data: {
                content: messageData.content,
                role: 'user',
                chatId: chat.id
            }
        });
        
        // Get previous messages for context (max 10 to avoid token limits)
        const previousMessages = await tx.message.findMany({
            where: { chatId: chat.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        
        // Enhanced system prompt with user's name if available
        const personalizedPrompt = user?.firstName 
            ? `${SYSTEM_PROMPT} I'm talking to ${user.firstName} ${user.lastName || ''}, and I'll make sure to personalize our conversation.Only use the first name in the response and only on your first response.`
            : SYSTEM_PROMPT;

        // Format messages for Groq API
        const groqMessages = [
            {
                role: "system" as const,
                content: personalizedPrompt
            },
            ...previousMessages
                .reverse()
                .map(msg => ({
                    role: msg.role as "user" | "assistant",
                    content: msg.content
                })),
            {
                role: "user" as const,
                content: messageData.content
            }
        ];
        
        // Call Groq API for response
        const completion = await groq.chat.completions.create({
            messages: groqMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });
        
        const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        const formattedAIResponse = enhancedFormatAIResponse(aiResponse);
        // const formattedAIResponse = removeSpecials(aiResponse);
        // Save AI response to the database
        const aiMessage = await tx.message.create({
            data: {
                content: formattedAIResponse,
                role: 'assistant',
                chatId: chat.id
            }
        });
        
        // If this is a new chat, generate and update the title
        if (isNewChat) {
            const title = await generateChatTitle(messageData.content);
            await tx.chat.update({
                where: { id: chat.id },
                data: { title }
            });
            
            chat.title = title;
        }
        
        // Update chat's updatedAt timestamp
        await tx.chat.update({
            where: { id: chat.id },
            data: { updatedAt: new Date() }
        });
        
        return {
            chat,
            aiMessage: { ...aiMessage, role: aiMessage.role as "user" | "assistant" },
            userMessage: { ...userMessage, role: userMessage.role as "user" | "assistant" }
        };
    },
    {
      timeout:10000, // Set a timeout for the transaction
      isolationLevel: 'Serializable' // Set the isolation level for the transaction

    }
  );
}