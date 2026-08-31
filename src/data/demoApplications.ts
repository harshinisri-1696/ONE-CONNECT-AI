import { ApplicationStatusRecord, ActivityLog, CitizenNotification } from "../types";

export const DEMO_APPLICATIONS: ApplicationStatusRecord[] = [
  {
    id: 'app-1',
    applicationNumber: 'DOC-2024-8921',
    applicantName: 'Harshini Sri',
    serviceType: 'document',
    serviceName: 'Indian Passport (Fresh Normal Application)',
    department: 'Ministry of External Affairs (CPV Division)',
    submissionDate: '2024-08-18',
    currentStatus: 'Document Scrutiny',
    estimatedCompletionDate: '2024-09-10',
    verificationOffice: 'Passport Seva Kendra (PSK) Pune / RPO Mumbai',
    referenceDocType: 'passport',
    remarks: 'Counter A (Biometric) and Counter B (Document Scrutiny) passed. Local Police Station verification schedule generated.',
    timeline: [
      {
        title: 'Application & Online Fee Submitted',
        status: 'completed',
        date: '18 Aug 2024, 10:30 AM',
        description: 'Application ARN generated on Passport Seva Portal with ₹1,500 standard fee paid via SBI ePay.',
        officerNote: 'All demographic entries validated with Aadhaar.'
      },
      {
        title: 'PSK Appointment & Physical Desk Scrutiny',
        status: 'completed',
        date: '22 Aug 2024, 02:15 PM',
        description: 'Attended scheduled appointment. Biometric fingerprints, iris scan, and original marksheet/birth certificate inspected at Counter B.',
        officerNote: 'Original documents stamped and verified successfully.'
      },
      {
        title: 'Police Verification (PVR Request Dispatched)',
        status: 'in_progress',
        date: '25 Aug 2024, 11:00 AM',
        description: 'Electronic PVR request sent to local jurisdiction police station. Officer will conduct physical residence visit.',
        officerNote: 'Applicant requested to keep original address proof and two neighbor witness references ready.'
      },
      {
        title: 'Passport Printing & Speed Post Dispatch',
        status: 'pending',
        date: 'Expected by 05 Sep 2024',
        description: 'Printing at Security Press, Nashik and dispatch via India Post tracking barcode.',
      }
    ]
  },
  {
    id: 'app-2',
    applicationNumber: 'SCH-2024-4410',
    applicantName: 'Harshini Sri',
    serviceType: 'scheme',
    serviceName: 'PM-KISAN Samman Nidhi Scheme (Fresh Registration)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    submissionDate: '2024-08-01',
    currentStatus: 'Approved',
    estimatedCompletionDate: '2024-08-20',
    verificationOffice: 'District Agriculture Office / Tehsildar Branch',
    referenceDocType: 'pm-kisan',
    remarks: 'Land revenue records (Khasra/Khatauni) cross-matched with state land portal. Next ₹2,000 installment mapped for direct DBT credit.',
    timeline: [
      {
        title: 'Online Application & e-KYC Verification',
        status: 'completed',
        date: '01 Aug 2024, 09:00 AM',
        description: 'Aadhaar OTP e-KYC authenticated on PM-KISAN portal.',
      },
      {
        title: 'Patwari / Land Record Scrutiny',
        status: 'completed',
        date: '08 Aug 2024, 04:30 PM',
        description: 'Village Administrative Officer verified cultivable land title and family non-exclusion status.',
        officerNote: 'Clear ownership title confirmed.'
      },
      {
        title: 'State Nodal Officer Approval',
        status: 'completed',
        date: '15 Aug 2024, 11:45 AM',
        description: 'Application vetted and included in State Beneficiary Master List.',
      },
      {
        title: 'PFMS Bank Account Seeding & DBT Activation',
        status: 'completed',
        date: '20 Aug 2024, 03:00 PM',
        description: 'NPCI Aadhaar Payment Bridge (APB) active. Eligible for 18th Installment release.',
        officerNote: 'Account mapped with SBI account ending in 4910.'
      }
    ]
  },
  {
    id: 'app-3',
    applicationNumber: 'JOB-2024-7731',
    applicantName: 'Harshini Sri',
    serviceType: 'job',
    serviceName: 'SSC Combined Graduate Level (CGL) Examination 2024',
    department: 'Staff Selection Commission (SSC)',
    submissionDate: '2024-07-24',
    currentStatus: 'Submitted',
    estimatedCompletionDate: '2024-09-25',
    verificationOffice: 'SSC Northern Regional Office, New Delhi',
    referenceDocType: 'ssc-cgl',
    remarks: 'Application provisionally accepted. Tier-I Computer Based Examination admit card will be released 4 days before exam date.',
    timeline: [
      {
        title: 'Application Form & Fee Payment Completed',
        status: 'completed',
        date: '24 Jul 2024, 08:20 PM',
        description: 'Registration submitted with online live webcam photo capture and fee exemption under Women candidate category.',
      },
      {
        title: 'Scrutiny of Photo & Post Preferences',
        status: 'completed',
        date: '05 Aug 2024, 10:00 AM',
        description: 'SSC automated portal validated photograph parameters and educational qualification.',
      },
      {
        title: 'Tier-I Exam City Intimation Slip',
        status: 'in_progress',
        date: 'Available 10 days before exam',
        description: 'Examination city allocation and shift timing notification.',
      },
      {
        title: 'E-Admit Card Download',
        status: 'pending',
        date: '4 days prior to exam date',
        description: 'Download hall ticket with reporting time and venue details.',
      }
    ]
  }
];

export const DEMO_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    action: 'Checked Eligibility',
    target: 'National Scheme & Job Eligibility Wizard',
    timestamp: 'Just now',
    type: 'eligibility_check'
  },
  {
    id: 'act-2',
    action: 'Bookmarked Scheme',
    target: 'Pradhan Mantri Awas Yojana (Urban 2.0)',
    timestamp: '2 hours ago',
    type: 'bookmark'
  },
  {
    id: 'act-3',
    action: 'Viewed Document Guide',
    target: 'Instant e-PAN Application Roadmap',
    timestamp: 'Yesterday',
    type: 'view'
  }
];

export const DEMO_NOTIFICATIONS: CitizenNotification[] = [
  {
    id: 'notif-1',
    title: 'SSC CGL 2024 Exam City Announced',
    message: 'Staff Selection Commission has released the Tier-I exam city intimation slip. Check your scheduled city.',
    timestamp: '1 hour ago',
    read: false,
    type: 'info',
    linkTab: 'jobs'
  },
  {
    id: 'notif-2',
    title: 'PM-KISAN 18th Installment Release Date',
    message: 'Hon’ble Prime Minister will release the 18th installment of PM-KISAN on 5th October 2024 to all verified farmer beneficiaries.',
    timestamp: '5 hours ago',
    read: false,
    type: 'success',
    linkTab: 'schemes'
  },
  {
    id: 'notif-3',
    title: 'Passport Police Verification Reminder',
    message: 'Local Police Verification is scheduled this week for application DOC-2024-8921. Keep your original address proofs ready.',
    timestamp: '1 day ago',
    read: true,
    type: 'warning',
    linkTab: 'tracker'
  }
];

export const INITIAL_ACTIVITY_LOGS = DEMO_ACTIVITY_LOGS;
export const INITIAL_NOTIFICATIONS = DEMO_NOTIFICATIONS;

