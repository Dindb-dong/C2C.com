import React, { useState } from 'react';
import './ProblemBankPage.css';

const ProblemBankPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
    setInputMessage('');

    // TODO: Implement ChatGPT API call
    // For now, just add a dummy response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '안녕하세요! 저는 ChatGPT입니다. 어떻게 도와드릴까요?'
      }]);
    }, 1000);
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
        </div>
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProblemBankPage; 