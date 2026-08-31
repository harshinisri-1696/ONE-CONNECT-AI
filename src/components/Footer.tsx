import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, PhoneCall, ExternalLink, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      {/* Top Banner: Quick Access Portals */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center sm:text-left">
          <a
            href="https://www.india.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <span className="font-semibold text-slate-200 block text-xs group-hover:text-indigo-400">National Portal</span>
            <span className="text-[11px] text-slate-400">india.gov.in</span>
          </a>
          <a
            href="https://uidai.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <span className="font-semibold text-slate-200 block text-xs group-hover:text-indigo-400">UIDAI Aadhaar</span>
            <span className="text-[11px] text-slate-400">uidai.gov.in</span>
          </a>
          <a
            href="https://www.myscheme.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <span className="font-semibold text-slate-200 block text-xs group-hover:text-indigo-400">myScheme</span>
            <span className="text-[11px] text-slate-400">myscheme.gov.in</span>
          </a>
          <a
            href="https://upsc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <span className="font-semibold text-slate-200 block text-xs group-hover:text-indigo-400">UPSC Careers</span>
            <span className="text-[11px] text-slate-400">upsc.gov.in</span>
          </a>
          <a
            href="https://ssc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <span className="font-semibold text-slate-200 block text-xs group-hover:text-indigo-400">SSC Portal</span>
            <span className="text-[11px] text-slate-400">ssc.gov.in</span>
          </a>
          <a
            href="https://scholarships.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition-all group"
          >
            <span className="font-semibold text-slate-200 block text-xs group-hover:text-indigo-400">NSP Portal</span>
            <span className="text-[11px] text-slate-400">scholarships.gov.in</span>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-900/30">
                1C
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                One<span className="text-indigo-400">Connect</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A unified open citizen portal aggregating Central & State welfare schemes, essential identity and civic documentation guides, and official government recruitment career pathways.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Public Service Initiative • 100% Free Access</span>
            </div>
          </div>

          {/* Quick Modules */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-3">Portal Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('schemes')} className="hover:text-white transition-colors">
                  Central & State Schemes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('documents')} className="hover:text-white transition-colors">
                  Citizen Documents & Services
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('jobs')} className="hover:text-white transition-colors">
                  Govt Jobs & Recruitment Exams
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('wizard')} className="hover:text-white transition-colors">
                  Smart Eligibility Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracker')} className="hover:text-white transition-colors">
                  Track Application Status
                </button>
              </li>
            </ul>
          </div>

          {/* Citizen Guides */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-3">Essential Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('documents')} className="hover:text-white transition-colors">
                  Aadhaar Card Enrollment & Update
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('documents')} className="hover:text-white transition-colors">
                  Instant e-PAN Card Application
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('documents')} className="hover:text-white transition-colors">
                  Passport Seva Registration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('schemes')} className="hover:text-white transition-colors">
                  PM-KISAN ₹6,000 Direct Support
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('schemes')} className="hover:text-white transition-colors">
                  Ayushman Bharat ₹5 Lakh Health Card
                </button>
              </li>
            </ul>
          </div>

          {/* Citizen Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-3">Citizen Helpdesk</h4>
            <div className="flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">Toll Free: 1800-11-2024</p>
                <p className="text-[11px] text-slate-400">Mon - Sat (9:00 AM - 6:00 PM IST)</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">helpdesk@oneconnect.gov.in</p>
                <p className="text-[11px] text-slate-400">Citizen Query & Redressal Support</p>
              </div>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => setActiveTab('faq')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
              >
                View FAQs & Grievance Cell →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} OneConnect Portal. Unified Citizen Platform. Designed for public accessibility.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }} className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }} className="hover:text-slate-400">Terms of Use</a>
            <a href="#accessibility" onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }} className="hover:text-slate-400">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
