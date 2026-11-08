import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Shield,
  Bot,
  User,
  Paperclip,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { LOGO_PATH, APP_NAME_KU, HOTLINE_NUMBER } from '../constants/theme';
import { ChatMessage } from '../types';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  linkedTrackingCode?: string;
  onClearLinkedTrackingCode?: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onToggle,
  linkedTrackingCode,
  onClearLinkedTrackingCode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages, isAiThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    const userText = inputVal.trim();
    setInputVal('');
    setIsSending(true);

    try {
      // 1. Post to live chat
      const postRes = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: linkedTrackingCode
            ? `[کەیسی ${linkedTrackingCode}]: ${userText}`
            : userText,
          sender: 'citizen',
          senderName: 'هاوڵاتی',
          trackingCode: linkedTrackingCode,
        }),
      });

      const postData = await postRes.json();
      if (postData.success) {
        setMessages((prev) => [...prev, postData.message]);
      }

      // 2. Request AI First-Responder advice (Gemini 3.8 Flash)
      setIsAiThinking(true);
      const aiRes = await fetch('/api/ai/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
        }),
      });

      const aiData = await aiRes.json();
      if (aiData.success && aiData.reply) {
        // Send AI answer as response
        const aiMsgRes = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: aiData.reply,
            sender: 'ai',
            senderName: 'سیستەمی هۆشمەندی هێڵی گەرم',
            trackingCode: linkedTrackingCode,
          }),
        });
        const aiMsgData = await aiMsgRes.json();
        if (aiMsgData.success) {
          setMessages((prev) => [...prev, aiMsgData.message]);
        }
      }
    } catch (err) {
      console.error('Chat send error:', err);
    } finally {
      setIsSending(false);
      setIsAiThinking(false);
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm shadow-2xl shadow-red-950/80 border-2 border-amber-300/40 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
          </div>
          <span className="text-xs sm:text-sm">چاتی ڕاستەوخۆ • هێڵی گەرم</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-[95vw] sm:w-[420px] h-[550px] max-h-[85vh] bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-black flex flex-col overflow-hidden text-slate-100 animate-slideUp">
          {/* Top Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_PATH}
                alt="لوگۆی هێڵی گەرم"
                className="w-9 h-9 object-contain rounded-full border border-amber-500/50"
              />
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>هێڵی گەرمی تاوانە ئەلیکترۆنییەکان</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-amber-300 font-medium">
                  ئەفسەری ئێشکگر و ژیری دەستکردی لێکۆڵینەوە
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Linked Tracking Code Alert Banner */}
          {linkedTrackingCode && (
            <div className="px-3 py-1.5 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300 font-medium">
              <span>بەستراوە بە کەیسی: <strong>{linkedTrackingCode}</strong></span>
              {onClearLinkedTrackingCode && (
                <button
                  onClick={onClearLinkedTrackingCode}
                  className="text-slate-400 hover:text-red-400 text-[10px] underline"
                >
                  لابردن
                </button>
              )}
            </div>
          )}

          {/* Security Guarantee Note */}
          <div className="px-3 py-1 bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>پەیامەکانت بە ڕاستەوخۆ دەگەنە ناوەندی فەرمی</span>
            </span>
            <span className="text-amber-400 font-semibold">تەلەفۆن: {HOTLINE_NUMBER}</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-950/50">
            {messages.map((msg) => {
              const isMe = msg.sender === 'citizen';
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                    {isAi ? (
                      <Bot className="w-3 h-3 text-amber-400" />
                    ) : isMe ? (
                      <User className="w-3 h-3 text-blue-400" />
                    ) : (
                      <Shield className="w-3 h-3 text-emerald-400" />
                    )}
                    <span className="font-semibold text-slate-300">{msg.senderName}</span>
                    <span className="font-mono text-[9px]">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-IQ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? 'bg-amber-600 text-white rounded-br-none shadow-md'
                        : isAi
                        ? 'bg-slate-900 border border-amber-500/40 text-slate-100 rounded-bl-none shadow-md'
                        : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isAiThinking && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-amber-300 w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>ئەفسەری هۆشمەند وەڵام ئامادە دەکات...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="پەیامەکەت بنووسە (هەڕەشە، هاککردن یان پرسیار)..."
              disabled={isSending}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              disabled={isSending || !inputVal.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold disabled:opacity-40 transition-colors shadow-md"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
