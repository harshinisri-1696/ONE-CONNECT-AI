import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SCHEMES_DATA } from '../data/schemesData';
import {
  Search,
  Filter,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  Building,
  CheckCircle2,
  Gift,
  Tag,
  ArrowUpDown
} from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const {
    globalSearch,
    setGlobalSearch,
    setActiveSchemeModal,
    bookmarkedSchemes,
    toggleSchemeBookmark,
    setIsWizardOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Central' | 'State'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'level'>('default');

  const categories = [
    'All',
    'Agriculture,Rural & Environment',
    'Health & Wellness',
    'Education & Learning',
    'Social welfare & Empowerment',
    'Business & Entrepreneurship',
    'Women and Child',
    'Skills & Employment',
    'Banking,Financial Services and Insurance'
  ];

  const filteredSchemes = useMemo(() => {
    return SCHEMES_DATA.filter((scheme) => {
      // 1. Search filter
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matchesSearch =
          scheme.name.toLowerCase().includes(q) ||
          scheme.details.toLowerCase().includes(q) ||
          scheme.benefits.toLowerCase().includes(q) ||
          scheme.category.toLowerCase().includes(q) ||
          (scheme.tags && scheme.tags.some(t => t.toLowerCase().includes(q)));
        if (!matchesSearch) return false;
      }

      // 2. Level filter
      if (selectedLevel !== 'All' && scheme.level !== selectedLevel) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'All') {
        if (!scheme.category.toLowerCase().includes(selectedCategory.toLowerCase().split(',')[0].trim())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'level') return a.level.localeCompare(b.level);
      return 0;
    });
  }, [globalSearch, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-indigo-400/30">
              National Scheme Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Government Welfare Schemes Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 450+ official central and state initiatives covering direct income support, health insurance, education scholarships, and MSME funding.
            </p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Check My Eligibility</span>
          </button>
        </div>

        {/* Search & Quick Controls inside banner */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search by scheme name, keyword (e.g. Farmer, Pension, Health, Startup)..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-300 font-medium"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        
        {/* Category horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const displayName = cat === 'All' ? 'All Domains' : cat.split(',')[0];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* Level & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Government Level:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Central', 'State'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium outline-none"
              >
                <option value="default">Relevance / Featured</option>
                <option value="name">Scheme Name (A-Z)</option>
                <option value="level">Level (Central first)</option>
              </select>
            </div>

            <div className="text-slate-500 font-medium">
              Showing <strong>{filteredSchemes.length}</strong> Schemes
            </div>
          </div>

        </div>

      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No schemes found matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or switching to "All Domains" to explore full catalog.
          </p>
          <button
            onClick={() => {
              setGlobalSearch('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            const isSaved = bookmarkedSchemes.includes(scheme.id);
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      scheme.level === 'Central' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {scheme.level} Scheme
                    </span>
                    <button
                      onClick={() => toggleSchemeBookmark(scheme.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Bookmark Scheme'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3
                    onClick={() => setActiveSchemeModal(scheme)}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2"
                  >
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {scheme.details}
                  </p>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Benefit Entitlement:
                    </span>
                    <p className="text-xs text-emerald-950 font-medium line-clamp-2 leading-relaxed">
                      {scheme.benefits}
                    </p>
                  </div>

                  {scheme.tags && scheme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {scheme.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[130px]">
                    {scheme.category.split(',')[0]}
                  </span>
                  <button
                    onClick={() => setActiveSchemeModal(scheme)}
                    className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
