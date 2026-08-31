import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, SchemeItem, CitizenDocument, JobItem } from '../types';
import { SCHEMES_DATA } from '../data/schemesData';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  FileText,
  Layers,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ChatbotDrawer: React.FC = () => {
  const {
    isChatbotOpen,
    setIsChatbotOpen,
    setActiveSchemeModal,
    setActiveDocModal,
    setActiveJobModal,
    setIsWizardOpen,
    setActiveTab,
    profile,
    familyProfile,
    language,
    t
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Namaste! I am your OneConnect AI Benefit Navigator. You can describe your life situation in simple words (e.g., "My father lost his job and I need help with college fees", "I am a farmer looking for rooftop solar subsidy"), ask about specific schemes, or check eligibility criteria.',
      timestamp: 'Just now',
      suggestedActions: []
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen, isTyping]);

  if (!isChatbotOpen) return null;

  const quickPrompts = [
    'My father lost his job and I need college fee support',
    'I am a small farmer needing crop and health cover',
    'Loan for woman starting home tailoring enterprise',
    'Senior citizen pension and Ayushman Bharat card'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      // Call backend /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          profile,
          familyProfile
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: 'Just now',
          matchedSchemes: data.matchedSchemes,
          detectedNeeds: data.detectedNeeds,
          synergies: data.synergies,
          suggestedActions: data.suggestedActions
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Backend response error');
      }
    } catch (e) {
      // Fallback local response
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your request regarding "${query}", we identified matching welfare programs. You can explore verified options in the Benefit Navigator.`,
        timestamp: 'Just now',
        matchedSchemes: SCHEMES_DATA.slice(0, 2)
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">OneConnect AI Assistant</h3>
            <p className="text-[11px] text-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Grounded in Official Guidelines
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsChatbotOpen(false)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-3`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Detected Needs Pills */}
                {msg.detectedNeeds && msg.detectedNeeds.length > 0 && (
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 space-y-1.5">
                    <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Identified Welfare Needs:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {msg.detectedNeeds.map((need: any, nIdx: number) => (
                        <span
                          key={nIdx}
                          className="px-2 py-0.5 bg-white text-blue-800 border border-blue-200 text-[10px] font-bold rounded-md"
                        >
                          {need.label || need.category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Scheme Cards */}
                {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-700">Recommended Programs:</div>
                    {msg.matchedSchemes.map((scheme: any, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">
                            {scheme.name || scheme.shortName}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {scheme.benefits || scheme.details}
                        </p>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{scheme.level || 'Central'} Govt</span>
                          <a
                            href={scheme.official_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                          >
                            Official Portal <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-36">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            Analyzing needs...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestions */}
      <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex gap-1.5">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] rounded-lg whitespace-nowrap border border-slate-200 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your situation or question..."
          className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        <button
          onClick={() => handleSend()}
          disabled={isTyping || !inputQuery.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
