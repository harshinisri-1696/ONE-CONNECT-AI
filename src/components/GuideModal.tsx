import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APPLICATION_GUIDES, CITIZEN_DOCUMENTS } from '../data/documentsData';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Building2,
  ExternalLink,
  Printer,
  Sparkles,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuideModal: React.FC = () => {
  const { activeGuideModal, setActiveGuideModal, setActiveDocModal } = useApp();
  const [selectedMode, setSelectedMode] = useState<'online' | 'offline'>('online');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!activeGuideModal) return null;

  const guide = APPLICATION_GUIDES[activeGuideModal.docId];
  const doc = CITIZEN_DOCUMENTS.find(d => d.id === activeGuideModal.docId);

  const mode = activeGuideModal.mode || selectedMode;
  const currentSteps = mode === 'online' ? guide?.onlineSteps : guide?.offlineSteps;

  const toggleCheck = (key: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // check if all items in step completed
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!guide) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white p-6 rounded-2xl max-w-md w-full text-center space-y-4">
          <p className="text-sm text-slate-700">Detailed interactive guide coming soon for this document.</p>
          <button
            onClick={() => setActiveGuideModal(null)}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Official Application Guide
              </span>
              {doc && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                  {doc.department}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Step-by-Step Guide: {guide.documentName}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {guide.overview}
            </p>
          </div>

          <button
            onClick={() => setActiveGuideModal(null)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tab & Quick Action */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedMode('online')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMode === 'online'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Online Portal Process</span>
            </button>
            <button
              onClick={() => setSelectedMode('offline')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMode === 'offline'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Offline Center (CSC / Seva Kendra)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={guide.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-800">
          
          {/* Vertical Timeline Steps */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Application Milestones ({currentSteps?.length || 0} Steps)
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {currentSteps?.map((step) => (
                <div key={step.stepNumber} className="relative group">
                  {/* Step Number Dot */}
                  <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow-xs">
                    {step.stepNumber}
                  </div>

                  {/* Step Body Card */}
                  <div className="bg-slate-50 hover:bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {step.title}
                      </h3>
                      {step.estimatedDuration && (
                        <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          ⏱ {step.estimatedDuration}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Interactive Checklist */}
                    {step.checklistItems && step.checklistItems.length > 0 && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200/60 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Step Checklist
                        </span>
                        <div className="space-y-1">
                          {step.checklistItems.map((item, cIdx) => {
                            const key = `${step.stepNumber}-${cIdx}`;
                            const isDone = !!checkedItems[key];
                            return (
                              <div
                                key={cIdx}
                                onClick={() => toggleCheck(key)}
                                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none py-0.5 hover:text-slate-900"
                              >
                                {isDone ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className={isDone ? 'line-through text-slate-400' : ''}>
                                  {item}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pro Tip / Warning */}
                    {step.tip && (
                      <div className="flex items-start gap-2 text-xs text-blue-900 bg-blue-50/80 p-3 rounded-lg border border-blue-100 font-medium">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span><strong>Pro-Tip:</strong> {step.tip}</span>
                      </div>
                    )}
                    {step.warning && (
                      <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 font-medium">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Important Note:</strong> {step.warning}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Post-Submission */}
          {guide.verificationProcess && (
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5 text-xs text-purple-950">
              <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Verification & Issuance Lifecycle</span>
              </h4>
              <p className="leading-relaxed">{guide.verificationProcess}</p>
            </div>
          )}

          {/* Common Mistakes */}
          {guide.commonMistakes && guide.commonMistakes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Common Mistakes Leading to Rejection</span>
              </h4>
              <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-4 space-y-1.5 text-xs text-rose-950">
                {guide.commonMistakes.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">•</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (doc) {
                setActiveGuideModal(null);
                setActiveDocModal(doc);
              } else {
                setActiveGuideModal(null);
              }
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Back to Document Info
          </button>

          <a
            href={guide.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all"
          >
            <span>Proceed to Official Government Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
