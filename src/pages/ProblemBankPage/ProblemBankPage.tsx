import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ProblemBankPage.css';
import { request } from '../../utils/request';
import { getUserId } from '../../utils/storage';
import OpenAI from 'openai';

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  problemId?: string;
  metadata?: {
    tokens?: number;
    model?: string;
    temperature?: number;
  };
}

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  problemId?: string;
}

const SYSTEM_PROMPT = `
당신은 MBB 스타일의 경영 컨설턴트 면접관입니다. 
항상 냉철하고 논리적으로 판단하며, 형식적 인삿말(예: "알겠습니다", "문제: ~") 없이 바로 본론만 말합니다.
게스티메이션이나 케이스 문제를 낼 때에는 간결하고 날카롭게 질문만 던지세요.
답변을 평가할 때는, 논리의 비약, 전제의 모호성 등을 지적하세요. 만약 사용자의 답변이 부적절하다면 다시 생각할 기회를 주세요.
너무 친절하거나 정중한 말투는 피하고, 실제 면접관처럼 행동하세요.
`;

const getSystemMessage = () => ({
  role: 'system' as const,
  content: SYSTEM_PROMPT,
});

const sendMessage = async (messages: ChatRequest['messages']): Promise<ChatMessage> => {
  try {
    // OpenAI API 직접 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI');
    }

    const response: ChatMessage = {
      id: crypto.randomUUID(),
      userId: await getUserId() || '',
      content: completion.choices[0].message.content,
      role: 'assistant',
      createdAt: new Date(),
      metadata: {
        tokens: completion.usage?.total_tokens,
        model: completion.model,
        temperature: 0.7
      }
    };

    // 서버에 메시지 저장
    await request.post<{ success: boolean; data: ChatMessage }>('/chat', {
      messages: [response],
      model: 'gpt-4o',
      temperature: 0.7,
    });

    return response;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

const ProblemBankPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      console.log(id);
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !userId) return;

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content: inputMessage,
      role: 'user',
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log(messages.map(msg => ({ role: msg.role, content: msg.content })));
      const response = await sendMessage([
        getSystemMessage(),
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: inputMessage }
      ]);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'system',
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.',
        role: 'assistant',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = async (templateType: 'guesstimation' | 'case') => {
    if (isLoading || !userId) return;

    const templateMessage = templateType === 'guesstimation'
      ? '게스티메이션 문제를 만들어주세요.'
      : '케이스 인터뷰를 진행해주세요.';

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content: templateMessage,
      role: 'user',
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage([
        getSystemMessage(),
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: templateMessage }
      ]);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'system',
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.',
        role: 'assistant',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="problem-bank-page">
      <div className="chat-container">
        <div className="template-buttons">
          <button
            onClick={() => handleTemplateClick('guesstimation')}
            className="template-button"
            disabled={isLoading}
          >
            게스티메이션 문제를 만들어주세요.
          </button>
          <button
            onClick={() => handleTemplateClick('case')}
            className="template-button"
            disabled={isLoading}
          >
            케이스 인터뷰를 진행해주세요.
          </button>
        </div>
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              {message.role === 'assistant' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant loading">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="input-form">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요... (Shift + Enter로 줄바꿈)"
            className="message-input"
            disabled={isLoading}
            rows={3}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading}
          >
            {isLoading ? '전송 중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProblemBankPage; 