import {
  DetectedNeed,
  EligibilityProfile,
  EligibilityEvaluation,
  FamilyProfile,
  FamilyMember,
  SchemeSynergy,
  ActionPlanTask
} from '../types';
import { SCHEMES_DATABASE, StructuredScheme } from './schemeDatabase';
import { evaluateSchemeEligibility } from './eligibilityEngine';

export interface RankedRecommendation {
  scheme: StructuredScheme;
  evaluation: EligibilityEvaluation;
  matchedNeeds: DetectedNeed[];
  priorityScore: number; // 0 - 100
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  rankingReason: string;
  targetBeneficiary: string;
}

export function rankSchemeRecommendations(
  profile: EligibilityProfile,
  detectedNeeds: DetectedNeed[],
  family?: FamilyProfile,
  userDocuments: string[] = ['Aadhaar Card', 'Bank Passbook']
): {
  recommendations: RankedRecommendation[];
  familyRecommendations: {
    member: FamilyMember;
    topRecommendations: RankedRecommendation[];
  }[];
  synergies: SchemeSynergy[];
} {
  const allRanked: RankedRecommendation[] = [];

  // Build map of category to detected need
  const needMap = new Map<string, DetectedNeed>();
  for (const need of detectedNeeds) {
    needMap.set(need.category, need);
  }

  // 1. Process Individual Profile
  for (const scheme of SCHEMES_DATABASE) {
    const evaluation = evaluateSchemeEligibility(scheme, profile, undefined, userDocuments);

    // Skip if clearly not eligible and no stated need
    const matchedNeed = scheme.needCategory ? needMap.get(scheme.needCategory) : undefined;

    // Calculate intelligent priority score based on:
    // - Eligibility match (40%)
    // - Stated need priority (30%)
    // - Urgency (15%)
    // - Verification Freshness (15%)
    let needMultiplier = 0.5;
    if (matchedNeed) {
      needMultiplier = matchedNeed.priority === 'high' ? 1.0 : matchedNeed.priority === 'medium' ? 0.8 : 0.6;
    }

    const eligibilityWeight = evaluation.matchScore * 0.45;
    const needWeight = (matchedNeed ? (matchedNeed.priority === 'high' ? 100 : matchedNeed.priority === 'medium' ? 75 : 50) : 30) * 0.30;
    const freshnessWeight = scheme.verification_status === 'recently_verified' ? 15 : scheme.verification_status === 'verification_due' ? 10 : 5;
    const stateBonus = (profile.state && scheme.eligibleStates?.includes(profile.state)) ? 10 : 5;

    let priorityScore = Math.round(eligibilityWeight + needWeight + freshnessWeight + stateBonus);
    priorityScore = Math.min(99, Math.max(15, priorityScore));

    const urgencyLevel =
      matchedNeed?.priority === 'high' && evaluation.status === 'eligible'
        ? 'critical'
        : evaluation.status === 'eligible' || (evaluation.status === 'almost_eligible' && matchedNeed)
        ? 'high'
        : 'medium';

    let rankingReason = '';
    if (matchedNeed && evaluation.status === 'eligible') {
      rankingReason = `Directly matches your stated need for ${matchedNeed.label} with 100% criteria fulfillment.`;
    } else if (matchedNeed && evaluation.status === 'almost_eligible') {
      rankingReason = `High relevance to your need (${matchedNeed.label}) with ${evaluation.matchedCount} of ${evaluation.totalCriteriaCount} criteria met.`;
    } else if (evaluation.status === 'eligible') {
      rankingReason = `You satisfy all eligibility criteria based on your citizen profile.`;
    } else {
      rankingReason = `General welfare benefit with ${evaluation.matchScore}% qualification overlap.`;
    }

    // Only include schemes with at least some relevance
    if (evaluation.status === 'eligible' || evaluation.status === 'almost_eligible' || matchedNeed) {
      allRanked.push({
        scheme,
        evaluation,
        matchedNeeds: matchedNeed ? [matchedNeed] : [],
        priorityScore,
        urgencyLevel,
        rankingReason,
        targetBeneficiary: profile.name || 'Self'
      });
    }
  }

  // Sort by priorityScore descending
  allRanked.sort((a, b) => b.priorityScore - a.priorityScore);

  // 2. Process Family Profile if members exist
  const familyRecommendations: {
    member: FamilyMember;
    topRecommendations: RankedRecommendation[];
  }[] = [];

  if (family && family.members.length > 0) {
    for (const member of family.members) {
      const memberRanked: RankedRecommendation[] = [];

      for (const scheme of SCHEMES_DATABASE) {
        const evaluation = evaluateSchemeEligibility(scheme, profile, member, userDocuments);
        const memberNeeds = member.needs || [];
        const matchedNeed = scheme.needCategory && memberNeeds.includes(scheme.needCategory)
          ? {
              category: scheme.needCategory,
              label: scheme.category,
              priority: 'high' as const,
              reasoning: `Matched family member role: ${member.relationship}`,
              keywords: [member.relationship.toLowerCase()],
              confidence: 0.9
            }
          : scheme.needCategory ? needMap.get(scheme.needCategory) : undefined;

        if (evaluation.status === 'eligible' || evaluation.status === 'almost_eligible' || matchedNeed) {
          const score = Math.round(evaluation.matchScore * 0.6 + (matchedNeed ? 35 : 15));
          memberRanked.push({
            scheme,
            evaluation,
            matchedNeeds: matchedNeed ? [matchedNeed] : [],
            priorityScore: Math.min(98, score),
            urgencyLevel: evaluation.status === 'eligible' ? 'high' : 'medium',
            rankingReason: `Personalized for ${member.name} (${member.relationship}) based on age ${member.age} and status.`,
            targetBeneficiary: `${member.name} (${member.relationship})`
          });
        }
      }

      memberRanked.sort((a, b) => b.priorityScore - a.priorityScore);
      familyRecommendations.push({
        member,
        topRecommendations: memberRanked.slice(0, 3)
      });
    }
  }

  // 3. Compute Scheme Combination Analysis (Synergies)
  const synergies = generateSchemeSynergies(allRanked.slice(0, 6));

  return {
    recommendations: allRanked,
    familyRecommendations,
    synergies
  };
}

