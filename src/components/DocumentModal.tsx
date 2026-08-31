import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  CreditCard,
  Building,
  HelpCircle,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DocumentModal: React.FC = () => {
  const {
    activeDocModal,
    setActiveDocModal,
    bookmarkedDocs,
    toggleDocBookmark,
    setActiveGuideModal,
    setIsNewAppModalOpen
  } = useApp();

  if (!activeDocModal) return null;

  const isSaved = bookmarkedDocs.includes(activeDocModal.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                {activeDocModal.category} Document
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                {activeDocModal.department}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                activeDocModal.difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeDocModal.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                Difficulty: {activeDocModal.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {activeDocModal.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleDocBookmark(activeDocModal.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Bookmark document'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setActiveDocModal(null)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Key Facts Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Estimated Fee</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">{activeDocModal.estimatedFee}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Processing Time</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">{activeDocModal.processingTime}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Validity Period</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">{activeDocModal.validity}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Helpline</span>
              <span className="text-sm font-bold text-blue-600 mt-1 block">{activeDocModal.helpline}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description & Purpose</h4>
            <p className="leading-relaxed text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {activeDocModal.description}
            </p>
          </div>

          {/* Prerequisites */}
          {activeDocModal.prerequisites && activeDocModal.prerequisites.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Prerequisites Before Applying</span>
              </h4>
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 space-y-1.5 text-xs text-amber-950">
                {activeDocModal.prerequisites.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements Checklist Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Required Verification Documents Checklist</span>
            </h4>
            <div className="space-y-2.5">
              {activeDocModal.requirements.map(req => (
                <div key={req.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{req.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.mandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {req.mandatory ? 'Mandatory' : 'Optional / Alternative'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {req.acceptedDocs.map((acc, aIdx) => (
                      <span key={aIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Guidelines */}
          {activeDocModal.usageGuidelines && activeDocModal.usageGuidelines.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Usage Guidelines & Legal Utility</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-700 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                {activeDocModal.usageGuidelines.map((ug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              const docId = activeDocModal.id;
              setActiveDocModal(null);
              setActiveGuideModal({ docId, mode: 'online' });
            }}
            className="flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Open Step-by-Step Application Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveDocModal(null);
                setIsNewAppModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Track Application
            </button>
            <a
              href={activeDocModal.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <span>Official Government Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
