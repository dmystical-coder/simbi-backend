import { User } from "./user.interfaces";

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  chatId: string;
}

export interface Chat {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  
  // Relations
  messages?: Message[];
  user?: User;
}

export interface CreateMessageDto {
  content: string;
  chatId?: string; // Optional for creating a new chat
}

export interface ChatResponse {
  chatId: string;
  message: string;
  title?: string;
}

export interface ChatHistoryParams {
  chatId: string;
  limit?: number;
  page?: number;
}