function generateSchemeSynergies(recommendations: RankedRecommendation[]): SchemeSynergy[] {
  const synergies: SchemeSynergy[] = [];
  if (recommendations.length < 2) return synergies;

  const topSchemes = recommendations.map(r => r.scheme);

  // Group by distinct categories
  const categoriesPresent = new Set(topSchemes.map(s => s.needCategory));

  if (categoriesPresent.has('education') && categoriesPresent.has('skill_development')) {
    synergies.push({
      schemeIds: topSchemes.filter(s => s.needCategory === 'education' || s.needCategory === 'skill_development').map(s => s.id),
      schemeNames: topSchemes.filter(s => s.needCategory === 'education' || s.needCategory === 'skill_development').map(s => s.shortName),
      synergyType: 'sequential',
      summary: 'Academic scholarship can be combined with vocational skill certification during semester breaks or post-graduation.',
      combinedBenefits: 'Financial scholarship for tuition + free industry certification & stipend.',
      compatibilityNote: 'These programs address different support areas. Simultaneous enrollment in regular courses and short-term PMKVY certifications is permitted per official guidelines.',
      verifiedCombination: true
    });
  }

  if (categoriesPresent.has('healthcare') && categoriesPresent.has('financial_assistance')) {
    synergies.push({
      schemeIds: topSchemes.filter(s => s.needCategory === 'healthcare' || s.needCategory === 'agriculture').map(s => s.id),
      schemeNames: topSchemes.filter(s => s.needCategory === 'healthcare' || s.needCategory === 'agriculture').map(s => s.shortName),
      synergyType: 'complementary',
      summary: 'Health protection (PM-JAY) and direct livelihood income transfers (PM-KISAN) operate independently.',
      combinedBenefits: '₹5,00,000 family medical protection + ₹6,000/year direct cash support.',
      compatibilityNote: 'These programs operate under distinct ministries and do not conflict. Both benefits can be availed simultaneously by eligible households.',
      verifiedCombination: true
    });
  }

  if (categoriesPresent.size >= 3) {
    synergies.push({
      schemeIds: topSchemes.slice(0, 3).map(s => s.id),
      schemeNames: topSchemes.slice(0, 3).map(s => s.shortName),
      synergyType: 'independent',
      summary: 'Multi-sector support covering education, livelihood, and social security.',
      combinedBenefits: 'Holistic household risk protection and educational enablement.',
      compatibilityNote: 'Compatibility between multiple concurrent subsidy programs should be verified via respective official portals before final submission.',
      verifiedCombination: false
    });
  }

  return synergies;
}
