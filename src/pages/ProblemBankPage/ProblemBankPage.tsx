import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
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
    metadata?: {
      tokens?: number;
    };
  }>;
  model?: string;
  temperature?: number;
  problemId?: string;
  sessionId?: string;
  title?: string;
  question?: string;
  answer?: string;
}

const SYSTEM_PROMPT = {
  ko: `
당신은 MBB 스타일의 경영 컨설턴트 면접관입니다. 
항상 냉철하고 논리적으로 판단하며, 형식적 인삿말(예: "알겠습니다", "문제: ~") 없이 바로 본론만 말합니다.
게스티메이션이나 케이스 문제를 낼 때에는 간결하고 날카롭게 질문만 던지세요.
답변을 평가할 때는, 논리의 비약, 전제의 모호성 등을 지적하세요. 만약 사용자의 답변이 부적절하다면 다시 생각할 기회를 주세요.
너무 친절하거나 정중한 말투는 피하고, 실제 면접관처럼 행동하세요.
`,
  en: `
You are an MBB-style management consultant interviewer.
Always make cold and logical judgments, and get straight to the point without formal greetings (e.g., "I understand", "Problem: ~").
When asking guesstimation or case questions, be concise and sharp with your questions.
When evaluating answers, point out logical leaps and ambiguous premises. If the user's answer is inappropriate, give them another chance to think.
Avoid being too friendly or polite, and act like a real interviewer.
`,
  ja: `
あなたはMBBスタイルの経営コンサルタント面接官です。
常に冷静かつ論理的に判断し、形式的な挨拶（例：「承知しました」、「問題：〜」）なしで本題に入ります。
概算やケースの問題を出す際は、簡潔かつ鋭く質問だけを投げかけてください。
回答を評価する際は、論理の飛躍や前提の曖昧さなどを指摘してください。ユーザーの回答が不適切な場合は、もう一度考える機会を与えてください。
過度に親切や丁寧な口調は避け、実際の面接官のように振る舞ってください。
`
};

const getSystemMessage = (language: string) => ({
  role: 'system' as const,
  content: SYSTEM_PROMPT[language as keyof typeof SYSTEM_PROMPT] || SYSTEM_PROMPT.ko,
});

const generateProblemId = (userId: string): string => {
  const prefix = userId.slice(0, 5);
  const timestamp = Date.now();
  return `${prefix}_${timestamp}`;
};

const sendMessage = async (messages: ChatRequest['messages'], userId: string, problemId: string, title?: string, language: string = 'ko'): Promise<ChatMessage> => {
  try {
    // OpenAI API 직접 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content: completion.choices[0].message.content,
      role: 'assistant',
      createdAt: new Date(),
      problemId,
      metadata: {
        tokens: completion.usage?.total_tokens,
        model: completion.model,
        temperature: 0.7
      }
    };

    // 서버에 메시지 저장
    const chatRequest: ChatRequest = {
      messages: [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          metadata: msg.metadata
        })),
        {
          role: 'assistant',
          content: assistantMessage.content,
          metadata: {
            tokens: assistantMessage.metadata?.tokens
          }
        }
      ],
      model: 'gpt-4',
      temperature: 0.7,
      problemId,
      title: title || assistantMessage.content,
      answer: assistantMessage.content,
      question: messages[1]?.content,
    };

    await request.post<{ success: boolean; data: ChatMessage }>('/chat', chatRequest);

    return assistantMessage;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

const ProblemBankPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
        setProblemId(generateProblemId(id));
      }
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
    if (!inputMessage.trim() || isLoading || !userId || !problemId) return;

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content: inputMessage,
      role: 'user',
      createdAt: new Date(),
      problemId,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage([
        getSystemMessage(i18n.language),
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: inputMessage }
      ], userId, problemId, title, i18n.language);
      setMessages(prev => [...prev, response]);
      setTitle(response?.content);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'system',
        content: t('problemBank.error'),
        role: 'assistant',
        createdAt: new Date(),
        problemId,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = async (templateType: 'guesstimation' | 'case') => {
    if (isLoading || !userId || !problemId) return;

    const templateMessage = templateType === 'guesstimation'
      ? t('problemBank.guesstimation')
      : t('problemBank.case');

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content: templateMessage,
      role: 'user',
      createdAt: new Date(),
      problemId,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage([
        getSystemMessage(i18n.language),
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: templateMessage }
      ], userId, problemId, title, i18n.language);
      setMessages(prev => [...prev, response]);
      setTitle(response?.content);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'system',
        content: t('problemBank.error'),
        role: 'assistant',
        createdAt: new Date(),
        problemId,
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
            {t('problemBank.guesstimation')}
          </button>
          <button
            onClick={() => handleTemplateClick('case')}
            className="template-button"
            disabled={isLoading}
          >
            {t('problemBank.case')}
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
            placeholder={t('problemBank.inputPlaceholder')}
            className="message-input"
            disabled={isLoading}
            rows={3}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading}
          >
            {isLoading ? t('problemBank.sending') : t('problemBank.send')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProblemBankPage; 