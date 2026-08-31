import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCHEMES_DATA } from '../data/schemesData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import {
  User,
  Bookmark,
  Clock,
  Layers,
  Briefcase,
  FileText,
  Sparkles,
  Edit3,
  CheckCircle2,
  Trash2,
  Bell,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    bookmarkedSchemes,
    bookmarkedJobs,
    bookmarkedDocs,
    toggleSchemeBookmark,
    toggleJobBookmark,
    toggleDocBookmark,
    applications,
    notifications,
    markNotificationAsRead,
    setActiveSchemeModal,
    setActiveJobModal,
    setActiveDocModal,
    setActiveTab,
    setIsWizardOpen,
    t
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'bookmarks' | 'tracker' | 'notifications' | 'edit'>('bookmarks');
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [name, setName] = useState(profile.name || 'Aarav Sharma');
  const [age, setAge] = useState(profile.age || 24);
  const [stateName, setStateName] = useState(profile.state || 'National / All States');
  const [district, setDistrict] = useState(profile.district || 'Central Delhi');
  const [qualification, setQualification] = useState(profile.qualification || "Bachelor's Degree");
  const [category, setCategory] = useState(profile.category || 'General');
  const [annualIncome, setAnnualIncome] = useState(profile.annualIncome || 180000);
  const [employmentStatus, setEmploymentStatus] = useState(profile.employmentStatus || 'Unemployed');

  const displayName = profile.name || 'Aarav Sharma';
  const displayDistrict = profile.district || 'Central Delhi';

  const savedSchemesList = SCHEMES_DATA.filter(s => bookmarkedSchemes.includes(s.id));
  const savedJobsList = GOV_JOBS_DATA.filter(j => bookmarkedJobs.includes(j.job_id));
  const savedDocsList = CITIZEN_DOCUMENTS.filter(d => bookmarkedDocs.includes(d.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name || 'Aarav Sharma',
      age: Number(age) || 24,
      state: stateName || 'National / All States',
      district: district || 'Central Delhi',
      qualification,
      category: category as any,
      annualIncome: Number(annualIncome),
      employmentStatus: employmentStatus as any
    });
    setIsEditing(false);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">{displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {t('profile.verified_citizen', 'Verified Citizen')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {profile.age} Years • {profile.category} Category • {profile.state}, {displayDistrict}
            </p>
            <p className="text-xs text-indigo-300 font-medium">
              Highest Education: {profile.qualification}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>{t('profile.recalculate', 'Recalculate Eligibility')}</span>
          </button>
          <button
            onClick={() => {
              setActiveProfileTab('edit');
              setIsEditing(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t('profile.edit', 'Edit Profile')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveProfileTab('bookmarks')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeProfileTab === 'bookmarks' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4 text-amber-500" />
          <span>Saved Bookmarks ({savedSchemesList.length + savedJobsList.length + savedDocsList.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('tracker')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeProfileTab === 'tracker' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-600" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('notifications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeProfileTab === 'notifications' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-purple-600" />
          <span>Notifications & Alerts ({notifications.filter(n => !n.read).length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('edit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeProfileTab === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-600" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Saved Bookmarks */}
      {activeProfileTab === 'bookmarks' && (
        <div className="space-y-8">
          
          {/* Saved Schemes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Saved Welfare Schemes ({savedSchemesList.length})</span>
              </h3>
            </div>

            {savedSchemesList.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No schemes saved yet. Browse the scheme directory and click the bookmark icon.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSchemesList.map(scheme => (
                  <div key={scheme.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {scheme.level}
                      </span>
                      <button onClick={() => toggleSchemeBookmark(scheme.id)} className="text-amber-500 hover:text-slate-400">
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <h4 onClick={() => setActiveSchemeModal(scheme)} className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer">
                      {scheme.name}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{scheme.benefits}</p>
                    <button onClick={() => setActiveSchemeModal(scheme)} className="text-xs font-bold text-blue-600 hover:text-blue-800 block">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Saved Recruitment Exams ({savedJobsList.length})</span>
              </h3>
            </div>

            {savedJobsList.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No job notifications bookmarked yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedJobsList.map(job => (
                  <div key={job.job_id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        {job.organization}
                      </span>
                      <button onClick={() => toggleJobBookmark(job.job_id)} className="text-amber-500 hover:text-slate-400">
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <h4 onClick={() => setActiveJobModal(job)} className="text-sm font-bold text-slate-900 hover:text-purple-600 cursor-pointer">
                      {job.job_title}
                    </h4>
                    <p className="text-xs text-slate-500">{job.minimum_qualification} • {job.salary}</p>
                    <button onClick={() => setActiveJobModal(job)} className="text-xs font-bold text-purple-600 hover:text-purple-800 block">
                      View Exam Info →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Tracker */}
      {activeProfileTab === 'tracker' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Your Submitted & Tracked Applications</h3>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Open Full Tracker Page →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">{app.applicationNumber}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    {app.currentStatus}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{app.serviceName}</h4>
                <p className="text-xs text-slate-500">Submitted: {app.submissionDate} • Authority: {app.department}</p>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 block"
                >
                  View Timeline & Remarks →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeProfileTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Government Notifications & Updates</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  n.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/70 border-blue-200 font-medium'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-200 text-slate-700 capitalize">{n.type}</span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block">{n.date}</span>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Edit Profile Settings */}
      {activeProfileTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900">Citizen Profile Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-900">Age (Years)</label>
              <input
                type="number"
                min="18"
                max="100"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-900">State / UT</label>
              <input
                type="text"
                required
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-900">District</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-900">Social Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="General">General (UR)</option>
                <option value="OBC">OBC (Non-Creamy Layer)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS</option>
                <option value="PwD">PwD</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-900">Education</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Diploma">Diploma</option>
                <option value="ITI">ITI</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="B.Tech / B.E (Engineering)">B.Tech / B.E</option>
                <option value="MBBS / Medical">MBBS / Medical</option>
                <option value="LLB (Law)">LLB</option>
                <option value="Master's Degree">Master's Degree</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Save Profile Updates
          </button>
        </form>
      )}

    </div>
  );
};
