import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { THEME } from '../constants';
import { generateHumasResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const VirtualHumas: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Ada yang bisa saya bantu tentang organisasi kami?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const replyText = await generateHumasResponse(inputValue);
    
    const botMsg: ChatMessage = { role: 'model', text: replyText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-xl border-2 border-white shadow-xl transition-all hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
        style={{ 
            backgroundColor: THEME.colors.secondary, 
            color: '#fff',
            boxShadow: `6px 6px 0px 0px ${THEME.colors.accent}`
        }}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[500px] rounded-xl flex flex-col z-50 overflow-hidden border-2 border-white"
          style={{ 
            backgroundColor: THEME.colors.surface,
            boxShadow: `10px 10px 0px 0px rgba(0,0,0,0.4)`
          }}
        >
          {/* Header */}
          <div 
            className="p-4 flex justify-between items-center border-b-2 border-gray-100"
            style={{ backgroundColor: THEME.colors.primary, color: '#fff' }}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded border border-black">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-wide">Virtual Humas</h4>
                <p className="text-xs opacity-80 font-medium">AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm font-medium border-2 ${
                    msg.role === 'user' ? 'rounded-xl rounded-tr-none border-blue-900' : 'rounded-xl rounded-tl-none border-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: msg.role === 'user' ? THEME.colors.secondary : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    boxShadow: msg.role === 'user' ? '4px 4px 0px 0px rgba(0,0,0,0.2)' : '2px 2px 0px 0px rgba(0,0,0,0.1)'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl rounded-tl-none border-2 border-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] flex gap-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t-2 border-gray-200 bg-white flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya sesuatu..."
              className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-700 focus:ring-0 text-sm font-medium text-gray-800 placeholder-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-lg transition-all border-2 border-black active:translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:shadow-none"
              style={{ 
                  backgroundColor: THEME.colors.accent, 
                  color: '#000',
                  boxShadow: '2px 2px 0px 0px #000'
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualHumas;