import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateCategoryAgeRelaxation } from '../utils/eligibilityEngine';
import {
  X,
  Bookmark,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Calendar,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Building,
  Sparkles,
  ArrowRight,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobModal: React.FC = () => {
  const {
    activeJobModal,
    setActiveJobModal,
    bookmarkedJobs,
    toggleJobBookmark,
    profile,
    setIsWizardOpen,
    setIsNewAppModalOpen
  } = useApp();

  if (!activeJobModal) return null;

  const isSaved = bookmarkedJobs.includes(activeJobModal.job_id);

  const categoryAgeRelaxation = calculateCategoryAgeRelaxation(profile.category);
  const effectiveMaxAge = activeJobModal.max_age + categoryAgeRelaxation;
  const isAgeEligible = profile.age >= activeJobModal.min_age && profile.age <= effectiveMaxAge;

  const handleApplyClick = () => {
    confetti({
      particleCount: 35,
      spread: 50,
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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {activeJobModal.organization}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                {activeJobModal.government_level} Level
              </span>
              <span className="text-xs font-mono text-slate-400">
                Post #{activeJobModal.job_id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {activeJobModal.job_title}
            </h2>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>{activeJobModal.organization} • Location: {activeJobModal.location}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleJobBookmark(activeJobModal.job_id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Bookmark job'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setActiveJobModal(null)}
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
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Pay Scale / Salary</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">
                {activeJobModal.salary || 'Standard 7th CPC'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Min Qualification</span>
              <span className="text-xs sm:text-sm font-bold text-blue-700 mt-1 block">
                {activeJobModal.minimum_qualification}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Age Limits (General)</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">
                {activeJobModal.min_age} - {activeJobModal.max_age} yrs
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Experience</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">
                {activeJobModal.experience_required}
              </span>
            </div>
          </div>

          {/* Profile Fit & Category Relaxation Box */}
          <div className={`p-4 rounded-xl border ${
            isAgeEligible 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Eligibility for your profile ({profile.category} Category, Age {profile.age})</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isAgeEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isAgeEligible ? 'Age Eligible' : 'Age Over/Under Limit'}
              </span>
            </div>
            <p className="text-xs mt-1.5 leading-relaxed">
              With your <strong>{profile.category}</strong> category (+{categoryAgeRelaxation} yrs relaxation), maximum eligible age is <strong>{effectiveMaxAge} years</strong>. Your current age is {profile.age} years.
            </p>
          </div>

          {/* Specialization & Education */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Academic Qualification & Stream Requirement</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="font-semibold text-slate-700">Minimum Degree / Education:</span>
                <span className="font-bold text-slate-900">{activeJobModal.minimum_qualification}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="font-semibold text-slate-700">Specialization / Discipline:</span>
                <span className="font-bold text-slate-900">{activeJobModal.specialization || 'Any Stream'}</span>
              </div>
              {activeJobModal.minimum_percentage && (
                <div className="flex items-start justify-between gap-4">
                  <span className="font-semibold text-slate-700">Minimum Marks Percentage:</span>
                  <span className="font-bold text-slate-900">{activeJobModal.minimum_percentage}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Selection Process */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span>Selection Process & Examination Stages</span>
            </h4>
            <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
              {activeJobModal.selection_process}
            </div>
          </div>

          {/* Source Note & Notification Advice */}
          {activeJobModal.source_note && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{activeJobModal.source_note}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveJobModal(null);
              setIsWizardOpen(true);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Recalculate with Full Profile</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveJobModal(null);
                setIsNewAppModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Add to Tracking
            </button>
            <a
              href={activeJobModal.official_url || 'https://ssc.gov.in'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <span>Official Recruitment Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
