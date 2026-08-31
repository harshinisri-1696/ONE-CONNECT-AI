import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  NavTab,
  SchemeItem,
  CitizenDocument,
  JobItem,
  EligibilityProfile,
  ApplicationStatusRecord,
  ActivityLog,
  CitizenNotification,
  FamilyProfile,
  FamilyMember,
  ActionPlanTask,
  DetectedNeed
} from '../types';
import { DEMO_APPLICATIONS, INITIAL_ACTIVITY_LOGS, INITIAL_NOTIFICATIONS } from '../data/demoApplications';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import { SCHEMES_DATA } from '../data/schemesData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import { LanguageCode, LanguageOption, SUPPORTED_LANGUAGES, getTranslation } from '../data/translations';

export const DEFAULT_PROFILE: EligibilityProfile = {
  name: 'Aarav Sharma',
  district: 'Central Delhi',
  age: 24,
  gender: 'All',
  qualification: "Bachelor's Degree",
  specialization: 'Any / General',
  percentage: 72,
  category: 'General',
  employmentStatus: 'Unemployed',
  annualIncome: 180000,
  state: 'National / All States',
  isStudent: false,
  isSeniorCitizen: false,
  isDifferentlyAbled: false,
  isFarmer: false,
  hasBPLCard: false,
  experienceYears: 0,
};

export const DEFAULT_FAMILY_PROFILE: FamilyProfile = {
  id: 'fam-default-01',
  familyName: 'Sharma Household',
  headName: 'Rajesh Sharma',
  state: 'National / All States',
  district: 'Central Delhi',
  totalFamilyIncome: 240000,
  hasBPLCard: false,
  updatedAt: new Date().toISOString(),
  members: [
    {
      id: 'mem-1',
      relationship: 'Self',
      name: 'Aarav Sharma',
      age: 24,
      gender: 'Male',
      occupation: 'Job Seeker / Unemployed',
      education: "Bachelor's Degree",
      income: 0,
      specialConditions: ['Unemployed', 'Student']
    },
    {
      id: 'mem-2',
      relationship: 'Father',
      name: 'Rajesh Sharma',
      age: 54,
      gender: 'Male',
      occupation: 'Small Farmer / Livelihood',
      education: 'Secondary School',
      income: 180000,
      specialConditions: ['Farmer']
    },
    {
      id: 'mem-3',
      relationship: 'Mother',
      name: 'Sunita Sharma',
      age: 49,
      gender: 'Female',
      occupation: 'Homemaker & Artisan',
      education: 'Primary School',
      income: 60000,
      specialConditions: ['Artisan']
    },
    {
      id: 'mem-4',
      relationship: 'Sister',
      name: 'Pooja Sharma',
      age: 8,
      gender: 'Female',
      occupation: 'Primary School Student',
      education: 'Class 3',
      income: 0,
      specialConditions: ['Student']
    }
  ]
};

