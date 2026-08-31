import {
  EligibilityProfile,
  EligibilityEvaluation,
  EligibilityCriterion,
  FamilyMember,
  FamilyProfile
} from '../types';
import { SCHEMES_DATABASE, StructuredScheme } from './schemeDatabase';

export function evaluateSchemeEligibility(
  scheme: StructuredScheme,
  profile: EligibilityProfile,
  member?: FamilyMember,
  userDocuments: string[] = ['Aadhaar Card', 'Bank Passbook']
): EligibilityEvaluation {
  const criteria: EligibilityCriterion[] = [];
  const decisionFactors: string[] = [];

  // Determine age & gender & income to evaluate (use member if provided, else profile)
  const age = member ? member.age : profile.age;
  const gender = member ? member.gender : profile.gender;
  const income = member ? (member.income || profile.annualIncome) : profile.annualIncome;
  const occupation = member ? member.occupation : profile.employmentStatus;
  const specialConditions = member ? (member.specialConditions || []) : [];
  const state = profile.state || 'National';

  // 1. Age Criteria
  const minAge = scheme.minAge ?? 0;
  const maxAge = scheme.maxAge ?? 100;
  const ageSatisfied = age >= minAge && age <= maxAge;
  criteria.push({
    id: 'age',
    name: 'Age Requirement',
    description: `Eligible age is between ${minAge} and ${maxAge} years.`,
    satisfied: ageSatisfied,
    citizenValue: `${age} years`,
    requiredValue: `${minAge} - ${maxAge} years`,
    actionAdvice: ageSatisfied
      ? undefined
      : age < minAge
      ? `Applicant is ${age} years old, which is below the minimum age of ${minAge}.`
      : `Applicant is ${age} years old, which is above the maximum age of ${maxAge}.`
  });
  if (ageSatisfied) {
    decisionFactors.push(`Age ${age} is within the eligible age window (${minAge}-${maxAge} years).`);
  }

  // 2. State / Location Criteria
  const stateSatisfied =
    !scheme.eligibleStates ||
    scheme.eligibleStates.length === 0 ||
    scheme.eligibleStates.includes('National') ||
    scheme.eligibleStates.includes('All States') ||
    scheme.eligibleStates.includes(state) ||
    state === 'National / All States' ||
    state === 'National';

  criteria.push({
    id: 'state',
    name: 'State & Territory Eligibility',
    description: `Available in ${scheme.level} tier across participating states.`,
    satisfied: stateSatisfied,
    citizenValue: state,
    requiredValue: scheme.eligibleStates ? scheme.eligibleStates.join(', ') : 'All States / Pan-India',
    actionAdvice: stateSatisfied
      ? undefined
      : `Currently notified for citizens residing in ${scheme.eligibleStates?.join(', ')}.`
  });
  if (stateSatisfied) {
    decisionFactors.push(`Location matches valid administrative coverage (${scheme.level}).`);
  }

  // 3. Gender Requirement
  const genderSatisfied =
    !scheme.targetGender ||
    scheme.targetGender === 'All' ||
    gender === 'All' ||
    scheme.targetGender === gender;

  criteria.push({
    id: 'gender',
    name: 'Target Beneficiary Gender',
    description: scheme.targetGender === 'Female' ? 'Exclusively for female beneficiaries' : 'Open to all genders',
    satisfied: genderSatisfied,
    citizenValue: gender,
    requiredValue: scheme.targetGender || 'All',
    actionAdvice: genderSatisfied
      ? undefined
      : `This program specifically targets ${scheme.targetGender} beneficiaries.`
  });
  if (genderSatisfied && scheme.targetGender && scheme.targetGender !== 'All') {
    decisionFactors.push(`Gender requirement (${scheme.targetGender}) is satisfied.`);
  }

  // 4. Occupational / Special Condition Requirement
  let occupationSatisfied = true;
  let occExplanation = 'General eligibility or open occupation';
  let occAdvice: string | undefined = undefined;

  if (scheme.requiredConditions && scheme.requiredConditions.length > 0) {
    const isStudent =
      profile.isStudent ||
      specialConditions.includes('Student') ||
      occupation.toLowerCase().includes('student') ||
      profile.employmentStatus === 'Student';

    const isFarmer =
      profile.isFarmer ||
      specialConditions.includes('Farmer') ||
      occupation.toLowerCase().includes('farmer') ||
      profile.employmentStatus === 'Farmer';

    const isSenior =
      profile.isSeniorCitizen ||
      specialConditions.includes('Senior Citizen') ||
      age >= 60;

    const isDisability =
      profile.isDifferentlyAbled ||
      specialConditions.includes('Disabled') ||
      specialConditions.includes('Differently Abled');

    const isUnemployed =
      profile.employmentStatus === 'Unemployed' ||
      specialConditions.includes('Unemployed') ||
      occupation.toLowerCase().includes('unemployed');

    const isWidow = specialConditions.includes('Widow');
    const isArtisan = specialConditions.includes('Artisan') || occupation.toLowerCase().includes('artisan');
    const isEntrepreneur = specialConditions.includes('Entrepreneur') || occupation.toLowerCase().includes('business');

    let matchedCond = false;
    for (const cond of scheme.requiredConditions) {
      if (cond === 'Student' && isStudent) matchedCond = true;
      if (cond === 'Farmer' && isFarmer) matchedCond = true;
      if (cond === 'Senior Citizen' && isSenior) matchedCond = true;
      if (cond === 'Differently Abled' && isDisability) matchedCond = true;
      if (cond === 'Unemployed' && isUnemployed) matchedCond = true;
      if (cond === 'Widow' && isWidow) matchedCond = true;
      if (cond === 'Artisan / Craftsperson' && isArtisan) matchedCond = true;
      if (cond === 'Entrepreneur' && isEntrepreneur) matchedCond = true;
      if (cond === 'Low Income / BPL' && (profile.hasBPLCard || income <= 300000)) matchedCond = true;
      if (cond === 'Girl Child < 10 Years' && gender === 'Female' && age <= 10) matchedCond = true;
      if (cond === 'Pregnant / Lactating Mother' && gender === 'Female' && (specialConditions.includes('Pregnant') || age >= 19)) matchedCond = true;
      if (cond === 'Seeking Skills' || cond === 'Healthcare Need') matchedCond = true;
      if (cond === 'Homeless / Kutcha House') matchedCond = true;
    }

    occupationSatisfied = matchedCond;
    occExplanation = `Targeted category: ${scheme.requiredConditions.join(', ')}`;
    if (!occupationSatisfied) {
      occAdvice = `Targeted for beneficiaries with status: ${scheme.requiredConditions.join(' / ')}. Current status is ${occupation}.`;
    }
  }

  criteria.push({
    id: 'occupation_status',
    name: 'Beneficiary Category & Status',
    description: occExplanation,
    satisfied: occupationSatisfied,
    citizenValue: occupation || 'General Citizen',
    requiredValue: scheme.requiredConditions ? scheme.requiredConditions.join(' / ') : 'General',
    actionAdvice: occAdvice
  });
  if (occupationSatisfied) {
    decisionFactors.push(`Beneficiary category matches program profile.`);
  }

  // 5. Income Threshold Criteria
  let incomeSatisfied = true;
  let incomeAdvice: string | undefined = undefined;

  if (scheme.maxIncome && scheme.maxIncome < 5000000) {
    incomeSatisfied = income <= scheme.maxIncome || (profile.hasBPLCard && scheme.maxIncome >= 120000);
    if (!incomeSatisfied) {
      incomeAdvice = `Family income (₹${income.toLocaleString('en-IN')}) exceeds the listed threshold of ₹${scheme.maxIncome.toLocaleString('en-IN')}. Verify if valid EWS or BPL certification applies.`;
    }
  }

  criteria.push({
    id: 'income',
    name: 'Annual Household Income Limit',
    description: `Income ceiling: ₹${scheme.maxIncome ? scheme.maxIncome.toLocaleString('en-IN') : 'No strict limit'} per annum.`,
    satisfied: incomeSatisfied,
    citizenValue: `₹${income.toLocaleString('en-IN')}/year`,
    requiredValue: `Up to ₹${scheme.maxIncome ? scheme.maxIncome.toLocaleString('en-IN') : 'Open'}`,
    actionAdvice: incomeAdvice
  });
  if (incomeSatisfied) {
    decisionFactors.push(`Income (₹${income.toLocaleString('en-IN')}) is within the threshold.`);
  }

  // 6. Required Documents Check
  const requiredDocs = Array.isArray(scheme.documents) ? scheme.documents : [scheme.documents];
  const missingDocs = requiredDocs.filter(
    reqDoc => !userDocuments.some(userDoc => userDoc.toLowerCase().includes(reqDoc.toLowerCase()) || reqDoc.toLowerCase().includes(userDoc.toLowerCase()))
  );

  const matchedCriteria = criteria.filter(c => c.satisfied);
  const missingCriteria = criteria.filter(c => !c.satisfied);
  const totalCount = criteria.length;
  const matchedCount = matchedCriteria.length;

  // Evaluation status logic:
  // - If all 5 criteria are satisfied: ELIGIBLE (matchScore >= 90)
  // - If satisfied >= 3 out of 5 (e.g. 4/5 or 3/5 with minor gap like income certificate or document missing): ALMOST ELIGIBLE
  // - Otherwise: NOT ELIGIBLE
  let status: 'eligible' | 'almost_eligible' | 'not_eligible' = 'not_eligible';
  let matchScore = Math.round((matchedCount / totalCount) * 100);

  if (matchedCount === totalCount) {
    status = 'eligible';
    matchScore = Math.max(90, matchScore);
  } else if (matchedCount >= totalCount - 2 && (ageSatisfied || occupationSatisfied)) {
    status = 'almost_eligible';
    matchScore = Math.min(88, Math.max(65, matchScore));
  } else {
    status = 'not_eligible';
    matchScore = Math.min(50, matchScore);
  }

  // Action guidance generation
  let actionGuidance = '';
  if (status === 'eligible') {
    actionGuidance = `You meet all ${totalCount} identified criteria. Proceed to gather required documents and submit via the official portal (${scheme.official_source}).`;
  } else if (status === 'almost_eligible') {
    const missingNames = missingCriteria.map(m => m.name).join(', ');
    actionGuidance = `You satisfy ${matchedCount} of ${totalCount} known criteria. Review missing requirement (${missingNames}) or check if official relaxation/exemptions apply.`;
  } else {
    actionGuidance = `Key qualifications do not align with current criteria. Review alternative schemes in the catalog.`;
  }

  const explanation =
    status === 'eligible'
      ? `Full match on age (${age} yrs), location (${state}), category, and income limits.`
      : status === 'almost_eligible'
      ? `Satisfies ${matchedCount} of ${totalCount} key parameters. Missing requirement: ${missingCriteria.map(c => c.name).join(', ')}.`
      : `Does not currently meet primary qualification requirements for this specific central/state scheme.`;

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    category: scheme.category,
    status,
    matchScore,
    matchedCount,
    totalCriteriaCount: totalCount,
    matchedCriteria,
    missingCriteria,
    missingDocuments: missingDocs,
    explanation,
    decisionFactors,
    actionGuidance,
    targetMemberId: member?.id,
    targetMemberName: member?.name,
    officialUrl: scheme.official_url,
    officialSource: scheme.official_source,
    lastVerified: scheme.last_verified,
    verificationStatus: scheme.verification_status
  };
}

export function evaluateAllSchemes(
  profile: EligibilityProfile,
  family?: FamilyProfile,
  userDocuments: string[] = ['Aadhaar Card', 'Bank Passbook']
): {
  individualEvaluations: EligibilityEvaluation[];
  familyEvaluations: { member: FamilyMember; evaluations: EligibilityEvaluation[] }[];
} {
  const individualEvaluations = SCHEMES_DATABASE.map(scheme =>
    evaluateSchemeEligibility(scheme, profile, undefined, userDocuments)
  );

  const familyEvaluations = (family?.members || []).map(member => ({
    member,
    evaluations: SCHEMES_DATABASE.map(scheme =>
      evaluateSchemeEligibility(scheme, profile, member, userDocuments)
    )
  }));

  return {
    individualEvaluations,
    familyEvaluations
  };
}
