import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCHEMES_DATA } from '../data/schemesData';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import {
  Search,
  Sparkles,
  Layers,
  FileText,
  Briefcase,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Users,
  Award,
  HelpCircle,
  PhoneCall,
  HeartHandshake,
  Landmark,
  GraduationCap,
  HeartPulse,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HomePage: React.FC = () => {
  const {
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    setActiveSchemeModal,
    setActiveDocModal,
    setActiveJobModal,
    setActiveGuideModal,
    setIsWizardOpen,
    setIsChatbotOpen,
    bookmarkedSchemes,
    toggleSchemeBookmark,
    navigateToTracking,
    t
  } = useApp();

  const [trackSearchId, setTrackSearchId] = useState('');

  const featuredSchemes = SCHEMES_DATA.slice(0, 6);
  const popularDocs = CITIZEN_DOCUMENTS.slice(0, 6);
  const featuredJobs = GOV_JOBS_DATA.slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setActiveTab('schemes');
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackSearchId.trim()) {
      navigateToTracking(trackSearchId.trim());
    }
  };

  const categories = [
    {
      id: 'agri',
      name: t('cat.agriculture', 'Agriculture & Farming'),
      icon: <Landmark className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200/80',
      count: '80+ Schemes',
      query: 'Agriculture'
    },
    {
      id: 'health',
      name: t('cat.healthcare', 'Health & Wellness'),
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200/80',
      count: '45+ Subsidies',
      query: 'Health'
    },
    {
      id: 'edu',
      name: t('cat.education', 'Education & Scholarships'),
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100/70 border-blue-200/80',
      count: '95+ Grants',
      query: 'Education'
    },
    {
      id: 'welfare',
      name: t('cat.social_welfare', 'Social Welfare & Housing'),
      icon: <HeartHandshake className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 hover:bg-purple-100/70 border-purple-200/80',
      count: '110+ Programs',
      query: 'Social welfare'
    },
    {
      id: 'business',
      name: 'Business & MSME Loans',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200/80',
      count: '60+ Grants',
      query: 'Business'
    },
    {
      id: 'docs',
      name: t('doc_cat.identity', 'Citizen Identity & Cards'),
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200/80',
      count: '16+ Services',
      query: 'identity'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle Decorative Background Gradient Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Unified National Single-Window Portal for Citizens</span>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Discover Government Schemes, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-200">
                Citizen Documents & Public Careers
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              One unified platform combining <strong>450+ verified Central & State welfare schemes</strong>, step-by-step <strong>citizen document application guides</strong>, and <strong>116+ government recruitment exams</strong>.
            </p>
          </div>

          {/* Big Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-white p-1.5 border-2 border-blue-500/30 focus-within:border-blue-500 transition-all">
              <Search className="w-5 h-5 ml-3 text-slate-400 shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search schemes (PM Kisan, Ayushman), docs (PAN, Passport), or jobs (SSC, UPSC)..."
                className="w-full px-3 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span className="text-slate-400 text-[11px]">Popular Searches:</span>
              {['PM-KISAN ₹6000', 'Ayushman Bharat', 'Instant e-PAN', 'SSC CGL 2024', 'NSP Scholarships', 'Passport Guide'].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGlobalSearch(chip.split(' ')[0]);
                    setActiveTab('schemes');
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400">450+</span>
              <span className="text-xs text-slate-400 block mt-1">Central & State Schemes</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">16+</span>
              <span className="text-xs text-slate-400 block mt-1">Essential Citizen Docs</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400">116+</span>
              <span className="text-xs text-slate-400 block mt-1">Official Govt Exams</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</span>
              <span className="text-xs text-slate-400 block mt-1">Free Citizen Service</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Quick Action Cards Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10 relative z-10">
          
          {/* Card 1: Check Eligibility */}
          <div 
            onClick={() => setIsWizardOpen(true)}
            className="p-6 rounded-2xl bg-white shadow-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-2xl transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Smart Eligibility Calculator
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Input your age, education, and category to instantly see all schemes and govt jobs you qualify for.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
              <span>Start Instant Check</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Citizen Document Guides */}
          <div 
            onClick={() => setActiveTab('documents')}
            className="p-6 rounded-2xl bg-white shadow-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-2xl transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Citizen Document Roadmaps
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Step-by-step application procedures, fees, processing timelines, and checklist for PAN, Aadhaar, Passport.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <span>Explore 16+ Documents</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Live Application Tracker */}
          <div 
            onClick={() => setActiveTab('tracker')}
            className="p-6 rounded-2xl bg-white shadow-xl border border-slate-200/80 hover:border-purple-300 hover:shadow-2xl transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Track Application Status
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Live verification stages, officer remarks, and estimated completion dates with your reference ID.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-600">
              <span>Track with Ref Number</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </section>

        {/* Service Categories Grid */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Browse by Domain</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Explore Citizen Service Sectors
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('schemes')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All 450+ Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setGlobalSearch(cat.query);
                  setActiveTab(cat.id === 'docs' ? 'documents' : 'schemes');
                }}
                className={`p-4 rounded-xl border ${cat.bg} cursor-pointer transition-all hover:scale-102 shadow-xs hover:shadow-md flex flex-col justify-between space-y-3 group`}
              >
                <div className="p-2.5 rounded-lg bg-white shadow-xs w-fit">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700">
                    {cat.name}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Flagship Schemes */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Nationwide Initiatives</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Flagship Central & State Welfare Schemes
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('schemes')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Browse Scheme Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => {
              const isSaved = bookmarkedSchemes.includes(scheme.id);
              return (
                <div
                  key={scheme.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        scheme.level === 'Central' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {scheme.level} Scheme
                      </span>
                      <button
                        onClick={() => toggleSchemeBookmark(scheme.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <h3 
                      onClick={() => setActiveSchemeModal(scheme)}
                      className="text-base font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                    >
                      {scheme.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {scheme.details}
                    </p>

                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-950 font-medium line-clamp-2">
                      <strong>Benefit:</strong> {scheme.benefits}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-400 truncate">
                      {scheme.category.split(',')[0]}
                    </span>
                    <button
                      onClick={() => setActiveSchemeModal(scheme)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Citizen Documents Hub */}
        <section className="bg-slate-100/70 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Citizen Services</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Essential Identity & Civic Documentation Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Complete official requirements, validity periods, fee schedules, and step-by-step roadmaps.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('documents')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View All 16+ Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl p-4.5 border border-slate-200 shadow-xs hover:shadow transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
                      {doc.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      ⏱ {doc.processingTime}
                    </span>
                  </div>

                  <h3 
                    onClick={() => setActiveDocModal(doc)}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {doc.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {doc.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Fee: <strong className="text-slate-800">{doc.estimatedFee}</strong></span>
                    <span>Helpline: <strong className="text-blue-600">{doc.helpline}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveDocModal(doc)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Check Proofs
                  </button>
                  <button
                    onClick={() => setActiveGuideModal({ docId: doc.id, mode: 'online' })}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Step Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Government Jobs & Public Careers Highlight */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Public Recruitment Portal</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                116+ Government Recruitment Exams & Openings
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Comprehensive database across SSC, UPSC, RRB, Banking, State PSCs, Defense, and PSUs.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>Explore All 116+ Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      {job.organization}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Age: {job.min_age}-{job.max_age} yrs
                    </span>
                  </div>

                  <h3 
                    onClick={() => setActiveJobModal(job)}
                    className="text-base font-bold text-slate-900 hover:text-purple-600 cursor-pointer transition-colors"
                  >
                    {job.job_title}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p><strong>Min Degree:</strong> {job.minimum_qualification}</p>
                    <p><strong>Pay Scale:</strong> {job.salary || '7th Pay Commission Scale'}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1"><strong>Process:</strong> {job.selection_process}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {job.government_level} Level
                  </span>
                  <button
                    onClick={() => setActiveJobModal(job)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <span>Check Eligibility</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Tracking Banner */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>National Single-Window Application Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Track Your Citizen Application in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter your Application Acknowledgment Number (e.g. <code>DOC-2024-8921</code>, <code>SCH-2024-4410</code>) to view scrutiny milestones, officer verification remarks, and dispatch tracking.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="max-w-xl flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={trackSearchId}
              onChange={(e) => setTrackSearchId(e.target.value)}
              placeholder="Enter Application Ref (e.g. DOC-2024-8921)..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 font-mono text-sm outline-none focus:bg-white/20 focus:border-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <span>Track Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-2">
            <span className="text-slate-400">Quick Test Numbers:</span>
            {['DOC-2024-8921', 'SCH-2024-4410', 'JOB-2024-1102'].map((num, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigateToTracking(num)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-blue-300 font-mono text-xs transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
