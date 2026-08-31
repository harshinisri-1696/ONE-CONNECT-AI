import {
  BenefitGapReport,
  SectorGapStatus,
  NeedCategory,
  EligibilityProfile,
  FamilyProfile,
  DetectedNeed
} from '../types';
import { SCHEMES_DATABASE } from './schemeDatabase';
import { evaluateSchemeEligibility } from './eligibilityEngine';

interface SectorMeta {
  category: NeedCategory;
  label: string;
  iconName: string;
  defaultDescription: string;
}

const ALL_SECTORS: SectorMeta[] = [
  { category: 'education', label: 'Education & Scholarships', iconName: 'GraduationCap', defaultDescription: 'Tuition support, school and university grants.' },
  { category: 'financial_assistance', label: 'Direct Financial Aid', iconName: 'Banknote', defaultDescription: 'Income transfers, DBT subsidies, and poverty relief.' },
  { category: 'employment', label: 'Employment & Wage Work', iconName: 'Briefcase', defaultDescription: 'Guaranteed rural/urban wage employment and recruitment.' },
  { category: 'skill_development', label: 'Skill Training & Certification', iconName: 'Award', defaultDescription: 'Free technical courses, stipends, and placement.' },
  { category: 'healthcare', label: 'Healthcare & Hospitalization', iconName: 'HeartPulse', defaultDescription: 'Cashless medical insurance and health treatment subsidies.' },
  { category: 'housing', label: 'Housing & Shelter', iconName: 'Home', defaultDescription: 'Pucca house grants, CLSS interest subsidies, and rural shelter.' },
  { category: 'agriculture', label: 'Agriculture & Rural Livelihood', iconName: 'Landmark', defaultDescription: 'Farmer income support, crop insurance, and equipment grants.' },
  { category: 'women_welfare', label: 'Women Welfare & Maternity', iconName: 'HeartHandshake', defaultDescription: 'Maternity cash benefits, widow pensions, and self-help grants.' },
  { category: 'child_welfare', label: 'Child Welfare & Girl Child', iconName: 'Sparkles', defaultDescription: 'Girl child high-interest savings, nutrition, and child safety.' },
  { category: 'senior_citizen_welfare', label: 'Senior Citizen Pensions', iconName: 'Users', defaultDescription: 'Monthly old-age pensions, geriatric healthcare, and assistive aids.' },
  { category: 'disability_support', label: 'Disability & Divyangjan Aid', iconName: 'Accessibility', defaultDescription: 'UDID cards, motorized tricycles, and disability pensions.' },
  { category: 'entrepreneurship', label: 'Micro Enterprise & MSME Loans', iconName: 'Rocket', defaultDescription: 'Collateral-free Mudra credit and startup seed funding.' },
  { category: 'social_security', label: 'Social Security & Insurance', iconName: 'ShieldCheck', defaultDescription: 'Unorganized worker pension, accident cover, and death benefits.' }
];

export function computeBenefitGap(
  profile: EligibilityProfile,
  evaluatedCategories: NeedCategory[] = [],
  family?: FamilyProfile,
  detectedNeeds: DetectedNeed[] = []
): BenefitGapReport {
  const sectors: SectorGapStatus[] = [];
  const evaluatedSet = new Set<NeedCategory>([
    ...evaluatedCategories,
    ...detectedNeeds.map(n => n.category)
  ]);

  // If user profile has specific flags, treat them as partially evaluated
  if (profile.isStudent) evaluatedSet.add('education');
  if (profile.isFarmer) evaluatedSet.add('agriculture');
  if (profile.isSeniorCitizen) evaluatedSet.add('senior_citizen_welfare');
  if (profile.isDifferentlyAbled) evaluatedSet.add('disability_support');

  let checkedCount = 0;
  let unexploredCount = 0;
  let noProgramCount = 0;

  for (const sector of ALL_SECTORS) {
    const matchingSchemes = SCHEMES_DATABASE.filter(s => s.needCategory === sector.category);
    const potentialPrograms = matchingSchemes.map(s => s.shortName);

    // Evaluate eligibility against matching schemes
    let hasEligibleOrAlmost = false;
    for (const scheme of matchingSchemes) {
      const evalResult = evaluateSchemeEligibility(scheme, profile);
      if (evalResult.status === 'eligible' || evalResult.status === 'almost_eligible') {
        hasEligibleOrAlmost = true;
        break;
      }
    }

    let state: 'checked' | 'not_evaluated' | 'no_program_found' = 'not_evaluated';
    let description = '';

    if (evaluatedSet.has(sector.category)) {
      if (hasEligibleOrAlmost) {
        state = 'checked';
        checkedCount++;
        description = 'Profile evaluated with active matching welfare schemes.';
      } else {
        state = 'no_program_found';
        noProgramCount++;
        description = 'Evaluated, but no current central/state program aligns with profile constraints.';
      }
    } else {
      state = 'not_evaluated';
      unexploredCount++;
      description = `Potentially relevant support area (${matchingSchemes.length} available programs). Not yet evaluated in your session.`;
    }

    sectors.push({
      category: sector.category,
      label: sector.label,
      iconName: sector.iconName,
      state,
      matchedSchemesCount: matchingSchemes.length,
      description,
      potentialPrograms: potentialPrograms.slice(0, 3)
    });
  }

  const recommendationsSummary =
    unexploredCount > 0
      ? `You may have potentially relevant support in ${unexploredCount} unexplored welfare areas such as ${sectors
          .filter(s => s.state === 'not_evaluated')
          .slice(0, 3)
          .map(s => s.label)
          .join(', ')}.`
      : 'Comprehensive evaluation across all standard welfare sectors is complete.';

  return {
    totalSectors: ALL_SECTORS.length,
    checkedCount,
    unexploredCount,
    noProgramCount,
    sectors,
    recommendationsSummary
  };
}
