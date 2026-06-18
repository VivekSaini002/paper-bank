'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { aiAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function AIPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AI Study Assistant. Ask me anything about your subjects, exam preparation, or any academic topic. I can help you with:\n\n• **Solving questions** from any subject\n• **Explaining concepts** in simple terms\n• **Providing study tips** for exam preparation\n• **Generating practice questions**\n\nWhat would you like to learn today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const result = await aiAPI.chat(userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again. Error: ' + err.message,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Explain the concept of normalization in DBMS",
    "What are the differences between TCP and UDP?",
    "Solve: Find the time complexity of merge sort",
    "List important topics for Data Structures exam",
  ];

  if (authLoading || !user) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
    </div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 0 16px', textAlign: 'center' }} className="animate-fade-in">
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            ✨ AI Study Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Powered by GPT-4o</p>
        </div>

        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '16px 20px',
                borderRadius: msg.role === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'var(--gradient-primary)'
                  : 'var(--bg-card)',
                border: msg.role === 'user'
                  ? 'none'
                  : '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '8px', fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: '600',
                  }}>
                    🤖 AI Assistant
                  </div>
                )}
                <div className={msg.role === 'assistant' ? 'markdown-content' : ''}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '20px 24px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div className="spinner" style={{ width: '20px', height: '20px' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (only show when few messages) */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 0 12px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); }}
                className="btn-ghost"
                style={{
                  fontSize: '0.82rem',
                  padding: '8px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSend} style={{
          padding: '16px 0 24px',
          display: 'flex',
          gap: '12px',
        }}>
          <input
            type="text"
            className="input-field"
            placeholder="Ask anything about your studies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1, padding: '14px 20px', fontSize: '1rem' }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !input.trim()}
            style={{
              padding: '14px 28px',
              opacity: (loading || !input.trim()) ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '...' : 'Send ➤'}
          </button>
        </form>
      </div>
    </div>
  );
}
