import { CitizenDocument, ApplicationGuide } from '../types';

export const CITIZEN_DOCUMENTS: CitizenDocument[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card (UIDAI Unique Identification)',
    category: 'identity',
    department: 'Unique Identification Authority of India (UIDAI)',
    description: '12-digit biometric identity number serving as the universal proof of identity and address across India, essential for government DBT transfers and digital KYC.',
    validity: 'Lifetime (Mandatory biometric update at age 5 and 15)',
    processingTime: '7 to 15 Business Days',
    estimatedFee: 'Free (Fresh Enrollment) / ₹50 (Demographic Update) / ₹100 (Biometric)',
    officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
    helpline: '1947',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Physical presence at authorized Aadhaar Seva Kendra for 10-finger biometric & iris capture.',
      'Mobile number linked for OTP e-KYC authentication.'
    ],
    requirements: [
      {
        id: 'req-poi',
        name: 'Proof of Identity (PoI)',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Passport', 'PAN Card', 'Ration/PDS Photo Card', 'Voter ID', 'Driving License', 'Government Photo ID']
      },
      {
        id: 'req-poa',
        name: 'Proof of Address (PoA)',
        mandatory: true,
        type: 'address',
        acceptedDocs: ['Electricity Bill (<3 months)', 'Water Bill', 'Bank Passbook with Photo', 'Rent Agreement (Registered)', 'Voter ID']
      },
      {
        id: 'req-dob',
        name: 'Proof of Date of Birth (DoB)',
        mandatory: true,
        type: 'dob',
        acceptedDocs: ['Birth Certificate', 'SSLC / 10th Class Marksheet', 'Passport', 'PAN Card']
      }
    ],
    usageGuidelines: [
      'Mandatory for receiving Direct Benefit Transfer (DBT) subsidies under Central schemes.',
      'Can be locked/unlocked via mAadhaar app to prevent biometric fraud.',
      'Masked Aadhaar (showing only last 4 digits) is legally acceptable for private KYC.'
    ]
  },
  {
    id: 'pan',
    name: 'Permanent Account Number (PAN Card)',
    category: 'financial',
    department: 'Income Tax Department (CBDT) / NSDL Protean / UTIITSL',
    description: '10-digit alphanumeric identifier issued by the Income Tax Department, mandatory for tax filing, opening bank accounts, and high-value financial transactions.',
    validity: 'Lifetime',
    processingTime: 'Instant (10 Mins for digital e-PAN) / 10-15 Days for PVC physical card',
    estimatedFee: 'Free (Instant e-PAN) / ₹107 (Physical PVC Card in India) / ₹1,017 (Foreign Address)',
    officialPortalUrl: 'https://www.incometax.gov.in/iec/foportal',
    helpline: '1800-180-1961',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Active Aadhaar Card with mobile number linked for paperless Instant e-PAN.',
      'Minor applicants require parent/guardian signature and KYC.'
    ],
    requirements: [
      {
        id: 'pan-id',
        name: 'Identity & Address Proof',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Card (Instant Paperless)', 'Voter ID', 'Passport', 'Driving License']
      },
      {
        id: 'pan-photo',
        name: 'Passport Photograph & Signature',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Recent 3.5cm x 2.5cm color photograph', 'Clear signature scan on white paper']
      }
    ],
    usageGuidelines: [
      'Mandatory linking with Aadhaar under Section 139AA of the Income Tax Act.',
      'Required for bank cash deposits exceeding ₹50,000 and property purchase.'
    ]
  },
  {
    id: 'passport',
    name: 'Indian Passport (Ordinary / Tatkaal)',
    category: 'travel',
    department: 'Ministry of External Affairs (CPV Division)',
    description: 'Official national travel document certifying citizen identity and nationality for international travel, visa applications, and global consular services.',
    validity: '10 Years for Adults / 5 Years for Minors under 18',
    processingTime: 'Normal: 15-30 Days / Tatkaal: 1-3 Business Days',
    estimatedFee: '₹1,500 (Fresh 36-page Normal) / ₹2,000 (60-page Jumbo) / ₹3,500 (Tatkaal 36-page)',
    officialPortalUrl: 'https://www.passportindia.gov.in',
    helpline: '1800-258-1800',
    difficulty: 'Complex',
    popular: true,
    prerequisites: [
      'Online appointment booking at nearest Passport Seva Kendra (PSK / POPSK).',
      'Original documents mandatory for physical desk verification.',
      'Police verification will be conducted at current residential address.'
    ],
    requirements: [
      {
        id: 'pass-dob',
        name: 'Proof of Date of Birth',
        mandatory: true,
        type: 'dob',
        acceptedDocs: ['Birth Certificate (Mandatory for born after 26/01/1989)', '10th Marksheet/Passing Certificate', 'PAN Card', 'Aadhaar']
      },
      {
        id: 'pass-poa',
        name: 'Proof of Present Address',
        mandatory: true,
        type: 'address',
        acceptedDocs: ['Aadhaar Card', 'Electricity Bill / Water Bill', 'Active Bank Passbook of Scheduled Bank', 'Spouse Passport Copy']
      },
      {
        id: 'pass-non-ecr',
        name: 'Non-ECR (Emigration Check Not Required) Proof',
        mandatory: false,
        type: 'other',
        acceptedDocs: ['10th Standard / Matriculation Certificate or Higher Degree', 'Income Tax Assessment Order']
      }
    ],
    usageGuidelines: [
      'Always verify that address proof reflects your current residence where police verification will take place.',
      'Non-ECR status allows traveling abroad for employment without protector of emigrants clearance.'
    ]
  },
  {
    id: 'voter-id',
    name: 'Voter ID Card (EPIC - Electors Photo Identity Card)',
    category: 'identity',
    department: 'Election Commission of India (ECI)',
    description: 'Official photo identity issued to eligible Indian citizens aged 18+ for casting votes in Parliamentary, State Assembly, and local body elections.',
    validity: 'Lifetime (Transferable to new assembly upon residence change)',
    processingTime: '15 to 30 Days (Instant e-EPIC download on approval)',
    estimatedFee: 'Free (New Registration & Replacement)',
    officialPortalUrl: 'https://voters.eci.gov.in',
    helpline: '1950',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Must be an Indian Citizen aged 18 or turning 18 on qualifying dates (1 Jan, 1 Apr, 1 Jul, 1 Oct).',
      'Ordinarily resident at the given assembly constituency address.'
    ],
    requirements: [
      {
        id: 'voter-age',
        name: 'Proof of Age',
        mandatory: true,
        type: 'dob',
        acceptedDocs: ['Birth Certificate', 'Aadhaar Card', 'PAN Card', 'Driving License', '10th Marksheet']
      },
      {
        id: 'voter-poa',
        name: 'Proof of Residence Address',
        mandatory: true,
        type: 'address',
        acceptedDocs: ['Water/Electricity/Gas Bill', 'Aadhaar Card', 'Current Passbook of Bank/Post Office', 'Indian Passport']
      },
      {
        id: 'voter-photo',
        name: 'Passport Photo',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Recent colored passport photo (under 2MB)']
      }
    ],
    usageGuidelines: [
      'Fill Form 6 for fresh registration or Form 8 for shifting/correction.',
      'Download digital e-EPIC PDF from voters.eci.gov.in with registered mobile OTP.'
    ]
  },
  {
    id: 'driving-license',
    name: 'Driving License (DL & Learner Licence)',
    category: 'civic',
    department: 'Ministry of Road Transport and Highways (MoRTH) / State RTOs',
    description: 'Official authorization permitting an individual to drive a motor vehicle on public roads, issued after passing road safety tests.',
    validity: '20 Years or until age 40 (Non-Transport) / 5 Years (Transport Commercial)',
    processingTime: 'Learner: Instant online / Permanent DL: 15-30 Days post-test',
    estimatedFee: '₹150-₹200 (Learner) + ₹300-₹500 (Permanent DL Test & Smart Card)',
    officialPortalUrl: 'https://parivahan.gov.in/parivahan',
    helpline: '0120-4925505',
    difficulty: 'Medium',
    popular: true,
    prerequisites: [
      'Must hold a valid Learner Licence for a minimum of 30 days before taking the permanent driving test.',
      'Minimum age: 16 for gearless 50cc, 18 for Light Motor Vehicle (LMV), 20 for Heavy Commercial.'
    ],
    requirements: [
      {
        id: 'dl-age',
        name: 'Age & Identity Proof',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Card', 'Birth Certificate', '10th Marksheet', 'Passport']
      },
      {
        id: 'dl-poa',
        name: 'Address Proof',
        mandatory: true,
        type: 'address',
        acceptedDocs: ['Aadhaar Card', 'Voter ID', 'Electricity Bill', 'Registered Rent Agreement']
      },
      {
        id: 'dl-med',
        name: 'Medical Fitness Certificate (Form 1A)',
        mandatory: false,
        type: 'other',
        acceptedDocs: ['Certified Form 1A by registered medical practitioner (mandatory if age 40+ or commercial)']
      }
    ],
    usageGuidelines: [
      'Learner Licence test can be taken from home with Aadhaar authentication in most states.',
      'Digital DL on DigiLocker and mParivahan has full legal validity under the IT Act.'
    ]
  },
  {
    id: 'ration-card',
    name: 'Ration Card (NFSA / BPL / Antyodaya / APL)',
    category: 'welfare',
    department: 'Department of Food and Public Distribution / State Civil Supplies',
    description: 'State-issued household card entitling families to subsidized food grains (rice, wheat, coarse grains) under the National Food Security Act (NFSA) and serving as family proof.',
    validity: '5 to 10 Years (Subject to annual income/e-KYC verification)',
    processingTime: '15 to 30 Business Days',
    estimatedFee: 'Free / Nominal State fee ₹5 to ₹25',
    officialPortalUrl: 'https://nfsa.gov.in',
    helpline: '1967 / 1800-180-2087',
    difficulty: 'Medium',
    popular: true,
    prerequisites: [
      'Household must not be enrolled in any other active Ration Card anywhere in India (One Nation One Ration Card).',
      'All family members must complete Aadhaar seeding (e-KYC).'
    ],
    requirements: [
      {
        id: 'rc-hof',
        name: 'Head of Family Identity & Aadhaar of all members',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Cards of all living family members residing in household']
      },
      {
        id: 'rc-income',
        name: 'Income Certificate / BPL Proof',
        mandatory: true,
        type: 'income',
        acceptedDocs: ['Revenue Officer certified Income Certificate', 'Salary Slip / BPL Survey number']
      },
      {
        id: 'rc-lpg',
        name: 'LPG Connection Details',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Gas Consumer number / SV book copy to check dual subsidy exclusion']
      }
    ],
    usageGuidelines: [
      'Under One Nation One Ration Card (ONORC), you can lift grains from any Fair Price Shop across India using biometric authentication.',
      'Senior-most female adult in the household is designated as Head of Family under NFSA.'
    ]
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate (Revenue Authority)',
    category: 'certificates',
    department: 'State Revenue Department / District Magistrate / Tehsildar',
    description: 'Official revenue document certifying the annual family income from all sources, essential for availing scholarships, fee concessions, EWS reservations, and welfare subsidies.',
    validity: '1 Financial Year (April 1 to March 31) / 6 Months in some States',
    processingTime: '7 to 15 Days',
    estimatedFee: '₹15 to ₹50 (e-District portal fee)',
    officialPortalUrl: 'https://services.india.gov.in',
    helpline: 'State e-District Helpline',
    difficulty: 'Medium',
    popular: true,
    prerequisites: [
      'Submission of salary slip, Form 16, or self-declaration of agricultural income / business turnover.'
    ],
    requirements: [
      {
        id: 'inc-id',
        name: 'Identity & Residence Proof',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Card', 'Ration Card', 'Voter ID']
      },
      {
        id: 'inc-proof',
        name: 'Income Proof Evidence',
        mandatory: true,
        type: 'income',
        acceptedDocs: ['Salary Slip / Form 16', 'Bank Statement (6 months)', 'Patwari / Village Officer Report', 'ITR Return Acknowledgment']
      }
    ],
    usageGuidelines: [
      'Mandatory for EWS (Economically Weaker Section) 10% job/education quota eligibility (family income under ₹8 Lakh/year).',
      'Required annually for National Scholarship Portal (NSP) fee reimbursements.'
    ]
  },
  {
    id: 'caste-certificate',
    name: 'Community / Caste Certificate (SC / ST / OBC-NCL)',
    category: 'certificates',
    department: 'State Revenue / Social Welfare Department (Tehsildar / Sub-Divisional Magistrate)',
    description: 'Legal certificate establishing the social category (SC, ST, OBC, or SEBC) of a citizen for claiming constitutional affirmative action, college reservations, and exam fee exemptions.',
    validity: 'SC/ST: Lifetime / OBC-NCL: 1 Financial Year',
    processingTime: '15 to 30 Days',
    estimatedFee: '₹15 to ₹60',
    officialPortalUrl: 'https://services.india.gov.in',
    helpline: 'State Social Justice Helpline',
    difficulty: 'Medium',
    popular: true,
    prerequisites: [
      'Proof of paternal caste lineage (Father or Paternal Grandfather caste document).',
      'For OBC Non-Creamy Layer, annual family income must be below ₹8 Lakhs from non-agricultural/salary sources.'
    ],
    requirements: [
      {
        id: 'caste-blood',
        name: 'Paternal Blood Relative Caste Certificate',
        mandatory: true,
        type: 'relationship',
        acceptedDocs: ['Father’s Caste Certificate', 'Paternal Uncle / Grandfather Record of Rights', 'School Leaving Certificate showing Caste']
      },
      {
        id: 'caste-res',
        name: 'Residence & Historical Domicile Proof',
        mandatory: true,
        type: 'address',
        acceptedDocs: ['Land 1950/1967 lineage records', 'Aadhaar Card', 'State Domicile Certificate']
      }
    ],
    usageGuidelines: [
      'Central Government formats differ from State formats; verify UPSC/SSC prescribed annexures before applying.',
      'OBC-NCL certificates must be issued on or after April 1 of the ongoing financial year for central exams.'
    ]
  },
  {
    id: 'birth-certificate',
    name: 'Birth Certificate (Civil Registration System)',
    category: 'certificates',
    department: 'Registrar General of India / Municipal Health Department / Gram Panchayat',
    description: 'Primary legal record of a child’s birth establishing age, parentage, and birthplace, mandatory for school enrollment, passport, and driving license.',
    validity: 'Lifetime',
    processingTime: '3 to 7 Days (CRS portal / Municipal Ward)',
    estimatedFee: 'Free (Within 21 days of birth) / ₹5 to ₹50 (Delayed registration)',
    officialPortalUrl: 'https://crsorgi.gov.in',
    helpline: 'CRS Nodal Helpdesk',
    difficulty: 'Easy',
    popular: false,
    prerequisites: [
      'Hospital discharge summary or Form 1 signed by medical superintendent.',
      'Reporting within 21 days of delivery avoids magistrate approval delays.'
    ],
    requirements: [
      {
        id: 'birth-hosp',
        name: 'Institutional Hospital Birth Summary',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Hospital Discharge Summary', 'Form 1 CRS Registration Slip', 'Vaccination Card']
      },
      {
        id: 'birth-parents',
        name: 'Parents Identity Proof',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Mother and Father Aadhaar Card', 'Marriage Certificate (Optional but recommended)']
      }
    ],
    usageGuidelines: [
      'Under the Registration of Births and Deaths (Amendment) Act 2023, digital birth certificates serve as single conclusive age proof.',
      'Child name can be updated within 12 months without penalty.'
    ]
  },
  {
    id: 'eshram',
    name: 'e-Shram Card (National Database of Unorganised Workers)',
    category: 'welfare',
    department: 'Ministry of Labour and Employment (MoLE)',
    description: '12-digit Universal Account Number (UAN) card for unorganised workers (construction laborers, migrant workers, gig & platform workers, domestic helpers, street vendors, small farmers), providing social security benefits and accidental insurance cover.',
    validity: 'Lifetime (No renewal required; annual profile updates recommended)',
    processingTime: 'Instant (Under 5 Minutes online)',
    estimatedFee: '100% Free on official portal / ₹20 at CSC centers',
    officialPortalUrl: 'https://eshram.gov.in',
    helpline: '14434 / 1800-137-4150',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Age must be between 16 and 59 years.',
      'Must NOT be a member of EPFO (Provident Fund) or ESIC, and not an income tax payee.'
    ],
    requirements: [
      {
        id: 'eshram-aadhaar',
        name: 'Aadhaar Card with Linked Mobile',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Number with active OTP-receiving mobile']
      },
      {
        id: 'eshram-bank',
        name: 'Active Bank Account Details (DBT Enabled)',
        mandatory: true,
        type: 'income',
        acceptedDocs: ['Bank Account Number and IFSC Code (Aadhaar Seeded)']
      },
      {
        id: 'eshram-occ',
        name: 'Primary Occupation / Skill Details',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Selection from standard National Classification of Occupations (NCO) trade code']
      }
    ],
    usageGuidelines: [
      'Provides ₹2 Lakh accidental death / permanent disability insurance cover under PMSBY.',
      'Direct inclusion into future disaster relief and social welfare DBT transfers directly from Central & State ministries.',
      'Download laminated digital UAN Card directly onto DigiLocker or save as PDF.'
    ]
  },
  {
    id: 'udyam',
    name: 'Udyam MSME Registration Certificate',
    category: 'financial',
    department: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    description: 'Official Government of India certificate for Micro, Small, and Medium Enterprises (MSMEs), mandatory for collateral-free bank loans, 50% patent/trademark discounts, and government tender priority.',
    validity: 'Lifetime (Permanent Udyam Registration Number)',
    processingTime: 'Instant / 1 to 2 Business Days',
    estimatedFee: '100% Free (Government Portal charges ₹0.00)',
    officialPortalUrl: 'https://udyamregistration.gov.in',
    helpline: '011-23063288',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Proprietor/Partner/Director Aadhaar Card and PAN Card.',
      'GSTIN is mandatory for manufacturing/trading enterprises as per CGST Act (exempt for small service units below threshold).'
    ],
    requirements: [
      {
        id: 'udyam-pan',
        name: 'PAN Card of Enterprise / Owner',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Individual PAN (for Proprietorship) or Business Entity PAN']
      },
      {
        id: 'udyam-aadhaar',
        name: 'Aadhaar of Entrepreneur',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Card with active mobile for OTP validation']
      },
      {
        id: 'udyam-bank',
        name: 'Current / Savings Bank Account Details',
        mandatory: true,
        type: 'income',
        acceptedDocs: ['Bank Account Number and IFSC code']
      }
    ],
    usageGuidelines: [
      'Zero paperwork / completely self-declaration based paperless online system.',
      'Eligible for Priority Sector Lending (PSL) with lower interest rates from nationalized banks.',
      'Protection against delayed payments under MSMED Act with mandatory 45-day clearance rule.'
    ]
  },
  {
    id: 'abha',
    name: 'Ayushman Bharat Health Account (ABHA Card / Health ID)',
    category: 'welfare',
    department: 'National Health Authority (NHA) / Ministry of Health and Family Welfare',
    description: '14-digit unique health identifier under the Ayushman Bharat Digital Mission (ABDM) to digitally store and share medical records, lab reports, and prescriptions securely across hospitals and doctors nationwide.',
    validity: 'Lifetime',
    processingTime: 'Instant (Under 2 Minutes)',
    estimatedFee: '100% Free',
    officialPortalUrl: 'https://abha.abdm.gov.in',
    helpline: '1800-11-4477',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Aadhaar Number or Driving License with linked mobile number.'
    ],
    requirements: [
      {
        id: 'abha-aadhaar',
        name: 'Aadhaar Card or Driving License',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Number for Instant OTP validation or DL']
      },
      {
        id: 'abha-mobile',
        name: 'Active Mobile Number',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Mobile number for OTP verification and ABHA address creation']
      }
    ],
    usageGuidelines: [
      'Allows paperless registration at OPD counters in 30,000+ hospitals using Scan & Share QR code.',
      '100% user consent controlled: no hospital can access your diagnostic history without your OTP approval on the ABHA App.'
    ]
  },
  {
    id: 'digilocker',
    name: 'DigiLocker Digital Document Wallet',
    category: 'civic',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    description: 'Flagship initiative under Digital India providing a secure dedicated cloud platform for issuance and verification of digital certificates, recognized on par with physical original documents under Rule 9A of IT Rules 2016.',
    validity: 'Lifetime (1 GB Free Secure Cloud Storage)',
    processingTime: 'Instant Account Creation',
    estimatedFee: '100% Free',
    officialPortalUrl: 'https://www.digilocker.gov.in',
    helpline: '1800-111-555',
    difficulty: 'Easy',
    popular: true,
    prerequisites: [
      'Aadhaar number linked to mobile phone for one-time registration.'
    ],
    requirements: [
      {
        id: 'digi-aadhaar',
        name: 'Aadhaar Number',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['12-digit Aadhaar Number with OTP']
      },
      {
        id: 'digi-pin',
        name: '6-digit Security Security PIN',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['User-created 6-digit confidential PIN']
      }
    ],
    usageGuidelines: [
      'Fetch Driving License, Vehicle Registration (RC), Class 10/12 Marksheets, Caste Certificate, and Ration Card directly from issuing authorities.',
      'Accepted by Traffic Police, Airport Security (CISF), and Universities nationwide without carrying physical originals.'
    ]
  },
  {
    id: 'ews-certificate',
    name: 'Economically Weaker Section (EWS) Certificate',
    category: 'certificates',
    department: 'Department of Personnel and Training (DoPT) / State Revenue Authorities',
    description: 'Income and Asset certificate entitling eligible General category citizens to 10% reservation in Central & State Government jobs and admissions in educational institutions (IITs, NITs, AIIMS, Central Universities).',
    validity: '1 Financial Year (Valid for appointments during the succeeding financial year)',
    processingTime: '15 to 21 Business Days',
    estimatedFee: '₹20 to ₹60 (e-District portal fee)',
    officialPortalUrl: 'https://serviceonline.gov.in',
    helpline: 'State e-District Helpdesk',
    difficulty: 'Medium',
    popular: true,
    prerequisites: [
      'Belong to General Category (not covered under SC, ST, or OBC reservation).',
      'Gross annual family income must be below ₹8,00,000 (Rupees Eight Lakhs).',
      'Must NOT own 5+ acres of agricultural land, residential flat of 1000+ sq ft, or residential plot of 100+ sq yards in notified municipalities.'
    ],
    requirements: [
      {
        id: 'ews-id',
        name: 'Identity & Address Proof',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Card', 'Voter ID', 'Ration Card', 'Domicile Certificate']
      },
      {
        id: 'ews-income',
        name: 'Income & Asset Evidence',
        mandatory: true,
        type: 'income',
        acceptedDocs: ['Form 16 / ITR Acknowledgment', 'Patwari Land Holding Report', 'Property deed / Electricity bill']
      },
      {
        id: 'ews-affidavit',
        name: 'Notarized Self-Declaration Affidavit',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Affidavit declaring family income and land assets below prescribed ceiling']
      }
    ],
    usageGuidelines: [
      'Apply at Tehsildar / Sub-Divisional Magistrate (SDM) / Revenue Division Office.',
      'Must be updated annually after April 1st with fresh income verification for the new fiscal year.'
    ]
  },
  {
    id: 'udid',
    name: 'Unique Disability ID (UDID) Card & Certificate',
    category: 'welfare',
    department: 'Department of Empowerment of Persons with Disabilities (DEPwD), MoSJE',
    description: 'Universal Smart Card issued to Persons with Disabilities (PwD) containing disability percentage and medical history, eliminating the need to carry multiple physical medical records for travel concessions, pensions, and quotas.',
    validity: 'Permanent (for permanent disabilities) or 5 Years (temporary conditions)',
    processingTime: '30 to 45 Days (includes Medical Board assessment)',
    estimatedFee: '100% Free',
    officialPortalUrl: 'https://www.swavlambancard.gov.in',
    helpline: '011-24365019',
    difficulty: 'Medium',
    popular: false,
    prerequisites: [
      'Disability assessment by certified Medical Board at District Civil Hospital.',
      'Minimum 40% benchmark disability for welfare scheme and reservation entitlement.'
    ],
    requirements: [
      {
        id: 'udid-id',
        name: 'Proof of Identity and Address',
        mandatory: true,
        type: 'identity',
        acceptedDocs: ['Aadhaar Card', 'Voter ID', 'Ration Card']
      },
      {
        id: 'udid-medical',
        name: 'Hospital Medical Records / Old Disability Certificate',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Hospital Clinical Case Sheet', 'Audiometry/Visual assessment report', 'Civil Hospital Medical Board Report']
      },
      {
        id: 'udid-photo',
        name: 'Recent Passport Photo showing Disability',
        mandatory: true,
        type: 'other',
        acceptedDocs: ['Passport size colored photograph clearly showing physical condition']
      }
    ],
    usageGuidelines: [
      'Entitles holder to Indian Railways concessions (up to 75% in AC/Sleeper) and State RTC bus passes.',
      'Mandatory for Divyangjan scholarships and ADIP scheme free assistive devices (wheelchairs, hearing aids, prosthetics).'
    ]
  }
];

