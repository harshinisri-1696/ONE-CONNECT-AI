import { EligibilityProfile, JobItem, SchemeItem, CitizenDocument } from '../types';

export interface EligibilityJobResult {
  job: JobItem;
  isEligible: boolean;
  matchScore: number;
  reasons: string[];
  ineligibilityReasons: string[];
  effectiveMaxAge: number;
}

export interface EligibilitySchemeResult {
  scheme: SchemeItem;
  isEligible: boolean;
  matchScore: number;
  reasons: string[];
  ineligibilityReasons: string[];
}

export interface EligibilityDocResult {
  document: CitizenDocument;
  isEligible: boolean;
  matchScore: number;
  reasons: string[];
  prerequisitesMet: boolean;
}

const QUALIFICATION_LEVELS: Record<string, number> = {
  'Below 10th': 1,
  '10th Pass': 2,
  '12th Pass': 3,
  'ITI': 3.5,
  'Diploma': 3.8,
  "Bachelor's Degree": 4,
  'B.Tech / B.E (Engineering)': 4.2,
  'MBBS / Medical': 4.5,
  'LLB (Law)': 4.2,
  "Master's Degree": 5,
  'PhD / Doctorate': 6,
};

function getQualificationLevel(qualStr: string): number {
  if (!qualStr) return 0;
  const q = qualStr.toLowerCase();
  if (q.includes('phd') || q.includes('doctorate')) return 6;
  if (q.includes('master') || q.includes('post graduate') || q.includes('m.tech') || q.includes('mba')) return 5;
  if (q.includes('mbbs') || q.includes('medical') || q.includes('bds')) return 4.5;
  if (q.includes('b.tech') || q.includes('b.e') || q.includes('engineering') || q.includes('bca') || q.includes('b.sc')) return 4.2;
  if (q.includes('law') || q.includes('llb')) return 4.2;
  if (q.includes('bachelor') || q.includes('degree') || q.includes('graduate')) return 4;
  if (q.includes('diploma')) return 3.8;
  if (q.includes('iti')) return 3.5;
  if (q.includes('12th') || q.includes('intermediate') || q.includes('higher secondary') || q.includes('hsc')) return 3;
  if (q.includes('10th') || q.includes('matric') || q.includes('sslc')) return 2;
  return 1;
}

export function calculateCategoryAgeRelaxation(category: string): number {
  switch (category) {
    case 'OBC':
      return 3;
    case 'SC':
    case 'ST':
      return 5;
    case 'PwD':
      return 10;
    default:
      return 0;
  }
}

export function evaluateJobEligibility(
  job: JobItem,
  profile: EligibilityProfile
): EligibilityJobResult {
  const reasons: string[] = [];
  const ineligibilityReasons: string[] = [];
  let score = 100;

  const ageRelaxation = calculateCategoryAgeRelaxation(profile.category);
  const effectiveMaxAge = job.max_age + ageRelaxation;

  // 1. Age Check
  if (profile.age < job.min_age) {
    ineligibilityReasons.push(`Age ${profile.age} is below minimum requirement (${job.min_age} yrs).`);
    score -= 40;
  } else if (profile.age > effectiveMaxAge) {
    ineligibilityReasons.push(
      `Age ${profile.age} exceeds maximum permitted ${effectiveMaxAge} yrs (Base: ${job.max_age} + ${ageRelaxation} yrs ${profile.category} relaxation).`
    );
    score -= 40;
  } else {
    reasons.push(`Age criteria met (${profile.age} within ${job.min_age}-${effectiveMaxAge} yrs).`);
  }

  // 2. Education Qualification Check
  const candidateLevel = getQualificationLevel(profile.qualification);
  const requiredLevel = getQualificationLevel(job.minimum_qualification);

  if (candidateLevel < requiredLevel) {
    ineligibilityReasons.push(`Requires ${job.minimum_qualification}, but profile has ${profile.qualification}.`);
    score -= 40;
  } else {
    reasons.push(`Educational requirement met (${job.minimum_qualification}).`);
  }

  // 3. Percentage Check
  if (job.minimum_percentage && profile.percentage < job.minimum_percentage) {
    ineligibilityReasons.push(`Requires min ${job.minimum_percentage}% in qualifying exam (candidate has ${profile.percentage}%).`);
    score -= 25;
  }

  // 4. Experience Check
  if (job.experience_required?.toLowerCase().includes('yes') && profile.experienceYears <= 0) {
    ineligibilityReasons.push(`Prior work experience required.`);
    score -= 20;
  }

  // 5. Specialization / Stream check if strictly specified
  if (job.specialization && job.specialization !== 'Any' && profile.specialization) {
    const specLower = job.specialization.toLowerCase();
    const candSpecLower = profile.specialization.toLowerCase();
    if (!candSpecLower.includes(specLower) && !specLower.includes(candSpecLower) && candSpecLower !== 'general') {
      // Soft penalty / note
      score -= 10;
    }
  }

  const isEligible = ineligibilityReasons.length === 0;
  return {
    job,
    isEligible,
    matchScore: Math.max(10, Math.min(100, isEligible ? score : Math.max(15, 100 - ineligibilityReasons.length * 30))),
    reasons,
    ineligibilityReasons,
    effectiveMaxAge
  };
}

