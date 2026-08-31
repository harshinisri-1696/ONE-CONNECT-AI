export type NavTab = 
  | 'home'
  | 'schemes'
  | 'documents'
  | 'jobs'
  | 'wizard'
  | 'tracker'
  | 'faq'
  | 'profile';

export interface SchemeItem {
  id: number | string;
  name: string;
  slug?: string;
  details: string;
  benefits: string;
  eligibility: string;
  application: string;
  documents: string | string[];
  level: 'Central' | 'State' | string;
  category: string;
  tags?: string[];
  department?: string;
  official_url?: string;
  incomeLimit?: string;
  deadline?: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  mandatory: boolean;
  type: 'identity' | 'address' | 'dob' | 'income' | 'relationship' | 'other';
  acceptedDocs: string[];
}

export interface CitizenDocument {
  id: string;
  name: string;
  category: 'identity' | 'financial' | 'certificates' | 'travel' | 'welfare' | 'civic';
  department: string;
  description: string;
  validity: string;
  processingTime: string;
  estimatedFee: string;
  officialPortalUrl: string;
  helpline: string;
  difficulty: 'Easy' | 'Medium' | 'Complex';
  popular?: boolean;
  requirements: DocumentRequirement[];
  prerequisites: string[];
  usageGuidelines: string[];
  faqs?: { question: string; answer: string }[];
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  checklistItems: string[];
  tip?: string;
  warning?: string;
  portalActionUrl?: string;
  estimatedDuration?: string;
}

export interface ApplicationGuide {
  documentId: string;
  documentName: string;
  overview: string;
  officialPortal: string;
  onlineSteps: GuideStep[];
  offlineSteps: GuideStep[];
  commonMistakes: string[];
  verificationProcess: string;
}

export interface JobItem {
  job_id: number;
  job_title: string;
  organization: string;
  government_level: string;
  minimum_qualification: string;
  specialization?: string;
  min_age: number;
  max_age: number;
  minimum_percentage?: number | null;
  experience_required: string;
  location: string;
  selection_process: string;
  application_status?: string;
  source_note?: string;
  salary?: string;
  official_url?: string;
}

export interface EligibilityProfile {
  name?: string;
  district?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender' | 'Other' | 'All';
  qualification: string;
  specialization: string;
  percentage: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'PwD';
  employmentStatus: 'Unemployed' | 'Student' | 'Employed (Private)' | 'Self-Employed' | 'Farmer' | 'Homemaker';
  annualIncome: number;
  state: string;
  isStudent: boolean;
  isSeniorCitizen: boolean;
  isDifferentlyAbled: boolean;
  isFarmer: boolean;
  hasBPLCard: boolean;
  experienceYears: number;
}

export interface ApplicationTimelineStep {
  title: string;
  status: 'completed' | 'in_progress' | 'pending' | 'rejected';
  date: string;
  description: string;
  officerNote?: string;
}

export interface ApplicationStatusRecord {
  id: string;
  applicationNumber: string;
  applicantName: string;
  serviceType: 'document' | 'scheme' | 'job';
  serviceName: string;
  department: string;
  submissionDate: string;
  currentStatus: 'Submitted' | 'Under Verification' | 'Document Scrutiny' | 'Field Inspection' | 'Approved' | 'Dispatched' | 'Rejected';
  estimatedCompletionDate: string;
  verificationOffice: string;
  referenceDocType: string;
  timeline: ApplicationTimelineStep[];
  remarks: string;
  downloadableSlipUrl?: string;
}

export interface FAQItem {
  id: string;
  category: 'documents' | 'schemes' | 'jobs' | 'eligibility' | 'tracking' | 'general';
  question: string;
  answer: string;
  tags?: string[];
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'view' | 'bookmark' | 'apply' | 'eligibility_check' | 'search';
}

export interface CitizenNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  linkTab?: NavTab;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
  referencedItems?: {
    type: 'scheme' | 'document' | 'job';
    title: string;
    id: string | number;
    meta?: string;
  }[];
}
