import React, { useState } from 'react';
import './ProblemBankPage.css';
import { request } from '../../utils/request';
import { ChatMessage, ChatResponse } from '../../types/chat';

const sendMessage = async (messages: ChatMessage[]): Promise<ChatResponse> => {
  try {
    const response = await request.post<ChatResponse>('/api/chat', {
      messages,
      model: 'gpt-4o', // 선택적
      temperature: 0.7, // 선택적
    });
    return response.data;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

const ProblemBankPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  // user와 assistant의 메시지를 저장하는 배열
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response.message.content }]);
    } catch (error) {
      // 에러 메시지 표시
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="problem-bank-page">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
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
        </div>
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="message-input"
            disabled={isLoading}
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