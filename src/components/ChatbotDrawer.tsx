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
  Minimize2,
  Maximize2
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
    language,
    t
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: t('chat.welcome'),
      timestamp: 'Just now',
      suggestedActions: []
    }
  ]);

  // Update welcome message if language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg-welcome') {
        return [
          {
            id: 'msg-welcome',
            sender: 'assistant',
            text: t('chat.welcome'),
            timestamp: 'Just now',
            suggestedActions: []
          }
        ];
      }
      return prev;
    });
  }, [language, t]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen, isTyping]);

  if (!isChatbotOpen) return null;

  const quickPrompts = [
    'Schemes for Farmers (PM-KISAN)',
    'Ayushman Bharat ₹5 Lakh Health Card',
    'Jobs for 12th Pass Candidates',
    'How to apply for Instant e-PAN?',
    'SSC CGL Eligibility & Age Limits',
    'Scholarships for Students (NSP)'
  ];

  const handleSend = (textToSend?: string) => {
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

    // AI Query Matching & Intelligent Response Generator
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let matchedSchemes: SchemeItem[] = [];
      let matchedDocs: CitizenDocument[] = [];
      let matchedJobs: JobItem[] = [];

      // 1. Check for documents
      if (q.includes('pan') || q.includes('aadhaar') || q.includes('passport') || q.includes('voter') || q.includes('driving') || q.includes('ration') || q.includes('income cert') || q.includes('caste') || q.includes('birth')) {
        matchedDocs = CITIZEN_DOCUMENTS.filter(d => 
          q.includes(d.name.toLowerCase()) || 
          d.name.toLowerCase().split(' ').some(w => w.length > 3 && q.includes(w)) ||
          d.category.toLowerCase().includes(q)
        ).slice(0, 2);

        if (matchedDocs.length === 0) {
          matchedDocs = CITIZEN_DOCUMENTS.slice(0, 2);
        }
      }

      // 2. Check for jobs
      if (q.includes('job') || q.includes('exam') || q.includes('ssc') || q.includes('upsc') || q.includes('rrb') || q.includes('bank') || q.includes('police') || q.includes('12th') || q.includes('graduate') || q.includes('degree') || q.includes('tnpsc')) {
        matchedJobs = GOV_JOBS_DATA.filter(j => 
          j.job_title.toLowerCase().includes(q) ||
          j.organization.toLowerCase().includes(q) ||
          (q.includes('12th') && j.minimum_qualification.includes('12th')) ||
          (q.includes('graduate') && j.minimum_qualification.includes("Bachelor")) ||
          (q.includes('bank') && (j.organization.includes('IBPS') || j.organization.includes('SBI') || j.organization.includes('RBI'))) ||
          (q.includes('ssc') && j.organization.includes('SSC')) ||
          (q.includes('upsc') && j.organization.includes('UPSC'))
        ).slice(0, 3);
      }

      // 3. Check for schemes
      if (q.includes('scheme') || q.includes('kisan') || q.includes('ayushman') || q.includes('health') || q.includes('pmay') || q.includes('housing') || q.includes('scholarship') || q.includes('mudra') || q.includes('farmer') || q.includes('women') || q.includes('student') || matchedDocs.length === 0 && matchedJobs.length === 0) {
        matchedSchemes = SCHEMES_DATA.filter(s => 
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.tags && s.tags.some(t => q.includes(t.toLowerCase()))) ||
          s.details.toLowerCase().includes(q)
        ).slice(0, 3);

        if (matchedSchemes.length === 0 && matchedDocs.length === 0 && matchedJobs.length === 0) {
          matchedSchemes = SCHEMES_DATA.slice(0, 2);
        }
      }

      // Construct textual answer
      if (q.includes('pm-kisan') || q.includes('kisan') || q.includes('farmer')) {
        reply = `**PM-KISAN Samman Nidhi** provides ₹6,000 per year directly to eligible farmer families across India in three equal installments of ₹2,000. \n\n**Eligibility:** All cultivable landholding farmer families.\n**Documents:** Aadhaar Card, Land Record Copy (Khatauni), and Aadhaar-linked Bank Passbook.`;
      } else if (q.includes('ayushman') || q.includes('health')) {
        reply = `**Ayushman Bharat (PM-JAY)** provides ₹5,00,000 per family/year cashless healthcare cover across 28,000+ impaneled hospitals nationwide for secondary and tertiary hospitalization. Senior citizens aged 70+ are now covered universally.`;
      } else if (q.includes('pan') || q.includes('income tax')) {
        reply = `**Instant e-PAN** can be generated in 10 minutes free of cost on the Income Tax e-filing portal using your Aadhaar number and OTP. For a physical PVC card, you can apply via NSDL/UTIITSL for a fee of ₹107.`;
      } else if (q.includes('12th pass') || q.includes('12th')) {
        reply = `For 12th pass candidates, prominent recruitments include **SSC CHSL** (LDC, JSA, DEO), **SSC GD Constable**, **RRB NTPC Undergraduate Posts**, **NDA Exam**, and **State Police Constables**. Category age relaxations apply (+3 yrs OBC, +5 yrs SC/ST).`;
      } else if (q.includes('scholarship') || q.includes('student')) {
        reply = `Students can apply for Central & State scholarships on the **National Scholarship Portal (scholarships.gov.in)**. Schemes include Post-Matric Scholarships for SC/ST/OBC students, Merit-cum-Means schemes, and CSIR fellowship grants.`;
      } else {
        reply = `Based on your query **"${query}"**, I have identified the relevant official government schemes, citizen documentation services, and recruitment notifications for you:`;
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        referencedItems: [
          ...matchedSchemes.map(s => ({
            type: 'scheme' as const,
            title: s.name,
            id: s.id,
            meta: `${s.level} • ${s.category}`
          })),
          ...matchedDocs.map(d => ({
            type: 'document' as const,
            title: d.name,
            id: d.id,
            meta: `${d.department} • Fee: ${d.estimatedFee}`
          })),
          ...matchedJobs.map(j => ({
            type: 'job' as const,
            title: `${j.job_title} (${j.organization})`,
            id: j.job_id,
            meta: `Min: ${j.minimum_qualification} • Age: ${j.min_age}-${j.max_age} yrs`
          }))
        ]
      };

      setIsTyping(false);
      setMessages(prev => [...prev, assistantMsg]);
    }, 600);
  };

  const handleCardClick = (item: NonNullable<ChatMessage['referencedItems']>[number]) => {
    if (item.type === 'scheme') {
      const scheme = SCHEMES_DATA.find(s => s.id === item.id);
      if (scheme) setActiveSchemeModal(scheme);
    } else if (item.type === 'document') {
      const doc = CITIZEN_DOCUMENTS.find(d => d.id === item.id);
      if (doc) setActiveDocModal(doc);
    } else if (item.type === 'job') {
      const job = GOV_JOBS_DATA.find(j => j.job_id === item.id);
      if (job) setActiveJobModal(job);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chatbot Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">{t('chat.title', 'OneConnect AI Citizen Assistant')}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t('chat.subtitle', 'Official Schemes, Documents & Careers Advisor')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatbotOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-indigo-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Referenced Item Cards */}
                {msg.referencedItems && msg.referencedItems.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Direct Portal Links:
                    </span>
                    {msg.referencedItems.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCardClick(item)}
                        className="p-3 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all shadow-xs flex items-center justify-between gap-2 group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            {item.type === 'scheme' && <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                            {item.type === 'document' && <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            {item.type === 'job' && <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                            <span className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
                              {item.title}
                            </span>
                          </div>
                          {item.meta && (
                            <span className="text-[10px] text-slate-500 block">
                              {item.meta}
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Bot className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Analyzing government datasets...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompt Chips */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-full whitespace-nowrap transition-colors border border-slate-200 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('chat.input_placeholder', 'Type your question in any Indian language...')}
            className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-indigo-200 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
