import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import {
  Search,
  FileText,
  Clock,
  CreditCard,
  Building,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const {
    globalSearch,
    setGlobalSearch,
    setActiveDocModal,
    setActiveGuideModal,
    bookmarkedDocs,
    toggleDocBookmark,
    setIsWizardOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', 'identity', 'financial', 'certificate', 'travel', 'welfare'];

  const filteredDocs = useMemo(() => {
    return CITIZEN_DOCUMENTS.filter((doc) => {
      // 1. Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matches =
          doc.name.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q) ||
          doc.department.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          doc.requirements.some(r => r.name.toLowerCase().includes(q) || r.acceptedDocs.some(a => a.toLowerCase().includes(q)));
        if (!matches) return false;
      }

      // 2. Category
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) {
        return false;
      }

      // 3. Difficulty
      if (selectedDifficulty !== 'All' && doc.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [globalSearch, selectedCategory, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-indigo-400/30">
              Citizen Services Directory
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Essential Citizen Documents & Roadmaps
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete application criteria, fees, document checklists, and interactive step-by-step guides for PAN, Aadhaar, Passport, Voter ID, Ration Card, and State Certificates.
            </p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Check Required Proofs</span>
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
              placeholder="Search documents (e.g. Passport, PAN Card, Income Certificate, Driving License)..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-300 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Document Types' : cat}
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Difficulty:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const isSaved = bookmarkedDocs.includes(doc.id);
          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {doc.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      doc.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700'
                        : doc.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {doc.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleDocBookmark(doc.id)}
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
                  onClick={() => setActiveDocModal(doc)}
                  className="text-base font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  {doc.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>

                {/* Key specs */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-medium">Processing Time</span>
                    <span className="font-bold text-slate-800">{doc.processingTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Official Fee</span>
                    <span className="font-bold text-slate-800">{doc.estimatedFee}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 block font-medium">Issuing Department</span>
                    <span className="font-semibold text-slate-700 truncate block">{doc.department}</span>
                  </div>
                </div>

                {/* Required Documents Pill Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Required Verification Proofs:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {doc.requirements.slice(0, 3).map((r) => (
                      <span key={r.id} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        ✓ {r.name}
                      </span>
                    ))}
                    {doc.requirements.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                        +{doc.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveDocModal(doc)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  View Checklist
                </button>
                <button
                  onClick={() => setActiveGuideModal({ docId: doc.id, mode: 'online' })}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1"
                >
                  <span>Step-by-Step Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
