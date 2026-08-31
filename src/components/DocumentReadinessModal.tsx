import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateDocumentReadiness, DocumentGuidanceDetail } from '../server/documentReadinessEngine';
import { DocumentReadinessCheck } from '../types';

interface Props {
  schemeId: number | string;
  schemeName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentReadinessModal: React.FC<Props> = ({
  schemeId,
  schemeName,
  isOpen,
  onClose
}) => {
  const { userDocumentsChecklist, updateDocumentStatus, t } = useApp();
  const [readinessData, setReadinessData] = useState<DocumentReadinessCheck | null>(null);
  const [selectedDocGuidance, setSelectedDocGuidance] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && schemeId) {
      const result = evaluateDocumentReadiness(schemeId, userDocumentsChecklist);
      setReadinessData(result);
    }
  }, [isOpen, schemeId, userDocumentsChecklist]);

  if (!isOpen || !readinessData) return null;

  const getStatusColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (pct >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getMeterColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Document Readiness Checker</h2>
              <p className="text-xs text-slate-300 line-clamp-1">{schemeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Readiness Score Card */}
          <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${getStatusColor(readinessData.readinessPercentage)}`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Application Readiness</div>
              <div className="text-3xl font-extrabold flex items-baseline gap-2">
                {readinessData.readinessPercentage}%
                <span className="text-xs font-medium">
                  ({readinessData.availableCount} of {readinessData.totalRequired} documents ready)
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600">
                {readinessData.readinessPercentage === 100
                  ? 'All mandatory documentation is verified and ready for portal submission.'
                  : readinessData.readinessPercentage >= 60
                  ? 'Most documents available. Procure missing certificates before applying.'
                  : 'Critical certificates are missing. Application may be rejected during verification scrutiny.'}
              </p>
            </div>
            <div className="w-24 h-24 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={readinessData.readinessPercentage >= 80 ? 'text-emerald-500' : readinessData.readinessPercentage >= 50 ? 'text-amber-500' : 'text-rose-500'}
                  strokeDasharray={`${readinessData.readinessPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-bold text-slate-800">
                {readinessData.readinessPercentage}%
              </span>
            </div>
          </div>

          {/* Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Required Documents Scrutiny</h3>
              <span className="text-xs text-slate-500">Click to update your availability</span>
            </div>

            <div className="space-y-3">
              {readinessData.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    doc.status === 'available'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : doc.status === 'not_sure'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {doc.status === 'available' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {doc.status === 'not_sure' && <HelpCircle className="w-5 h-5 text-amber-500" />}
                        {doc.status === 'missing' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{doc.documentName}</div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{doc.guidance}</p>
                      </div>
                    </div>

                    {/* Status Selectors */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => updateDocumentStatus(doc.documentName, 'available')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          doc.status === 'available'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        ✓ Ready
                      </button>
                      <button
                        onClick={() => updateDocumentStatus(doc.documentName, 'not_sure')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          doc.status === 'not_sure'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        ? Not Sure
                      </button>
                      <button
                        onClick={() => updateDocumentStatus(doc.documentName, 'missing')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          doc.status === 'missing'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        ✗ Missing
                      </button>
                    </div>
                  </div>

                  {/* Guidance Drawer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="italic">Issuing Authority: State Revenue / e-District / UIDAI</span>
                    <button
                      onClick={() => setSelectedDocGuidance(selectedDocGuidance === doc.documentName ? null : doc.documentName)}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      {selectedDocGuidance === doc.documentName ? 'Hide Guidance' : 'View Guidance'}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {selectedDocGuidance === doc.documentName && (
                    <div className="mt-3 p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-blue-900">How to Obtain {doc.documentName}:</div>
                      <p>{doc.guidance}</p>
                      <p className="text-slate-500">
                        Tip: You can download digital verified copies via DigiLocker or visit your nearest Tehsildar / Common Service Center (CSC).
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong>Citizen Notice:</strong> Document readiness indicates that required certificates are in your possession. Official verification officers will evaluate validity and authenticity during portal submission.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Checklist saves automatically to your profile
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
