import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  Gift,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Share2,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SchemeModal: React.FC = () => {
  const {
    activeSchemeModal,
    setActiveSchemeModal,
    bookmarkedSchemes,
    toggleSchemeBookmark,
    setIsWizardOpen,
    setActiveTab,
    setIsNewAppModalOpen
  } = useApp();

  if (!activeSchemeModal) return null;

  const isSaved = bookmarkedSchemes.includes(activeSchemeModal.id);

  const docList = Array.isArray(activeSchemeModal.documents)
    ? activeSchemeModal.documents
    : typeof activeSchemeModal.documents === 'string'
    ? activeSchemeModal.documents.split(/\r?\n|\. /).filter(d => d.trim().length > 3)
    : [];

  const handleApplyClick = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

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
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeSchemeModal.level === 'Central' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeSchemeModal.level} Scheme
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                {activeSchemeModal.category}
              </span>
              {activeSchemeModal.slug && (
                <span className="text-xs font-mono text-slate-400">
                  ID: #{activeSchemeModal.slug}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {activeSchemeModal.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSchemeBookmark(activeSchemeModal.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Bookmark scheme'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setActiveSchemeModal(null)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheme Overview</h4>
            <p className="leading-relaxed text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {activeSchemeModal.details}
            </p>
          </div>

          {/* Benefits Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Key Financial & Social Benefits</span>
            </div>
            <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed font-medium">
              {activeSchemeModal.benefits}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Eligibility Criteria</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
              {activeSchemeModal.eligibility}
            </div>
          </div>

          {/* Application Procedure */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Application Procedure</span>
            </div>
            <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 text-slate-800 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
              {activeSchemeModal.application}
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Mandatory Documents Required</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docList.length > 0 ? (
                docList.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{doc.replace(/^\d+[\.\)]\s*/, '')}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-500 bg-slate-50 rounded-lg">
                  Standard KYC: Aadhaar Card, Income Certificate, Bank Account Details, and Residence Proof.
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {activeSchemeModal.tags && activeSchemeModal.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {activeSchemeModal.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md">
                  #{t}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveSchemeModal(null);
              setIsWizardOpen(true);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Check My Profile Eligibility</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSchemeModal(null);
                setIsNewAppModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Add to Tracked List
            </button>
            <a
              href="https://www.myscheme.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
