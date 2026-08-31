import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateJobEligibility, evaluateSchemeEligibility, evaluateDocEligibility } from '../utils/eligibilityEngine';
import { SCHEMES_DATA } from '../data/schemesData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Layers,
  Briefcase,
  FileText,
  User,
  GraduationCap,
  IndianRupee,
  RefreshCw,
  Sliders,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WizardPage: React.FC = () => {
  const {
    profile,
    updateProfile,
    setActiveSchemeModal,
    setActiveJobModal,
    setActiveDocModal,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'schemes' | 'jobs' | 'docs'>('all');

  const handleProfileChange = (field: keyof typeof profile, value: any) => {
    updateProfile({ [field]: value });
  };

  const handleRecalculate = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Evaluate All
  const evaluatedSchemes = SCHEMES_DATA
    .map(s => evaluateSchemeEligibility(s, profile))
    .filter(r => r.isEligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  const evaluatedJobs = GOV_JOBS_DATA
    .map(j => evaluateJobEligibility(j, profile))
    .filter(r => r.isEligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  const evaluatedDocs = CITIZEN_DOCUMENTS
    .map(d => evaluateDocEligibility(d, profile))
    .filter(r => r.isEligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex items-center gap-2 relative z-10">
          <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Rule-Based Government Entitlement & Career Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight relative z-10">
          Smart Eligibility & Scheme Recommendation Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed relative z-10">
          Configure your demographic, educational, and socio-economic profile below. Our engine dynamically tests rules across 450+ schemes and 116+ recruitment exams in real-time.
        </p>
      </div>

      {/* Main Grid: Sidebar Profile Form (Left) & Results View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Profile Controls Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Citizen Profile Parameters</h3>
            </div>
            <button
              onClick={handleRecalculate}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Refresh ↻
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Age */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Age: <strong className="text-blue-600">{profile.age} Years</strong></span>
                <span className="text-[10px] text-slate-400">18 - 100</span>
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={profile.age}
                onChange={(e) => handleProfileChange('age', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Reservation Category</label>
              <select
                value={profile.category}
                onChange={(e) => handleProfileChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="General">General (UR)</option>
                <option value="OBC">OBC (+3 yrs Age Relaxation)</option>
                <option value="SC">SC (+5 yrs Age Relaxation)</option>
                <option value="ST">ST (+5 yrs Age Relaxation)</option>
                <option value="EWS">EWS (Economically Weaker)</option>
                <option value="PwD">PwD / Divyangjan (+10 yrs)</option>
              </select>
            </div>

            {/* Qualification */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Highest Academic Qualification</label>
              <select
                value={profile.qualification}
                onChange={(e) => handleProfileChange('qualification', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="10th Pass">10th / Matriculation Pass</option>
                <option value="12th Pass">12th / Intermediate Pass</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="ITI">ITI Certified</option>
                <option value="Bachelor's Degree">Bachelor's Degree (General/Arts/Sci/Com)</option>
                <option value="B.Tech / B.E (Engineering)">B.Tech / B.E (Engineering)</option>
                <option value="MBBS / Medical">MBBS / Medical Degree</option>
                <option value="LLB (Law)">LLB / Law Degree</option>
                <option value="Master's Degree">Master's / Post Graduate</option>
              </select>
            </div>

            {/* Annual Income */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Annual Family Income</label>
              <select
                value={profile.annualIncome}
                onChange={(e) => handleProfileChange('annualIncome', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="80000">Below ₹1,00,000 (BPL / Antyodaya)</option>
                <option value="180000">₹1,00,000 - ₹2,50,000</option>
                <option value="450000">₹2,50,000 - ₹5,00,000</option>
                <option value="750000">₹5,00,000 - ₹8,00,000 (EWS Limit)</option>
                <option value="1200000">Above ₹8,00,000</option>
              </select>
            </div>

            {/* Employment Status */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Current Employment Status</label>
              <select
                value={profile.employmentStatus}
                onChange={(e) => handleProfileChange('employmentStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Unemployed">Unemployed Jobseeker</option>
                <option value="Student">Regular Enrolled Student</option>
                <option value="Farmer">Farmer / Agricultural Landholder</option>
                <option value="Self-Employed">Self-Employed / MSME Entrepreneur</option>
                <option value="Employed (Private)">Employed in Private Sector</option>
                <option value="Homemaker">Homemaker</option>
              </select>
            </div>

            {/* Special Checkboxes */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Special Attributes:</span>
              
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={profile.isFarmer}
                  onChange={(e) => handleProfileChange('isFarmer', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Farmer / Cultivator</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={profile.isStudent}
                  onChange={(e) => handleProfileChange('isStudent', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Enrolled Student / Scholar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={profile.isDifferentlyAbled}
                  onChange={(e) => handleProfileChange('isDifferentlyAbled', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Person with Disability (PwD)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Results (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Results Metrics Tabs */}
          <div className="grid grid-cols-3 gap-3">
            <div 
              onClick={() => setActiveSubTab('schemes')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeSubTab === 'schemes' || activeSubTab === 'all'
                  ? 'bg-blue-50/80 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Eligible Schemes</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-extrabold text-blue-700 mt-2 block">{evaluatedSchemes.length}</span>
              <span className="text-[11px] text-blue-800/80 mt-0.5 block">Welfare & Subsidies</span>
            </div>

            <div 
              onClick={() => setActiveSubTab('jobs')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeSubTab === 'jobs' || activeSubTab === 'all'
                  ? 'bg-purple-50/80 border-purple-200 shadow-xs'
                  : 'bg-white border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Qualified Exams</span>
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-2xl font-extrabold text-purple-700 mt-2 block">{evaluatedJobs.length}</span>
              <span className="text-[11px] text-purple-800/80 mt-0.5 block">Govt Recruitment Posts</span>
            </div>

            <div 
              onClick={() => setActiveSubTab('docs')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeSubTab === 'docs' || activeSubTab === 'all'
                  ? 'bg-emerald-50/80 border-emerald-200 shadow-xs'
                  : 'bg-white border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Key Documents</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-700 mt-2 block">{evaluatedDocs.length}</span>
              <span className="text-[11px] text-emerald-800/80 mt-0.5 block">Essential Citizen IDs</span>
            </div>
          </div>

          {/* Sub-Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            {(['all', 'schemes', 'jobs', 'docs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                  activeSubTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Matches' : tab}
              </button>
            ))}
          </div>

          {/* Schemes Section */}
          {(activeSubTab === 'all' || activeSubTab === 'schemes') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Top Qualified Welfare Schemes ({evaluatedSchemes.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {evaluatedSchemes.slice(0, 8).map(({ scheme, matchScore, reasons }) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            {scheme.level} Scheme
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {matchScore}% Profile Match
                          </span>
                        </div>
                        <h4 
                          onClick={() => setActiveSchemeModal(scheme)}
                          className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {scheme.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => setActiveSchemeModal(scheme)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors shrink-0"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed">
                      <strong>Entitlement Benefit:</strong> {scheme.benefits}
                    </div>

                    {reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 text-[11px] text-emerald-800">
                        {reasons.map((r, idx) => (
                          <span key={idx} className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{r}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Section */}
          {(activeSubTab === 'all' || activeSubTab === 'jobs') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Qualified Recruitment Exams & Positions ({evaluatedJobs.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {evaluatedJobs.slice(0, 8).map(({ job, effectiveMaxAge, matchScore, reasons }) => (
                  <div
                    key={job.job_id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            {job.organization}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {matchScore}% Match
                          </span>
                        </div>
                        <h4 
                          onClick={() => setActiveJobModal(job)}
                          className="text-base font-bold text-slate-900 hover:text-purple-600 cursor-pointer transition-colors"
                        >
                          {job.job_title}
                        </h4>
                      </div>

                      <button
                        onClick={() => setActiveJobModal(job)}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition-colors shrink-0"
                      >
                        View Post
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                      <div>
                        <span className="text-slate-400 block font-medium">Min Qualification</span>
                        <span className="font-bold text-slate-900">{job.minimum_qualification}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Your Max Age Limit</span>
                        <span className="font-bold text-emerald-700">Up to {effectiveMaxAge} yrs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Pay Scale</span>
                        <span className="font-semibold text-slate-900 truncate block">{job.salary || '7th CPC'}</span>
                      </div>
                    </div>

                    {reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 text-[11px] text-purple-800">
                        {reasons.map((r, idx) => (
                          <span key={idx} className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                            <CheckCircle2 className="w-3 h-3 text-purple-600" />
                            <span>{r}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {(activeSubTab === 'all' || activeSubTab === 'docs') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Essential Citizen Verification Documents ({evaluatedDocs.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {evaluatedDocs.map(({ document: doc, matchScore, reasons }) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                          {doc.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">{matchScore}% Required</span>
                      </div>
                      <h4 
                        onClick={() => setActiveDocModal(doc)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {doc.name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{doc.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Fee: {doc.estimatedFee}</span>
                      <button
                        onClick={() => setActiveDocModal(doc)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        View Checklist →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
