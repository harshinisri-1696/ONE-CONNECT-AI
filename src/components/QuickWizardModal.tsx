import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateJobEligibility, evaluateSchemeEligibility, evaluateDocEligibility } from '../utils/eligibilityEngine';
import { SCHEMES_DATA } from '../data/schemesData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Briefcase,
  FileText,
  User,
  GraduationCap,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuickWizardModal: React.FC = () => {
  const {
    isWizardOpen,
    setIsWizardOpen,
    profile,
    updateProfile,
    setActiveTab,
    setActiveSchemeModal,
    setActiveJobModal,
    setActiveDocModal
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [localAge, setLocalAge] = useState(profile.age);
  const [localQual, setLocalQual] = useState(profile.qualification);
  const [localCategory, setLocalCategory] = useState(profile.category);
  const [localIncome, setLocalIncome] = useState(profile.annualIncome);
  const [localStatus, setLocalStatus] = useState(profile.employmentStatus);
  const [localIsFarmer, setLocalIsFarmer] = useState(profile.isFarmer);
  const [localIsStudent, setLocalIsStudent] = useState(profile.isStudent);
  const [localIsDifferentlyAbled, setLocalIsDifferentlyAbled] = useState(profile.isDifferentlyAbled);

  if (!isWizardOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      age: Number(localAge),
      qualification: localQual,
      category: localCategory as any,
      annualIncome: Number(localIncome),
      employmentStatus: localStatus as any,
      isFarmer: localIsFarmer,
      isStudent: localIsStudent,
      isDifferentlyAbled: localIsDifferentlyAbled
    });
    setStep(2);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Compute matched items
  const tempProfile = {
    ...profile,
    age: Number(localAge),
    qualification: localQual,
    category: localCategory as any,
    annualIncome: Number(localIncome),
    employmentStatus: localStatus as any,
    isFarmer: localIsFarmer,
    isStudent: localIsStudent,
    isDifferentlyAbled: localIsDifferentlyAbled
  };

  const eligibleSchemes = SCHEMES_DATA
    .map(s => evaluateSchemeEligibility(s, tempProfile))
    .filter(r => r.isEligible)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const eligibleJobs = GOV_JOBS_DATA
    .map(j => evaluateJobEligibility(j, tempProfile))
    .filter(r => r.isEligible)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const eligibleDocs = CITIZEN_DOCUMENTS
    .map(d => evaluateDocEligibility(d, tempProfile))
    .filter(r => r.isEligible)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Quick Eligibility Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {step === 1 ? 'Check Your Citizen Entitlements' : 'Your Eligibility Matches'}
            </h2>
            <p className="text-xs text-slate-300">
              {step === 1
                ? 'Answer 4 quick questions to instantly discover qualified schemes, jobs & documents.'
                : `Matched based on age ${localAge}, ${localCategory} category, ${localQual}.`}
            </p>
          </div>

          <button
            onClick={() => {
              setIsWizardOpen(false);
              setStep(1);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {step === 1 ? (
          <form onSubmit={handleCalculate} className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
            {/* Age & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Your Current Age (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={localAge}
                  onChange={(e) => setLocalAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Reservation Category</label>
                <select
                  value={localCategory}
                  onChange={(e) => setLocalCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
                >
                  <option value="General">General (UR)</option>
                  <option value="OBC">OBC (Non-Creamy Layer: +3 yrs)</option>
                  <option value="SC">SC (+5 yrs age relaxation)</option>
                  <option value="ST">ST (+5 yrs age relaxation)</option>
                  <option value="EWS">EWS (Economically Weaker)</option>
                  <option value="PwD">PwD / Divyangjan (+10 yrs)</option>
                </select>
              </div>
            </div>

            {/* Qualification & Income */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Highest Education</label>
                <select
                  value={localQual}
                  onChange={(e) => setLocalQual(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
                >
                  <option value="10th Pass">10th / Matriculation Pass</option>
                  <option value="12th Pass">12th / Intermediate Pass</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="ITI">ITI Certified</option>
                  <option value="Bachelor's Degree">Bachelor's Degree (Any Stream)</option>
                  <option value="B.Tech / B.E (Engineering)">B.Tech / B.E (Engineering)</option>
                  <option value="MBBS / Medical">MBBS / Medical Degree</option>
                  <option value="LLB (Law)">LLB / Law Degree</option>
                  <option value="Master's Degree">Master's / Post Graduate</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Annual Family Income</label>
                <select
                  value={localIncome}
                  onChange={(e) => setLocalIncome(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
                >
                  <option value="80000">Below ₹1,00,000 (BPL / EWS)</option>
                  <option value="180000">₹1,00,000 - ₹2,50,000</option>
                  <option value="450000">₹2,50,000 - ₹5,00,000</option>
                  <option value="750000">₹5,00,000 - ₹8,00,000</option>
                  <option value="1200000">Above ₹8,00,000</option>
                </select>
              </div>
            </div>

            {/* Employment Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Current Occupation / Status</label>
              <select
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
              >
                <option value="Unemployed">Unemployed Jobseeker</option>
                <option value="Student">Regular Enrolled Student</option>
                <option value="Farmer">Farmer / Agricultural Worker</option>
                <option value="Self-Employed">Self-Employed / MSME Owner</option>
                <option value="Employed (Private)">Employed in Private Sector</option>
                <option value="Homemaker">Homemaker</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Special Beneficiary Tags</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={localIsFarmer}
                    onChange={(e) => setLocalIsFarmer(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Farmer / Landholder</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={localIsStudent}
                    onChange={(e) => setLocalIsStudent(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Bonafide Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={localIsDifferentlyAbled}
                    onChange={(e) => setLocalIsDifferentlyAbled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Differently-Abled (PwD)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Calculate Instant Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
            {/* Top Stat Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <span className="text-xl font-extrabold text-blue-700">{eligibleSchemes.length}+</span>
                <span className="text-[11px] font-semibold text-blue-900 block mt-0.5">Top Schemes</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <span className="text-xl font-extrabold text-purple-700">{eligibleJobs.length}+</span>
                <span className="text-[11px] font-semibold text-purple-900 block mt-0.5">Govt Exams</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-xl font-extrabold text-emerald-700">{eligibleDocs.length}</span>
                <span className="text-[11px] font-semibold text-emerald-900 block mt-0.5">Key Documents</span>
              </div>
            </div>

            {/* Matched Schemes */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Top Eligible Welfare Schemes</span>
                </h4>
                <button
                  onClick={() => {
                    setIsWizardOpen(false);
                    setActiveTab('schemes');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2">
                {eligibleSchemes.map(({ scheme, matchScore }) => (
                  <div
                    key={scheme.id}
                    onClick={() => {
                      setIsWizardOpen(false);
                      setActiveSchemeModal(scheme);
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{scheme.name}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                          {matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{scheme.benefits}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Jobs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Top Eligible Recruitment Posts</span>
                </h4>
                <button
                  onClick={() => {
                    setIsWizardOpen(false);
                    setActiveTab('jobs');
                  }}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2">
                {eligibleJobs.map(({ job, effectiveMaxAge, matchScore }) => (
                  <div
                    key={job.job_id}
                    onClick={() => {
                      setIsWizardOpen(false);
                      setActiveJobModal(job);
                    }}
                    className="p-3 bg-slate-50 hover:bg-purple-50/50 rounded-xl border border-slate-200/80 cursor-pointer transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{job.job_title}</span>
                        <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
                          {job.organization}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Age limit with {localCategory} relaxation: up to {effectiveMaxAge} yrs • {job.minimum_qualification}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjust Criteria</span>
              </button>

              <button
                onClick={() => {
                  setIsWizardOpen(false);
                  setActiveTab('wizard');
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
              >
                Open Full Detailed Calculator →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
