import { DocumentReadinessCheck } from '../types';
import { SCHEMES_DATABASE } from './schemeDatabase';

export interface DocumentGuidanceDetail {
  documentName: string;
  officialDocId?: string;
  purpose: string;
  howToObtain: string;
  estimatedDays: string;
  officialPortal: string;
}

const DOCUMENT_GUIDANCE_CATALOG: Record<string, DocumentGuidanceDetail> = {
  'Aadhaar Card': {
    documentName: 'Aadhaar Card',
    officialDocId: 'aadhaar-card',
    purpose: 'Universal Proof of Identity, Age, and DBT biometric authentication.',
    howToObtain: 'Visit nearest Aadhaar Seva Kendra or update details via myaadhaar.uidai.gov.in.',
    estimatedDays: '5-15 Days',
    officialPortal: 'https://myaadhaar.uidai.gov.in'
  },
  'Income Certificate': {
    documentName: 'Income Certificate',
    officialDocId: 'income-certificate',
    purpose: 'Proof of annual household income for means-tested welfare schemes.',
    howToObtain: 'Apply via State e-District portal or Tehsildar / Taluk revenue office with salary slips/ITR/land proof.',
    estimatedDays: '7-14 Days',
    officialPortal: 'https://edistrict.gov.in'
  },
  'Bank Passbook': {
    documentName: 'Bank Passbook / Account Details',
    officialDocId: 'bank-passbook',
    purpose: 'Direct Benefit Transfer (DBT) credit of financial subsidies directly into bank account.',
    howToObtain: 'Open a PMJDY zero-balance savings account at any commercial or rural bank with Aadhaar.',
    estimatedDays: '1-2 Days',
    officialPortal: 'https://pmjdy.gov.in'
  },
  'Student ID Card': {
    documentName: 'Student ID Card / Bonafide Certificate',
    officialDocId: 'student-id',
    purpose: 'Verification of active enrollment in recognized school, college, or university.',
    howToObtain: 'Request from the Principal / Registrar office of your educational institution.',
    estimatedDays: '1-3 Days',
    officialPortal: 'https://scholarships.gov.in'
  },
  'Class 12 Marksheet': {
    documentName: 'Class 12 Marksheet / Educational Certificate',
    officialDocId: 'marksheet',
    purpose: 'Verification of academic merit percentile and eligibility.',
    howToObtain: 'Download digital copy from DigiLocker or obtain original from school/board.',
    estimatedDays: 'Instant via DigiLocker',
    officialPortal: 'https://digilocker.gov.in'
  },
  'Ration Card': {
    documentName: 'Ration Card / Family ID',
    officialDocId: 'ration-card',
    purpose: 'Verification of family economic status (BPL / Antyodaya / Priority Household).',
    howToObtain: 'Apply via State Food & Civil Supplies Department / PDS portal.',
    estimatedDays: '15-30 Days',
    officialPortal: 'https://nfsa.gov.in'
  },
  'Caste Certificate': {
    documentName: 'Caste / Community Certificate',
    officialDocId: 'caste-certificate',
    purpose: 'Proof of reservation category (SC / ST / OBC) for fee waivers and quotas.',
    howToObtain: 'Apply through State Revenue / e-District portal or Revenue Divisional Officer (RDO).',
    estimatedDays: '10-20 Days',
    officialPortal: 'https://edistrict.gov.in'
  },
  'Disability Medical Certificate': {
    documentName: 'Disability Medical Certificate / UDID',
    officialDocId: 'disability-cert',
    purpose: 'Official certification of benchmark disability (40%+) by a Government Medical Board.',
    howToObtain: 'Apply on swavlambancard.gov.in and appear for medical evaluation at District Civil Hospital.',
    estimatedDays: '15-30 Days',
    officialPortal: 'https://www.swavlambancard.gov.in'
  },
  'PAN Card': {
    documentName: 'Permanent Account Number (PAN) Card',
    officialDocId: 'pan-card',
    purpose: 'Tax identification and micro-business credit verification.',
    howToObtain: 'Apply online on NSDL/Protean portal or e-filing portal (Instant e-PAN with Aadhaar).',
    estimatedDays: 'Instant (e-PAN) / 10 Days (Physical)',
    officialPortal: 'https://www.onlineservices.nsdl.com'
  }
};

export function evaluateDocumentReadiness(
  schemeId: number | string,
  userDocumentsMap: Record<string, 'available' | 'missing' | 'not_sure'>
): DocumentReadinessCheck {
  const scheme = SCHEMES_DATABASE.find(s => String(s.id) === String(schemeId)) || SCHEMES_DATABASE[0];
  const requiredDocs = Array.isArray(scheme.documents) ? scheme.documents : [scheme.documents];

  let availableCount丛 = 0;
  let missingCount = 0;
  let uncertainCount = 0;

  const docStatuses = requiredDocs.map(docName => {
    // Check if user has marked this doc or close match
    let status: 'available' | 'missing' | 'not_sure' = 'missing';

    for (const [userDocKey, userStatus] of Object.entries(userDocumentsMap)) {
      if (
        userDocKey.toLowerCase().includes(docName.toLowerCase()) ||
        docName.toLowerCase().includes(userDocKey.toLowerCase())
      ) {
        status = userStatus;
        break;
      }
    }

    if (status === 'available') availableCount丛++;
    else if (status === 'not_sure') uncertainCount++;
    else missingCount++;

    const guidance = DOCUMENT_GUIDANCE_CATALOG[docName]?.howToObtain ||
      `Obtain official attested copy from relevant state issuing authority. Official portal: ${scheme.official_url}`;

    return {
      documentName: docName,
      status,
      guidance,
      officialDocId: DOCUMENT_GUIDANCE_CATALOG[docName]?.officialDocId
    };
  });

  const totalRequired = requiredDocs.length;
  // Available gives 100%, uncertain gives 50%
  const readinessPercentage = totalRequired > 0
    ? Math.round(((availableCount丛 + uncertainCount * 0.5) / totalRequired) * 100)
    : 100;

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    readinessPercentage,
    totalRequired,
    availableCount: availableCount丛,
    missingCount,
    uncertainCount,
    documents: docStatuses
  };
}