export const DEFAULT_ACTION_TASKS: ActionPlanTask[] = [
  {
    id: 'task-init-1',
    schemeId: 9905,
    schemeName: 'Higher Education Scholarship',
    title: 'Apply for National Scholarship Portal (NSP)',
    category: 'immediate',
    priority: 'critical',
    matchPercentage: 92,
    whyMatch: ['Age 24 is eligible', 'Income below ₹4.5L threshold', 'Enrolled in higher studies'],
    nextAction: 'Fill student registration on scholarships.gov.in and verify Institute Nodal Officer (INO)',
    status: 'not_started',
    officialUrl: 'https://scholarships.gov.in',
    officialSource: 'Ministry of Education',
    assignedMember: 'Aarav Sharma (Self)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-init-2',
    schemeId: 9906,
    schemeName: 'PMKVY 4.0 Skill Certification',
    title: 'Enroll in Free NSDC Technical Upskilling',
    category: 'service',
    priority: 'high',
    matchPercentage: 88,
    whyMatch: ['Unemployed youth age 15-45', 'Free certification + ₹8,000 reward bonus'],
    nextAction: 'Locate nearest Pradhan Mantri Kaushal Kendra (PMKK) center',
    status: 'not_started',
    officialUrl: 'https://www.skillindia.gov.in',
    officialSource: 'NSDC / MSDE',
    assignedMember: 'Aarav Sharma (Self)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-init-3',
    schemeId: 9901,
    schemeName: 'PM-KISAN Samman Nidhi',
    title: 'Verify Land Record & Aadhaar e-KYC for Father',
    category: 'immediate',
    priority: 'high',
    matchPercentage: 95,
    whyMatch: ['Farmer landholder', 'Direct DBT ₹6,000/year'],
    nextAction: 'Complete OTP or biometric e-KYC on pmkisan.gov.in',
    status: 'in_progress',
    officialUrl: 'https://pmkisan.gov.in',
    officialSource: 'Ministry of Agriculture',
    assignedMember: 'Rajesh Sharma (Father)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-init-4',
    schemeId: 9915,
    schemeName: 'Sukanya Samriddhi Yojana (SSY)',
    title: 'Open SSY Post Office Account for Sister (Age 8)',
    category: 'service',
    priority: 'high',
    matchPercentage: 98,
    whyMatch: ['Girl child below 10 years', 'High interest 8.2% p.a. + Tax free'],
    nextAction: 'Visit nearest India Post branch with birth certificate & parent KYC',
    status: 'not_started',
    officialUrl: 'https://www.indiapost.gov.in',
    officialSource: 'India Post / Ministry of Finance',
    assignedMember: 'Pooja Sharma (Sister)',
    createdAt: new Date().toISOString()
  }
];

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  
  // Language & Localization
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  supportedLanguages: LanguageOption[];
  t: (key: string, fallback?: string) => string;

  // Bookmarks
  bookmarkedSchemes: (string | number)[];
  bookmarkedDocs: string[];
  bookmarkedJobs: number[];
  toggleSchemeBookmark: (id: string | number) => void;
  toggleDocBookmark: (id: string) => void;
  toggleJobBookmark: (id: number) => void;

  // Profile & Eligibility
  profile: EligibilityProfile;
  updateProfile: (profile: Partial<EligibilityProfile>) => void;

  // Family Profile Innovation
  familyProfile: FamilyProfile;
  updateFamilyProfile: (partial: Partial<FamilyProfile>) => void;
  addFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;

  // Action Plan Innovation
  actionPlanTasks: ActionPlanTask[];
  updateTaskStatus: (taskId: string, status: ActionPlanTask['status']) => void;
  addTaskToActionPlan: (task: ActionPlanTask) => void;
  removeTaskFromActionPlan: (taskId: string) => void;

  // Needs Detection History
  detectedNeedsHistory: DetectedNeed[];
  setDetectedNeedsHistory: (needs: DetectedNeed[]) => void;

  // Document Readiness Checklist
  userDocumentsChecklist: Record<string, 'available' | 'missing' | 'not_sure'>;
  updateDocumentStatus: (docName: string, status: 'available' | 'missing' | 'not_sure') => void;
  
  // Application Tracking
  applications: ApplicationStatusRecord[];
  addApplication: (app: ApplicationStatusRecord) => void;
  findApplication: (appNumber: string) => ApplicationStatusRecord | undefined;
  
  // Notifications & Logs
  notifications: CitizenNotification[];
  activityLogs: ActivityLog[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addActivity: (action: string, target: string, type: ActivityLog['type']) => void;

  // Modals & Drawers
  activeSchemeModal: SchemeItem | null;
  setActiveSchemeModal: (scheme: SchemeItem | null) => void;
  activeDocModal: CitizenDocument | null;
  setActiveDocModal: (doc: CitizenDocument | null) => void;
  activeGuideModal: { docId: string; mode?: 'online' | 'offline' } | null;
  setActiveGuideModal: (guide: { docId: string; mode?: 'online' | 'offline' } | null) => void;
  activeJobModal: JobItem | null;
  setActiveJobModal: (job: JobItem | null) => void;
  
  isWizardOpen: boolean;
  setIsWizardOpen: (open: boolean) => void;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  isNewAppModalOpen: boolean;
  setIsNewAppModalOpen: (open: boolean) => void;

  // Direct Quick Navigator
  navigateToCategory: (category: string, targetTab?: NavTab) => void;
  navigateToTracking: (appNum: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('navigator');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Language State
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_language');
      return (saved as LanguageCode) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('oneconnect_language', lang);
    } catch {
      // ignore
    }
  };

  const t = useCallback(
    (key: string, fallback?: string) => {
      return getTranslation(key, language, fallback);
    },
    [language]
  );

  // Bookmarks loaded from localStorage
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_bm_schemes');
      return saved ? JSON.parse(saved) : [9901, 9902, 9906];
    } catch {
      return [9901, 9902];
    }
  });

  const [bookmarkedDocs, setBookmarkedDocs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_bm_docs');
      return saved ? JSON.parse(saved) : ['aadhaar-card', 'pan-card', 'passport'];
    } catch {
      return ['aadhaar-card', 'pan-card'];
    }
  });

  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_bm_jobs');
      return saved ? JSON.parse(saved) : [1, 2, 20];
    } catch {
      return [1, 2];
    }
  });

  // Profile
  const [profile, setProfile] = useState<EligibilityProfile>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          name: parsed.name || DEFAULT_PROFILE.name,
          district: parsed.district || DEFAULT_PROFILE.district,
        };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Family Profile State
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_family_profile');
      return saved ? JSON.parse(saved) : DEFAULT_FAMILY_PROFILE;
    } catch {
      return DEFAULT_FAMILY_PROFILE;
    }
  });

  // Action Plan Tasks State
  const [actionPlanTasks, setActionPlanTasks] = useState<ActionPlanTask[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_action_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_ACTION_TASKS;
    } catch {
      return DEFAULT_ACTION_TASKS;
    }
  });

  // Detected Needs State
  const [detectedNeedsHistory, setDetectedNeedsHistory] = useState<DetectedNeed[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_detected_needs');
      return saved ? JSON.parse(saved) : [
        {
          category: 'education',
          label: 'Education & Scholarship Assistance',
          priority: 'high',
          reasoning: 'College tuition and merit scholarship support identified.',
          keywords: ['college', 'scholarship', 'fees'],
          confidence: 0.95,
          suggestedAction: 'Check higher education scholarships'
        },
        {
          category: 'employment',
          label: 'Employment & Job Support',
          priority: 'high',
          reasoning: 'Unemployed graduate seeking public or formal sector placement.',
          keywords: ['unemployed', 'job'],
          confidence: 0.92,
          suggestedAction: 'Explore public recruitment and skill development'
        }
      ];
    } catch {
      return [];
    }
  });

  // Document Readiness Checklist
  const [userDocumentsChecklist, setUserDocumentsChecklist] = useState<Record<string, 'available' | 'missing' | 'not_sure'>>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_doc_checklist');
      return saved ? JSON.parse(saved) : {
        'Aadhaar Card': 'available',
        'Bank Passbook': 'available',
        'Class 12 Marksheet': 'available',
        'Student ID Card': 'available',
        'Income Certificate': 'missing',
        'Ration Card': 'missing',
        'Caste Certificate': 'not_sure'
      };
    } catch {
      return {
        'Aadhaar Card': 'available',
        'Bank Passbook': 'available'
      };
    }
  });

  // Applications
  const [applications, setApplications] = useState<ApplicationStatusRecord[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_applications');
      return saved ? JSON.parse(saved) : DEMO_APPLICATIONS;
    } catch {
      return DEMO_APPLICATIONS;
    }
  });

  // Notifications & Activity
  const [notifications, setNotifications] = useState<CitizenNotification[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('oneconnect_activity_logs');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  // Active Modals
  const [activeSchemeModal, setActiveSchemeModal] = useState<SchemeItem | null>(null);
  const [activeDocModal, setActiveDocModal] = useState<CitizenDocument | null>(null);
  const [activeGuideModal, setActiveGuideModal] = useState<{ docId: string; mode?: 'online' | 'offline' } | null>(null);
  const [activeJobModal, setActiveJobModal] = useState<JobItem | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('oneconnect_bm_schemes', JSON.stringify(bookmarkedSchemes));
  }, [bookmarkedSchemes]);

  useEffect(() => {
    localStorage.setItem('oneconnect_bm_docs', JSON.stringify(bookmarkedDocs));
  }, [bookmarkedDocs]);

  useEffect(() => {
    localStorage.setItem('oneconnect_bm_jobs', JSON.stringify(bookmarkedJobs));
  }, [bookmarkedJobs]);

  useEffect(() => {
    localStorage.setItem('oneconnect_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('oneconnect_family_profile', JSON.stringify(familyProfile));
  }, [familyProfile]);

  useEffect(() => {
    localStorage.setItem('oneconnect_action_tasks', JSON.stringify(actionPlanTasks));
  }, [actionPlanTasks]);

  useEffect(() => {
    localStorage.setItem('oneconnect_detected_needs', JSON.stringify(detectedNeedsHistory));
  }, [detectedNeedsHistory]);

  useEffect(() => {
    localStorage.setItem('oneconnect_doc_checklist', JSON.stringify(userDocumentsChecklist));
  }, [userDocumentsChecklist]);

  useEffect(() => {
    localStorage.setItem('oneconnect_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('oneconnect_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('oneconnect_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const toggleSchemeBookmark = (id: string | number) => {
    setBookmarkedSchemes(prev => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter(x => x !== id) : [...prev, id];
      const scheme = SCHEMES_DATA.find(s => s.id === id);
      addActivity(
        isSaved ? 'Removed scheme bookmark' : 'Bookmarked government scheme',
        scheme ? scheme.name : `Scheme #${id}`,
        'bookmark'
      );
      return next;
    });
  };

  const toggleDocBookmark = (id: string) => {
    setBookmarkedDocs(prev => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter(x => x !== id) : [...prev, id];
      const doc = CITIZEN_DOCUMENTS.find(d => d.id === id);
      addActivity(
        isSaved ? 'Removed document bookmark' : 'Bookmarked citizen document',
        doc ? doc.name : id,
        'bookmark'
      );
      return next;
    });
  };

  const toggleJobBookmark = (id: number) => {
    setBookmarkedJobs(prev => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter(x => x !== id) : [...prev, id];
      const job = GOV_JOBS_DATA.find(j => j.job_id === id);
      addActivity(
        isSaved ? 'Removed job bookmark' : 'Bookmarked recruitment post',
        job ? `${job.job_title} (${job.organization})` : `Job #${id}`,
        'bookmark'
      );
      return next;
    });
  };

  const updateProfile = (partial: Partial<EligibilityProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
    addActivity('Updated citizen eligibility profile', 'Profile Criteria', 'eligibility_check');
  };

  const updateFamilyProfile = (partial: Partial<FamilyProfile>) => {
    setFamilyProfile(prev => ({
      ...prev,
      ...partial,
      updatedAt: new Date().toISOString()
    }));
    addActivity('Updated Family Benefit Profile', `${partial.familyName || familyProfile.familyName}`, 'eligibility_check');
  };

  const addFamilyMember = (member: FamilyMember) => {
    setFamilyProfile(prev => ({
      ...prev,
      members: [...prev.members, member],
      updatedAt: new Date().toISOString()
    }));
    addActivity('Added family member', `${member.name} (${member.relationship})`, 'eligibility_check');
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Family Member Added',
        message: `${member.name} (${member.relationship}) added to Family Welfare profile. Evaluated against age-specific schemes.`,
        timestamp: 'Just now',
        read: false,
        type: 'info',
        linkTab: 'family'
      },
      ...prev
    ]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyProfile(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateTaskStatus = (taskId: string, status: ActionPlanTask['status']) => {
    setActionPlanTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined
            }
          : t
      )
    );
  };

  const addTaskToActionPlan = (task: ActionPlanTask) => {
    setActionPlanTasks(prev => [task, ...prev.filter(t => t.id !== task.id)]);
    addActivity('Added task to Welfare Action Plan', task.title, 'apply');
  };

  const removeTaskFromActionPlan = (taskId: string) => {
    setActionPlanTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateDocumentStatus = (docName: string, status: 'available' | 'missing' | 'not_sure') => {
    setUserDocumentsChecklist(prev => ({
      ...prev,
      [docName]: status
    }));
  };

  const addApplication = (app: ApplicationStatusRecord) => {
    setApplications(prev => [app, ...prev]);
    addActivity('Created new application tracking entry', `${app.serviceName} (${app.applicationNumber})`, 'apply');
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Application Registered',
        message: `Your application #${app.applicationNumber} for ${app.serviceName} has been submitted for scrutiny.`,
        timestamp: 'Just now',
        read: false,
        type: 'success',
        linkTab: 'tracker'
      },
      ...prev
    ]);
  };

  const findApplication = (appNumber: string) => {
    if (!appNumber) return undefined;
    const clean = appNumber.trim().toUpperCase();
    return applications.find(
      a => a.applicationNumber.toUpperCase() === clean || a.id.toUpperCase() === clean
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addActivity = (action: string, target: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      target,
      timestamp: 'Just now',
      type
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 30)]);
  };

  const navigateToCategory = (category: string, targetTab: NavTab = 'schemes') => {
    setGlobalSearch(category);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTracking = (appNum: string) => {
    setGlobalSearch(appNum);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        language,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
        bookmarkedSchemes,
        bookmarkedDocs,
        bookmarkedJobs,
        toggleSchemeBookmark,
        toggleDocBookmark,
        toggleJobBookmark,
        profile,
        updateProfile,
        familyProfile,
        updateFamilyProfile,
        addFamilyMember,
        removeFamilyMember,
        actionPlanTasks,
        updateTaskStatus,
        addTaskToActionPlan,
        removeTaskFromActionPlan,
        detectedNeedsHistory,
        setDetectedNeedsHistory,
        userDocumentsChecklist,
        updateDocumentStatus,
        applications,
        addApplication,
        findApplication,
        notifications,
        activityLogs,
        markNotificationRead,
        clearAllNotifications,
        addActivity,
        activeSchemeModal,
        setActiveSchemeModal,
        activeDocModal,
        setActiveDocModal,
        activeGuideModal,
        setActiveGuideModal,
        activeJobModal,
        setActiveJobModal,
        isWizardOpen,
        setIsWizardOpen,
        isChatbotOpen,
        setIsChatbotOpen,
        isNewAppModalOpen,
        setIsNewAppModalOpen,
        navigateToCategory,
        navigateToTracking
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
