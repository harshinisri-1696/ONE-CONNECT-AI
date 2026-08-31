import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Building,
  User,
  Calendar,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TrackerPage: React.FC = () => {
  const {
    applications,
    globalSearch,
    setGlobalSearch,
    setIsNewAppModalOpen,
    activeTab
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(() => {
    if (applications.length > 0) return applications[0].id;
    return '';
  });

  const [searchInput, setSearchInput] = useState('');

  // Find active application
  const currentApp = applications.find(
    a => a.id === selectedAppId ||
         (globalSearch && (a.applicationNumber.toLowerCase().includes(globalSearch.toLowerCase()) || a.id.toLowerCase() === globalSearch.toLowerCase()))
  ) || applications[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const found = applications.find(
        a => a.applicationNumber.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
             a.applicantName.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
             a.serviceName.toLowerCase().includes(searchInput.trim().toLowerCase())
      );
      if (found) {
        setSelectedAppId(found.id);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-indigo-400/30">
              National Citizen Single-Window Tracking
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Real-Time Application Status Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitor verification stages, officer remarks, police verification schedules, and digital speed-post dispatch for your submitted citizen services.
            </p>
          </div>

          <button
            onClick={() => setIsNewAppModalOpen(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Track New Application</span>
          </button>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="pt-4 flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Application Ref (e.g. DOC-2024-8921, SCH-2024-4410) or Applicant Name..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-300 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
          >
            Find Application
          </button>
        </form>
      </div>

      {/* Main Grid: Application List on Left & Selected Timeline Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Tracked Applications List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Your Tracked Applications ({applications.length})</h3>
            <button
              onClick={() => setIsNewAppModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {applications.map((app) => {
              const isSelected = currentApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-300 shadow-xs ring-1 ring-blue-300'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700">
                      {app.applicationNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.currentStatus === 'Approved & Dispatched'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.currentStatus === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.currentStatus}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                    {app.serviceName}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{app.applicantName}</span>
                    <span>{app.submissionDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Timeline & Full Details (8 Cols) */}
        {currentApp ? (
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Top Bar of Record */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                    {currentApp.applicationNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded capitalize">
                    {currentApp.serviceType} Service
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentApp.serviceName}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{currentApp.department}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Applicant Name</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentApp.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Submission Date</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentApp.submissionDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Expected Completion</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentApp.estimatedCompletionDate || '15 Working Days'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Current Status</span>
                <span className="font-bold text-blue-700 mt-0.5 block">{currentApp.currentStatus}</span>
              </div>
            </div>

            {/* Live Progress Stage Bar */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verification & Scrutiny Timeline
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentApp.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Icon */}
                    <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                      step.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : step.status === 'in_progress'
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : step.status === 'in_progress' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Card */}
                    <div className={`p-4 rounded-xl border space-y-1.5 ${
                      step.status === 'in_progress'
                        ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200/80'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {step.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          step.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : step.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {step.status.replace('_', ' ').toUpperCase()} • {step.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      {step.officerNote && (
                        <div className="text-[11px] text-blue-900 bg-white p-2.5 rounded-lg border border-blue-100 font-medium">
                          <strong>Officer Remark:</strong> {step.officerNote}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Office & Remarks */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs text-slate-600">
              <p><strong>Nodal Verification Office:</strong> {currentApp.verificationOffice}</p>
              {currentApp.remarks && <p><strong>Official Status Note:</strong> {currentApp.remarks}</p>}
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No application selected</h3>
            <p className="text-xs text-slate-500">Select an application from the left panel or enter an ID to track.</p>
          </div>
        )}

      </div>

    </div>
  );
};
