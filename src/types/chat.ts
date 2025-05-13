export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
}

export interface ChatResponse {
  message: ChatMessage;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 