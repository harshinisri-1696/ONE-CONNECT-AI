import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GOV_JOBS_DATA } from '../data/jobsData';
import { calculateCategoryAgeRelaxation } from '../utils/eligibilityEngine';
import {
  Search,
  Briefcase,
  Building,
  GraduationCap,
  Sparkles,
  Calendar,
  IndianRupee,
  ChevronRight,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const {
    globalSearch,
    setGlobalSearch,
    setActiveJobModal,
    bookmarkedJobs,
    toggleJobBookmark,
    profile,
    setIsWizardOpen
  } = useApp();

  const [selectedOrg, setSelectedOrg] = useState<string>('All');
  const [selectedQual, setSelectedQual] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const organizations = [
    'All',
    'SSC',
    'UPSC',
    'RRB / Railway',
    'IBPS / Banking',
    'State PSC',
    'Defense',
    'Police',
    'PSU & Scientific'
  ];

  const qualifications = [
    'All',
    '10th',
    '12th',
    'Bachelor',
    'Engineering',
    'Medical',
    'Law',
    'Diploma',
    'ITI'
  ];

  const categoryAgeRelaxation = calculateCategoryAgeRelaxation(profile.category);

  const filteredJobs = useMemo(() => {
    return GOV_JOBS_DATA.filter((job) => {
      // 1. Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matches =
          job.job_title.toLowerCase().includes(q) ||
          job.organization.toLowerCase().includes(q) ||
          job.minimum_qualification.toLowerCase().includes(q) ||
          job.specialization.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Organization filter
      if (selectedOrg !== 'All') {
        if (selectedOrg === 'SSC' && !job.organization.includes('SSC')) return false;
        if (selectedOrg === 'UPSC' && !job.organization.includes('UPSC')) return false;
        if (selectedOrg === 'RRB / Railway' && !job.organization.includes('Railway') && !job.organization.includes('RRB')) return false;
        if (selectedOrg === 'IBPS / Banking' && !job.organization.includes('Bank') && !job.organization.includes('IBPS') && !job.organization.includes('RBI') && !job.organization.includes('SBI')) return false;
        if (selectedOrg === 'State PSC' && !job.organization.includes('PSC')) return false;
        if (selectedOrg === 'Defense' && !job.organization.includes('Defense') && !job.organization.includes('Army') && !job.organization.includes('Navy') && !job.organization.includes('Air Force') && !job.organization.includes('NDA')) return false;
        if (selectedOrg === 'Police' && !job.organization.includes('Police') && !job.organization.includes('Constable') && !job.organization.includes('SI')) return false;
        if (selectedOrg === 'PSU & Scientific' && !job.organization.includes('ISRO') && !job.organization.includes('DRDO') && !job.organization.includes('BARC') && !job.organization.includes('IOCL') && !job.organization.includes('ONGC') && !job.organization.includes('NTPC')) return false;
      }

      // 3. Qualification filter
      if (selectedQual !== 'All') {
        const minQ = job.minimum_qualification.toLowerCase();
        if (selectedQual === '10th' && !minQ.includes('10th') && !minQ.includes('matric')) return false;
        if (selectedQual === '12th' && !minQ.includes('12th') && !minQ.includes('higher secondary') && !minQ.includes('intermediate')) return false;
        if (selectedQual === 'Bachelor' && !minQ.includes('bachelor') && !minQ.includes('graduate') && !minQ.includes('degree')) return false;
        if (selectedQual === 'Engineering' && !minQ.includes('engineering') && !minQ.includes('b.tech') && !minQ.includes('b.e')) return false;
        if (selectedQual === 'Medical' && !minQ.includes('mbbs') && !minQ.includes('bds') && !minQ.includes('nursing') && !minQ.includes('medical')) return false;
        if (selectedQual === 'Law' && !minQ.includes('llb') && !minQ.includes('law')) return false;
        if (selectedQual === 'Diploma' && !minQ.includes('diploma') && !minQ.includes('polytechnic')) return false;
        if (selectedQual === 'ITI' && !minQ.includes('iti')) return false;
      }

      // 4. Level filter
      if (selectedLevel !== 'All' && job.government_level !== selectedLevel) {
        return false;
      }

      return true;
    });
  }, [globalSearch, selectedOrg, selectedQual, selectedLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-indigo-400/30">
              National Public Careers Registry
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              116+ Government Jobs & Recruitment Exams
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Curated notifications across Central & State commissions. Automatic calculation of age relaxations for <strong>{profile.category}</strong> category (+{categoryAgeRelaxation} yrs).
            </p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Check Qualified Exams</span>
          </button>
        </div>

        {/* Search */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search by Exam title, Board (SSC, UPSC, RRB), Stream, or Location..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-300 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        
        {/* Organization chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Board:</span>
          {organizations.map((org) => {
            const isSelected = selectedOrg === org;
            return (
              <button
                key={org}
                onClick={() => setSelectedOrg(org)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {org}
              </button>
            );
          })}
        </div>

        {/* Qualification & Level Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="font-bold text-slate-500 shrink-0">Min Qualification:</span>
            {qualifications.map((qual) => (
              <button
                key={qual}
                onClick={() => setSelectedQual(qual)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedQual === qual
                    ? 'bg-indigo-100 text-indigo-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {qual}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Showing <strong>{filteredJobs.length}</strong> Openings</span>
          </div>

        </div>

      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const isSaved = bookmarkedJobs.includes(job.job_id);
          const effectiveMaxAge = job.max_age + categoryAgeRelaxation;
          const isAgeEligible = profile.age >= job.min_age && profile.age <= effectiveMaxAge;

          return (
            <div
              key={job.job_id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                      {job.organization}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {job.government_level}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleJobBookmark(job.job_id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3
                  onClick={() => setActiveJobModal(job)}
                  className="text-base font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2"
                >
                  {job.job_title}
                </h3>

                {/* Specs Box */}
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Min Education:</span>
                    <span className="font-bold text-slate-900 text-right">{job.minimum_qualification}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">General Age Limit:</span>
                    <span className="font-medium text-slate-800">{job.min_age} - {job.max_age} yrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">For {profile.category} (+{categoryAgeRelaxation}y):</span>
                    <span className={`font-bold ${isAgeEligible ? 'text-emerald-700' : 'text-rose-700'}`}>
                      Up to {effectiveMaxAge} yrs {isAgeEligible ? '✓' : '(Over)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Pay Scale:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[140px]">{job.salary || '7th CPC Scale'}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  <strong>Selection:</strong> {job.selection_process}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                  📍 {job.location}
                </span>
                <button
                  onClick={() => setActiveJobModal(job)}
                  className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>View Post</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
