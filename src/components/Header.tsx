import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { LanguageSelector } from './LanguageSelector';
import {
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Bookmark,
  Bell,
  HelpCircle,
  Home,
  MessageSquareText,
  User,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  Compass,
  Users,
  Clock,
  Globe
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    bookmarkedSchemes,
    bookmarkedDocs,
    bookmarkedJobs,
    actionPlanTasks,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsWizardOpen,
    setIsChatbotOpen,
    t,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const totalBookmarks = bookmarkedSchemes.length + bookmarkedDocs.length + bookmarkedJobs.length;
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const pendingTasks = actionPlanTasks.filter(t => t.status !== 'completed').length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'navigator', label: t('nav.navigator', 'Benefit Navigator'), icon: <Compass className="w-4 h-4" /> },
    { id: 'family', label: t('nav.family', 'Family Profile'), icon: <Users className="w-4 h-4" /> },
    { id: 'action_plan', label: t('nav.action_plan', 'Action Plan'), icon: <Layers className="w-4 h-4" />, badge: pendingTasks },
    { id: 'schemes', label: t('nav.schemes', 'All Schemes'), icon: <FileText className="w-4 h-4" /> },
    { id: 'documents', label: t('nav.documents', 'Documents & Services'), icon: <FileText className="w-4 h-4" /> },
    { id: 'jobs', label: t('nav.jobs', 'Govt Jobs & Exams'), icon: <Briefcase className="w-4 h-4" /> },
    { id: 'tracker', label: t('nav.tracker', 'Track Status'), icon: <Clock className="w-4 h-4" /> },
    { id: 'admin', label: t('nav.admin', 'Data Quality'), icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'profile', label: t('nav.profile', 'My Workspace'), icon: <User className="w-4 h-4" />, badge: totalBookmarks },
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Gov Flag / Utility Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('ribbon.portal_title', 'OneConnect — National Citizen Benefit Navigator & Welfare Portal')}
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              {t('ribbon.gov_india', 'Government of India & State Administrations')}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <div className="flex items-center gap-1 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-blue-400" />
              <span className="text-slate-400 hidden md:inline">{t('ribbon.helpline', 'Citizen Helpline')}:</span>
              <span className="font-semibold text-slate-200">1800-11-2024</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded in Official Portals (.gov.in / .nic.in)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div 
            id="brand-logo-btn"
            onClick={() => handleNavClick('navigator')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shrink-0">
              <img 
                src="/logo.jpeg" 
                alt="OneConnect Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.className = 'w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md';
                    target.parentElement.innerHTML = '1C';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  One<span className="text-blue-600">Connect</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official Welfare
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight">
                National Citizen Benefit Navigator & Unified Services
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="global-search-input"
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveTab('schemes');
                  }
                }}
                placeholder={t('search.placeholder', 'Search schemes, documents, government exams...')}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Language Quick Selector in Header */}
            <div className="hidden sm:block">
              <LanguageSelector variant="header" />
            </div>

            {/* Quick Wizard CTA */}
            <button
              id="header-check-eligibility-btn"
              onClick={() => setIsWizardOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs hover:shadow transition-all shadow-blue-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('btn.check_eligibility', 'Eligibility Wizard')}</span>
            </button>

            {/* AI Assistant Button */}
            <button
              id="header-ai-assistant-btn"
              onClick={() => setIsChatbotOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl transition-all"
              title="Open OneConnect AI Benefit Assistant"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{t('btn.ask_ai', 'AI Help')}</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</h4>
                      {unreadNotifs > 0 && (
                        <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                          {unreadNotifs} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkTab) {
                              setActiveTab(n.linkTab);
                              setIsNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Language selector in mobile menu */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600" />
                {t('lang.select', 'Language / भाषा')}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">12 Languages</span>
            </div>
            <LanguageSelector variant="header" />
          </div>

          {/* Mobile search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t('search.placeholder', 'Search schemes, documents, jobs...')}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100 rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsWizardOpen(true);
              }}
              className="flex-1 py-2.5 text-xs font-semibold text-center text-white bg-blue-600 rounded-xl shadow-xs"
            >
              {t('btn.check_eligibility', 'Eligibility Wizard')}
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsChatbotOpen(true);
              }}
              className="flex-1 py-2.5 text-xs font-semibold text-center text-slate-700 bg-slate-100 rounded-xl border border-slate-200"
            >
              {t('btn.ask_ai', 'AI Help')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
