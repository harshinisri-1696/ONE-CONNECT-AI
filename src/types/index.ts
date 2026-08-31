export type NavTab = 
  | 'home'
  | 'navigator'
  | 'schemes'
  | 'family'
  | 'action_plan'
  | 'documents'
  | 'jobs'
  | 'wizard'
  | 'tracker'
  | 'admin'
  | 'faq'
  | 'profile';

export type NeedCategory =
  | 'education'
  | 'financial_assistance'
  | 'employment'
  | 'skill_development'
  | 'healthcare'
  | 'housing'
  | 'agriculture'
  | 'women_welfare'
  | 'child_welfare'
  | 'senior_citizen_welfare'
  | 'disability_support'
  | 'entrepreneurship'
  | 'social_security';

export interface DetectedNeed {
  category: NeedCategory;
  label: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  keywords: string[];
  confidence: number; // 0 - 1
  suggestedAction?: string;
}

export interface FamilyMember {
  id: string;
  relationship: 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Grandparent' | 'Dependent';
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender' | 'Other';
  occupation: string;
  education: string;
  income: number;
  specialConditions: string[]; // e.g. ['Student', 'Unemployed', 'Farmer', 'Disabled', 'Senior Citizen', 'Widow']
  needs?: NeedCategory[];
}

export interface FamilyProfile {
  id: string;
  familyName: string;
  headName: string;
  state: string;
  district: string;
  totalFamilyIncome: number;
  hasBPLCard: boolean;
  members: FamilyMember[];
  updatedAt: string;
}

export type VerificationStatus = 'recently_verified' | 'verification_due' | 'outdated';

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
  needCategory?: NeedCategory;
  tags?: string[];
  department?: string;
  official_source?: string;
  official_url?: string;
  last_verified?: string;
  last_updated?: string;
  verification_status?: VerificationStatus;
  incomeLimit?: string | number;
  maxIncome?: number;
  minAge?: number;
  maxAge?: number;
  targetGender?: 'All' | 'Male' | 'Female' | 'Transgender';
  requiredConditions?: string[];
  eligibleStates?: string[];
  deadline?: string;
}

export interface EligibilityCriterion {
  id: string;
  name: string;
  description: string;
  satisfied: boolean;
  citizenValue?: string | number | boolean;
  requiredValue?: string | number | boolean;
  actionAdvice?: string;
}

export interface EligibilityEvaluation {
  schemeId: number | string;
  schemeName: string;
  category: string;
  status: 'eligible' | 'almost_eligible' | 'not_eligible';
  matchScore: number; // 0 - 100
  matchedCount: number;
  totalCriteriaCount: number;
  matchedCriteria: EligibilityCriterion[];
  missingCriteria: EligibilityCriterion[];
  missingDocuments: string[];
  explanation: string;
  decisionFactors: string[];
  actionGuidance: string;
  targetMemberId?: string;
  targetMemberName?: string;
  officialUrl?: string;
  officialSource?: string;
  lastVerified?: string;
  verificationStatus?: VerificationStatus;
}

export interface DocumentReadinessCheck {
  schemeId: number | string;
  schemeName: string;
  readinessPercentage: number;
  totalRequired: number;
  availableCount: number;
  missingCount: number;
  uncertainCount: number;
  documents: {
    documentName: string;
    status: 'available' | 'missing' | 'not_sure';
    guidance: string;
    officialDocId?: string;
  }[];
}

export interface ActionPlanTask {
  id: string;
  schemeId?: number | string;
  schemeName?: string;
  title: string;
  category: 'immediate' | 'service' | 'document' | 'deadline';
  priority: 'critical' | 'high' | 'medium' | 'low';
  matchPercentage?: number;
  whyMatch?: string[];
  missingRequirement?: string;
  nextAction: string;
  status: 'not_started' | 'in_progress' | 'completed';
  officialUrl?: string;
  officialSource?: string;
  deadlineDate?: string;
  assignedMember?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SectorGapStatus {
  category: NeedCategory;
  label: string;
  iconName: string;
  state: 'checked' | 'not_evaluated' | 'no_program_found';
  matchedSchemesCount: number;
  description: string;
  potentialPrograms: string[];
}

export interface BenefitGapReport {
  totalSectors: number;
  checkedCount: number;
  unexploredCount: number;
  noProgramCount: number;
  sectors: SectorGapStatus[];
  recommendationsSummary: string;
}

export interface SchemeSynergy {
  schemeIds: (number | string)[];
  schemeNames: string[];
  synergyType: 'complementary' | 'sequential' | 'independent';
  summary: string;
  combinedBenefits: string;
  compatibilityNote: string;
  verifiedCombination: boolean;
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
  matchedSchemes?: any[];
  detectedNeeds?: any[];
  synergies?: any[];
  evaluations?: EligibilityEvaluation[];
  suggestedActions?: { label: string; action?: () => void; prompt?: string }[];
  referencedItems?: {
    type: 'scheme' | 'document' | 'job';
    title: string;
    id: string | number;
    meta?: string;
  }[];
}
