import {
  ActionPlanTask,
  EligibilityProfile,
  FamilyProfile,
  DetectedNeed
} from '../types';
import { rankSchemeRecommendations } from './recommendationEngine';

export function generatePersonalizedActionPlan(
  profile: EligibilityProfile,
  detectedNeeds: DetectedNeed[],
  family?: FamilyProfile,
  userDocuments: string[] = ['Aadhaar Card', 'Bank Passbook']
): {
  immediateActions: ActionPlanTask[];
  recommendedServices: ActionPlanTask[];
  missingDocuments: ActionPlanTask[];
  upcomingDeadlines: ActionPlanTask[];
  summary: string;
} {
  const { recommendations, familyRecommendations } = rankSchemeRecommendations(
    profile,
    detectedNeeds,
    family,
    userDocuments
  );

  const immediateActions: ActionPlanTask[] = [];
  const recommendedServices: ActionPlanTask[] = [];
  const missingDocuments: ActionPlanTask[] = [];
  const upcomingDeadlines: ActionPlanTask[] = [];

  const topThree = recommendations.slice(0, 4);

  topThree.forEach((rec, idx) => {
    const priority = idx === 0 ? 'critical' : idx === 1 ? 'high' : 'medium';

    // 1. Immediate Service Task
    immediateActions.push({
      id: `task-imm-${rec.scheme.id}`,
      schemeId: rec.scheme.id,
      schemeName: rec.scheme.name,
      title: `Apply for ${rec.scheme.shortName}`,
      category: 'immediate',
      priority,
      matchPercentage: rec.priorityScore,
      whyMatch: rec.evaluation.decisionFactors.slice(0, 3),
      missingRequirement: rec.evaluation.missingCriteria.length > 0 ? rec.evaluation.missingCriteria.map(c => c.name).join(', ') : undefined,
      nextAction: rec.evaluation.status === 'eligible'
        ? `Submit online application via official portal (${rec.scheme.official_source})`
        : `Verify required certification or qualification details for ${rec.scheme.shortName}`,
      status: 'not_started',
      officialUrl: rec.scheme.official_url,
      officialSource: rec.scheme.official_source,
      assignedMember: rec.targetBeneficiary,
      createdAt: new Date().toISOString()
    });

    // 2. Missing Document Task if any
    if (rec.evaluation.missingDocuments.length > 0) {
      const topMissingDoc = rec.evaluation.missingDocuments[0];
      missingDocuments.push({
        id: `task-doc-${rec.scheme.id}-${topMissingDoc.replace(/\s+/g, '-').toLowerCase()}`,
        schemeId: rec.scheme.id,
        schemeName: rec.scheme.name,
        title: `Procure ${topMissingDoc}`,
        category: 'document',
        priority: 'high',
        matchPercentage: rec.evaluation.matchScore,
        whyMatch: [`Mandatory requirement for ${rec.scheme.shortName}`],
        nextAction: `Obtain official attested ${topMissingDoc} from e-District or local Tehsildar office.`,
        status: 'not_started',
        officialUrl: rec.scheme.official_url,
        officialSource: rec.scheme.official_source,
        assignedMember: rec.targetBeneficiary,
        createdAt: new Date().toISOString()
      });
    }

    // 3. Recommended Service Exploration
    recommendedServices.push({
      id: `task-srv-${rec.scheme.id}`,
      schemeId: rec.scheme.id,
      schemeName: rec.scheme.name,
      title: `Explore ${rec.scheme.category} Benefits`,
      category: 'service',
      priority: 'medium',
      matchPercentage: rec.priorityScore,
      whyMatch: [rec.rankingReason],
      nextAction: `Review official guideline brochure and citizen entitlement criteria.`,
      status: 'not_started',
      officialUrl: rec.scheme.official_url,
      officialSource: rec.scheme.official_source,
      assignedMember: rec.targetBeneficiary,
      createdAt: new Date().toISOString()
    });
  });

  // Add standard upcoming cycle deadlines for major portals
  upcomingDeadlines.push({
    id: 'deadline-nsp-scholarship',
    schemeId: 9905,
    schemeName: 'National Scholarship Portal (NSP)',
    title: 'Academic Session Scholarship Verification Cycle',
    category: 'deadline',
    priority: 'high',
    nextAction: 'Ensure Institute Nodal Officer (INO) level document scrutiny is completed before portal cutoff.',
    status: 'in_progress',
    deadlineDate: '2026-10-31',
    officialUrl: 'https://scholarships.gov.in',
    officialSource: 'National Scholarship Portal',
    createdAt: new Date().toISOString()
  });

  upcomingDeadlines.push({
    id: 'deadline-pmkisan-ekyc',
    schemeId: 9901,
    schemeName: 'PM-KISAN e-KYC Verification',
    title: 'Mandatory Aadhaar-OTP Biometric e-KYC Update',
    category: 'deadline',
    priority: 'medium',
    nextAction: 'Complete OTP or biometric e-KYC at nearest CSC for uninterrupted DBT installment credit.',
    status: 'not_started',
    deadlineDate: '2026-09-30',
    officialUrl: 'https://pmkisan.gov.in',
    officialSource: 'PM-KISAN Portal',
    createdAt: new Date().toISOString()
  });

  // Include family tasks if any
  familyRecommendations.forEach(fRec => {
    if (fRec.topRecommendations.length > 0) {
      const top = fRec.topRecommendations[0];
      recommendedServices.push({
        id: `task-fam-${fRec.member.id}-${top.scheme.id}`,
        schemeId: top.scheme.id,
        schemeName: top.scheme.name,
        title: `${top.scheme.shortName} for ${fRec.member.name} (${fRec.member.relationship})`,
        category: 'service',
        priority: 'high',
        matchPercentage: top.priorityScore,
        whyMatch: [top.rankingReason],
        nextAction: `Initiate enrollment for family member (${fRec.member.name}).`,
        status: 'not_started',
        officialUrl: top.scheme.official_url,
        officialSource: top.scheme.official_source,
        assignedMember: `${fRec.member.name} (${fRec.member.relationship})`,
        createdAt: new Date().toISOString()
      });
    }
  });

  const summary = `Generated a personalized 4-stage action plan tailored to ${profile.name || 'Citizen'} targeting ${topThree.map(t => t.scheme.shortName).join(', ')}.`;

  return {
    immediateActions,
    recommendedServices,
    missingDocuments,
    upcomingDeadlines,
    summary
  };
}