export function evaluateSchemeEligibility(
  scheme: SchemeItem,
  profile: EligibilityProfile
): EligibilitySchemeResult {
  const reasons: string[] = [];
  const ineligibilityReasons: string[] = [];
  let score = 85;

  const text = `${scheme.name} ${scheme.details} ${scheme.eligibility} ${scheme.category} ${scheme.benefits}`.toLowerCase();

  // 1. Gender check
  if (text.includes('girl child') || text.includes('women only') || text.includes('pregnant') || text.includes('lactating')) {
    if (profile.gender === 'Male') {
      ineligibilityReasons.push('Exclusively intended for female beneficiaries or girl children.');
      score -= 50;
    } else {
      reasons.push('Matches female/child empowerment criteria.');
      score += 15;
    }
  }

  // 2. Farmer check
  if (text.includes('farmer') || text.includes('kisan') || text.includes('cultivator') || text.includes('fishermen') || text.includes('agriculture')) {
    if (profile.isFarmer || profile.employmentStatus === 'Farmer') {
      reasons.push('Farmer / Agriculture occupational eligibility met.');
      score += 20;
    } else {
      ineligibilityReasons.push('Requires agricultural landholder or registered farmer status.');
      score -= 35;
    }
  }

  // 3. Senior citizen check
  if (text.includes('senior') || text.includes('60+') || text.includes('old age pension') || text.includes('elderly')) {
    if (profile.age >= 60 || profile.isSeniorCitizen) {
      reasons.push('Senior citizen age bracket (60+ yrs) met.');
      score += 20;
    } else {
      ineligibilityReasons.push('Requires age 60 years or older.');
      score -= 40;
    }
  }

  // 4. Student check
  if (text.includes('student') || text.includes('scholarship') || text.includes('post-matric') || text.includes('pre-matric')) {
    if (profile.isStudent || profile.employmentStatus === 'Student' || profile.age <= 28) {
      reasons.push('Bonafide student / academic candidate match.');
      score += 15;
    } else {
      ineligibilityReasons.push('Requires enrolled bonafide student status.');
      score -= 30;
    }
  }

  // 5. Income check
  if (text.includes('bpl') || text.includes('below poverty line') || text.includes('secc') || text.includes('antodaya')) {
    if (profile.hasBPLCard || profile.annualIncome <= 120000) {
      reasons.push('Economic threshold / BPL income criteria fulfilled.');
      score += 15;
    } else {
      ineligibilityReasons.push('Income exceeds BPL / low-income threshold.');
      score -= 25;
    }
  } else if (profile.annualIncome > 800000 && (text.includes('income below') || text.includes('marginalized'))) {
    ineligibilityReasons.push('Annual income may exceed subsidized ceiling.');
    score -= 15;
  }

  // 6. Disability
  if (text.includes('disability') || text.includes('divyang') || text.includes('handicapped') || text.includes('pwd')) {
    if (profile.isDifferentlyAbled || profile.category === 'PwD') {
      reasons.push('PwD / Differently-abled benefit criteria met.');
      score += 25;
    } else {
      ineligibilityReasons.push('Exclusively for persons with benchmark disabilities (40%+).');
      score -= 40;
    }
  }

  const isEligible = ineligibilityReasons.length === 0;
  return {
    scheme,
    isEligible,
    matchScore: Math.max(10, Math.min(100, isEligible ? Math.min(98, score) : Math.max(15, 80 - ineligibilityReasons.length * 25))),
    reasons: reasons.length > 0 ? reasons : ['General citizen demographic criteria applicable.'],
    ineligibilityReasons
  };
}

export function evaluateDocEligibility(
  doc: CitizenDocument,
  profile: EligibilityProfile
): EligibilityDocResult {
  const reasons: string[] = [];
  let score = 95;

  if (doc.id === 'voter-id' && profile.age < 18) {
    return {
      document: doc,
      isEligible: false,
      matchScore: 20,
      reasons: [],
      prerequisitesMet: false
    };
  }

  if (doc.id === 'driving-license' && profile.age < 18) {
    return {
      document: doc,
      isEligible: false,
      matchScore: 25,
      reasons: [],
      prerequisitesMet: false
    };
  }

  if (doc.id === 'senior-citizen-id' && profile.age < 60) {
    return {
      document: doc,
      isEligible: false,
      matchScore: 15,
      reasons: [],
      prerequisitesMet: false
    };
  }

  if (doc.id === 'udid-card' && !profile.isDifferentlyAbled && profile.category !== 'PwD') {
    return {
      document: doc,
      isEligible: false,
      matchScore: 10,
      reasons: [],
      prerequisitesMet: false
    };
  }

  reasons.push('Meets basic age and civic residency requirements.');
  return {
    document: doc,
    isEligible: true,
    matchScore: score,
    reasons,
    prerequisitesMet: true
  };
}