export const APPLICATION_GUIDES: Record<string, ApplicationGuide> = {
  aadhaar: {
    documentId: 'aadhaar',
    documentName: 'Aadhaar Card (Fresh Enrollment & Update)',
    overview: 'Follow this official roadmap to book an enrollment slot at an Aadhaar Seva Kendra, prepare original proofs, complete biometric capture, and download your e-Aadhaar.',
    officialPortal: 'https://myaadhaar.uidai.gov.in',
    onlineSteps: [
      {
        stepNumber: 1,
        title: 'Book Appointment on myAadhaar Portal',
        description: 'Navigate to myaadhaar.uidai.gov.in and click "Book an Appointment". Choose your City/Location and select an available time slot at the nearest UIDAI Aadhaar Seva Kendra.',
        checklistItems: [
          'Visit myaadhaar.uidai.gov.in',
          'Select State/City',
          'Enter mobile number for OTP verification',
          'Select preferred appointment date & time slot'
        ],
        tip: 'Booking online guarantees zero waiting time and dedicated desk service.',
        estimatedDuration: '5 Minutes'
      },
      {
        stepNumber: 2,
        title: 'Assemble Original Physical Documents',
        description: 'Gather your original Proof of Identity (Passport, PAN), Proof of Address (Electricity bill, Rent deed), and Date of Birth proof (Birth cert, 10th mark sheet).',
        checklistItems: [
          'Original PoI document',
          'Original PoA document',
          'Original DoB proof',
          'Appointment confirmation slip (printed or SMS)'
        ],
        warning: 'Only original documents are scanned by the operator. Photocopies without originals are rejected.',
        estimatedDuration: '1 Day prior'
      },
      {
        stepNumber: 3,
        title: 'Biometric & Demographic Capture at Center',
        description: 'Visit the center 10 minutes before your slot. The certified operator captures 10 fingerprints, iris scan, facial photograph, and enters demographic details.',
        checklistItems: [
          'Fingerprint scanner scan (all 10 fingers)',
          'Iris camera scan',
          'Live white-background photograph',
          'Verify screen text for name/spelling before final submission'
        ],
        tip: 'Check your name spelling letter-by-letter on the operator display screen before signing the acknowledgment.',
        estimatedDuration: '15 Minutes'
      },
      {
        stepNumber: 4,
        title: 'Track EID & Download Digital e-Aadhaar',
        description: 'Receive your 28-digit Enrollment ID (EID) slip. After 5-10 business days, track status on myAadhaar and download your password-protected e-Aadhaar PDF.',
        checklistItems: [
          'Keep 28-digit EID slip safe',
          'Check status at myaadhaar.uidai.gov.in/check-aadhaar-status',
          'Download e-Aadhaar using OTP',
          'PDF Password: First 4 letters of name in CAPITAL + Birth Year (e.g. RAME1995)'
        ],
        estimatedDuration: '7 to 10 Days'
      }
    ],
    offlineSteps: [
      {
        stepNumber: 1,
        title: 'Walk-in to Nearest Post Office or Bank ASK',
        description: 'Visit any designated UIDAI enrollment branch in nationalized banks, post offices, or collectorate offices with original KYC proofs.',
        checklistItems: ['Collect Form 1 enrollment slip', 'Fill details in blue ink', 'Attach original documents'],
        estimatedDuration: '30 Minutes'
      }
    ],
    commonMistakes: [
      'Providing mismatched names across Date of Birth proof and Identity proof (e.g. initials vs expanded name).',
      'Using an expired or non-registered rent agreement as address proof.',
      'Entering a temporary mobile number not owned by the applicant for Aadhaar OTP.'
    ],
    verificationProcess: 'Data packets are encrypted at the terminal and transmitted to UIDAI Central Data Center for de-duplication and 1:N biometric matching before generating the 12-digit Aadhaar number.'
  },
  pan: {
    documentId: 'pan',
    documentName: 'Instant e-PAN & Physical PAN Card',
    overview: 'Complete paperless digital issuance of 10-digit Permanent Account Number in 10 minutes using Aadhaar e-KYC on the Income Tax e-filing portal.',
    officialPortal: 'https://www.incometax.gov.in/iec/foportal',
    onlineSteps: [
      {
        stepNumber: 1,
        title: 'Access Income Tax Portal Instant e-PAN Section',
        description: 'Open incometax.gov.in -> Quick Links -> Instant e-PAN -> Click "Get New e-PAN".',
        checklistItems: [
          'Open official e-filing portal',
          'Click "Get New e-PAN"',
          'Enter 12-digit Aadhaar number',
          'Confirm declaration checkbox'
        ],
        tip: 'Instant e-PAN is 100% free and generated digitally within 10 minutes.',
        estimatedDuration: '2 Minutes'
      },
      {
        stepNumber: 2,
        title: 'Authenticate via Aadhaar OTP',
        description: 'Enter the 6-digit OTP received on your Aadhaar-registered mobile number. Validate demographic details pulled from UIDAI.',
        checklistItems: [
          'Enter OTP received on mobile',
          'Verify Name, DoB, Gender, and Address displayed from Aadhaar',
          'Optional: Validate email address via OTP'
        ],
        warning: 'Ensure your Aadhaar is not already linked to another PAN number.',
        estimatedDuration: '3 Minutes'
      },
      {
        stepNumber: 3,
        title: 'Download e-PAN PDF & Order PVC Card (Optional)',
        description: 'Your 15-digit acknowledgment number is generated. Within 10 minutes, click "Check Status/Download PAN" to get your digitally signed e-PAN PDF.',
        checklistItems: [
          'Download signed e-PAN PDF',
          'PDF Password is DoB in DDMMYYYY format',
          'Optional: Order physical PVC card on Protean/UTIITSL portal for ₹50 fee'
        ],
        estimatedDuration: '10 Minutes'
      }
    ],
    offlineSteps: [
      {
        stepNumber: 1,
        title: 'Submit Form 49A at TIN-FC / NSDL Center',
        description: 'Submit physical Form 49A with two passport photographs and self-attested ID/address proofs at nearest NSDL TIN-FC center.',
        checklistItems: ['Fill Form 49A', 'Affix 2 passport photos', 'Pay ₹107 fee in cash/DD'],
        estimatedDuration: '15 Days'
      }
    ],
    commonMistakes: [
      'Applying for a new PAN when you already have an active PAN (penalty of ₹10,000 under Section 272B).',
      'Name spelling on Aadhaar differing from school mark sheets.',
      'Not validating email during application, causing delay in e-PAN delivery.'
    ],
    verificationProcess: 'Automatic API cross-validation between UIDAI and Income Tax Directorate of Systems. PAN number is allocated and digitally signed XML certificate created.'
  },
  passport: {
    documentId: 'passport',
    documentName: 'Indian Passport (Fresh / Re-issue)',
    overview: 'Step-by-step procedure for registration on Passport Seva Portal, fee payment, slot booking at PSK, document verification, and police station inquiry.',
    officialPortal: 'https://www.passportindia.gov.in',
    onlineSteps: [
      {
        stepNumber: 1,
        title: 'Register & Complete Online Application Form',
        description: 'Register on passportindia.gov.in. Choose "Apply for Fresh Passport / Re-issue". Fill applicant details, family background, current address, and emergency contact.',
        checklistItems: [
          'Create user login on passportindia.gov.in',
          'Fill Form with exact name as in 10th marksheet',
          'Select Booklet type: 36 pages (Normal) or 60 pages (Jumbo)',
          'Select Non-ECR status (Yes if passed 10th standard)'
        ],
        tip: 'Ensure the present address is where you currently reside, as police verification will occur at this address.',
        estimatedDuration: '20 Minutes'
      },
      {
        stepNumber: 2,
        title: 'Pay Fee & Book PSK Appointment Slot',
        description: 'Pay application fee (₹1,500 Normal / ₹3,500 Tatkaal) via SBI e-Pay / Netbanking and schedule appointment date and time at your nearest PSK or POPSK.',
        checklistItems: [
          'Complete online payment',
          'Select Passport Seva Kendra (PSK)',
          'Choose appointment date & time slot',
          'Print Application Receipt containing ARN'
        ],
        estimatedDuration: '10 Minutes'
      },
      {
        stepNumber: 3,
        title: 'Attend PSK Appointment for Counter Scrutiny',
        description: 'Reach PSK 15 minutes before slot with all original documents + 2 self-attested photocopies. Go through Counter A (Biometrics/Photo), Counter B (Document Verification), Counter C (Granting Officer).',
        checklistItems: [
          'Counter A: Fingerprint capture, iris scan & high-res photograph',
          'Counter B: Verification officer inspects original proofs',
          'Counter C: Assistant Passport Officer grants approval',
          'Collect exit acknowledgment paper'
        ],
        warning: 'Laminations on certificates must not obscure serial numbers or signatures.',
        estimatedDuration: '45 Minutes at PSK'
      },
      {
        stepNumber: 4,
        title: 'Police Verification & Speed Post Delivery',
        description: 'Your local police station will contact you for address and character confirmation. After police clearance report (PVR), your passport is printed and dispatched via India Post Speed Post.',
        checklistItems: [
          'Attend local police inquiry with 2 neighbor witness signatures',
          'Track Speed Post tracking number via SMS',
          'Receive physical passport and sign on page 2'
        ],
        estimatedDuration: '10 to 20 Days'
      }
    ],
    offlineSteps: [],
    commonMistakes: [
      'Applying under Tatkaal without eligible 3 mandatory proof annexures.',
      'Suppressing criminal FIR or court proceedings details in the declaration.',
      'Mismatch in spouse name between marriage certificate and application.'
    ],
    verificationProcess: 'Physical document inspection at PSK followed by digital/physical Police Verification Report (PVR) submitted by district special branch directly to Regional Passport Office.'
  },
  eshram: {
    documentId: 'eshram',
    documentName: 'e-Shram Universal Account Number (UAN) Card',
    overview: 'Complete self-registration for unorganised workers on eshram.gov.in using Aadhaar OTP to receive digital UAN Card and ₹2 Lakh PMSBY accidental insurance cover.',
    officialPortal: 'https://eshram.gov.in',
    onlineSteps: [
      {
        stepNumber: 1,
        title: 'Access Self-Enrollment on e-Shram Portal',
        description: 'Open eshram.gov.in and click "Register on e-Shram". Enter your Aadhaar-linked mobile number and captcha.',
        checklistItems: [
          'Visit eshram.gov.in',
          'Enter Aadhaar linked Mobile Number',
          'Confirm you are NOT an EPFO / ESIC member',
          'Submit OTP received on mobile'
        ],
        estimatedDuration: '2 Minutes'
      },
      {
        stepNumber: 2,
        title: 'Authenticate Aadhaar e-KYC',
        description: 'Enter your 12-digit Aadhaar Number, agree to terms, and choose OTP mode. Enter the Aadhaar OTP to pull demographic and photo details automatically.',
        checklistItems: [
          'Enter 12-digit Aadhaar Number',
          'Enter OTP received from UIDAI',
          'Verify your name, DoB, and residential address'
        ],
        tip: 'Ensure your Aadhaar is linked with active mobile number before beginning.',
        estimatedDuration: '2 Minutes'
      },
      {
        stepNumber: 3,
        title: 'Fill Personal, Bank, and Occupation Details',
        description: 'Enter social category, marital status, nominee name, educational qualification, income slab, primary occupation (search trade from list), and bank account details.',
        checklistItems: [
          'Add Nominee details (Name, Relationship, Age)',
          'Select Primary Occupation from NCO List (e.g., Construction Worker, Driver, Tailor)',
          'Enter Bank Account Number and IFSC Code for DBT'
        ],
        estimatedDuration: '4 Minutes'
      },
      {
        stepNumber: 4,
        title: 'Review Self-Declaration & Download UAN Card',
        description: 'Verify the preview summary and submit. Your 12-digit UAN Card will be instantly generated. Click "Download UAN Card" to save the high-resolution PDF.',
        checklistItems: [
          'Check all details on preview screen',
          'Submit final declaration',
          'Download UAN Card PDF with QR Code'
        ],
        estimatedDuration: '1 Minute'
      }
    ],
    offlineSteps: [
      {
        stepNumber: 1,
        title: 'Visit Common Service Centre (CSC)',
        description: 'Walk in to nearest CSC / VLE center with Aadhaar Card, mobile, and bank passbook. CSC operator will register you using fingerprint biometric authentication for free.',
        checklistItems: ['Aadhaar Card', 'Active Mobile', 'Bank Passbook'],
        estimatedDuration: '15 Minutes'
      }
    ],
    commonMistakes: [
      'Entering bank account not linked to Aadhaar (causes DBT subsidy failures).',
      'Registering if already enrolled under EPFO or ESIC as a formal salaried employee.',
      'Selecting incorrect occupation code.'
    ],
    verificationProcess: 'Automated real-time API checks with UIDAI for biometric identity, NPCI for Aadhaar-bank account mapping, and EPFO/ESIC exclusion databases.'
  },
  udyam: {
    documentId: 'udyam',
    documentName: 'Udyam MSME Registration Certificate',
    overview: 'Paperless online registration for micro, small, and medium businesses to receive a lifetime Udyam Registration Certificate with QR code.',
    officialPortal: 'https://udyamregistration.gov.in',
    onlineSteps: [
      {
        stepNumber: 1,
        title: 'Aadhaar & PAN Verification on Udyam Portal',
        description: 'Visit udyamregistration.gov.in -> Click "For New Entrepreneurs who are not Registered yet as MSME". Enter proprietor/director Aadhaar and PAN for real-time verification.',
        checklistItems: [
          'Enter Aadhaar number and Entrepreneur Name',
          'Validate OTP received on Aadhaar mobile',
          'Enter PAN number and validate with Income Tax Department'
        ],
        estimatedDuration: '3 Minutes'
      },
      {
        stepNumber: 2,
        title: 'Enter Enterprise Details & Plant Location',
        description: 'Enter enterprise name, unit location, postal address, date of business commencement, bank account details (A/C and IFSC), and Major Activity (Manufacturing / Services).',
        checklistItems: [
          'Name of Enterprise and Unit Address',
          'Select NIC Code for business activity (2-digit, 4-digit, 5-digit)',
          'Number of persons employed (Male / Female)'
        ],
        estimatedDuration: '5 Minutes'
      },
      {
        stepNumber: 3,
        title: 'Investment in Plant & Machinery Declaration',
        description: 'Provide written-down investment and annual turnover figures (auto-pulled from ITR if filed, or self-declared for new businesses).',
        checklistItems: [
          'Enter Plant & Machinery / Equipment Investment',
          'Enter Total Annual Turnover',
          'Opt in for Government e-Marketplace (GeM) and TReDS portals'
        ],
        tip: 'Opting into GeM enables your business to sell goods/services directly to Government departments.',
        estimatedDuration: '3 Minutes'
      },
      {
        stepNumber: 4,
        title: 'Final OTP Submission & Certificate Issuance',
        description: 'Enter final mobile OTP. A unique Udyam Registration Number (e.g., UDYAM-XX-00-0000000) will be generated. Download the official certificate containing verifiable QR code.',
        checklistItems: [
          'Submit final OTP',
          'Copy Udyam Registration Reference Number',
          'Download and print Udyam Certificate'
        ],
        estimatedDuration: '1 Minute'
      }
    ],
    offlineSteps: [],
    commonMistakes: [
      'Registering on fraudulent third-party payment websites (official portal is 100% free with ₹0 fee).',
      'Mismatch in PAN name and Aadhaar name.',
      'Selecting wrong 5-digit NIC activity classification.'
    ],
    verificationProcess: 'Fully automated server integration between MSME Ministry, Central Board of Direct Taxes (CBDT), and GST Network (GSTN).'
  }
};
