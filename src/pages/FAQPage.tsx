import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FAQS_DATA } from '../data/faqData';
import {
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Mail,
  ShieldCheck,
  Building,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { setIsChatbotOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = ['All', 'schemes', 'documents', 'jobs', 'tracking', 'general'];

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedCategory !== 'All' && faq.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="space-y-1.5 max-w-2xl relative z-10">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-indigo-400/30">
            Citizen Knowledge Base & Helpdesk
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions & Citizen Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Find immediate answers on application processing, official KYC document guidelines, age relaxation rules for exams, and portal grievances.
          </p>
        </div>

        {/* Search */}
        <div className="pt-2 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. e-PAN instant issuance, PM-KISAN KYC, SSC age relaxation)..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-300 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'All' ? 'All Questions' : `${cat} FAQs`}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/40 space-y-3 animate-in fade-in duration-150">
                  <p className="whitespace-pre-line">{faq.answer}</p>
                  
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {faq.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-200/70 text-slate-600 rounded-md font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Citizen Helpline Support Box */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold">Have a specific question not covered here?</h3>
          <p className="text-xs text-slate-300">
            Ask our AI Citizen Assistant or connect directly with official National Citizen Helpdesk services.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

    </div>
  );
};
