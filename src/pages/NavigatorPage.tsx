import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { detectNeedsFromText } from '../server/needDetector';
import { rankSchemeRecommendations, RankedRecommendation } from '../server/recommendationEngine';
import { computeBenefitGap } from '../server/benefitGapEngine';
import { DocumentReadinessModal } from '../components/DocumentReadinessModal';
import { DetectedNeed, SchemeSynergy, BenefitGapReport } from '../types';

const SAMPLE_SCENARIOS = [
  {
    title: 'Student & Unemployed Household',
    prompt: 'My father lost his job and I am struggling to pay my college fees.'
  },
  {
    title: 'Small Farmer & Health Cover',
    prompt: 'I am a marginal farmer with 2 acres of land and need financial support for fertilizers and medical cover for my family.'
  },
  {
    title: 'Women Micro-Enterprise',
    prompt: 'I am a woman seeking a collateral-free loan to start a home tailoring and embroidery business.'
  },
  {
    title: 'Elderly Grandparent Care',
    prompt: 'My 72-year-old grandfather needs an old age pension and free hospitalization treatment cover.'
  }
];

export const NavigatorPage: React.FC = () => {
  const {
    profile,
    familyProfile,
    actionPlanTasks,
    addTaskToActionPlan,
    detectedNeedsHistory,
    setDetectedNeedsHistory,
    userDocumentsChecklist,
    setActiveTab,
    t
  } = useApp();

  const [inputQuery, setInputQuery] = useState(
    'My father lost his job and I am struggling to pay my college fees.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedNeeds, setDetectedNeeds] = useState<DetectedNeed[]>(detectedNeedsHistory);
  const [recommendations, setRecommendations] = useState<RankedRecommendation[]>([]);
  const [synergies, setSynergies] = useState<SchemeSynergy[]>([]);
  const [gapReport, setGapReport] = useState<BenefitGapReport | null>(null);
  const [activeReadinessModal, setActiveReadinessModal] = useState<{ id: number | string; name: string } | null>(null);
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);

  // Run initial analysis on mount
  useEffect(() => {
    runAnalysis(inputQuery);
  }, []);

  const runAnalysis = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAnalyzing(true);

    try {
      // 1. Need Detection
      const needResult = detectNeedsFromText(queryText);
      setDetectedNeeds(needResult.needs);
      setDetectedNeedsHistory(needResult.needs);

      // 2. Recommendation & Ranking
      const userDocs = Object.entries(userDocumentsChecklist)
        .filter(([_, status]) => status === 'available')
        .map(([name]) => name);

      const recResult = rankSchemeRecommendations(
        profile,
        needResult.needs,
        familyProfile,
        userDocs.length > 0 ? userDocs : ['Aadhaar Card', 'Bank Passbook']
      );
      setRecommendations(recResult.recommendations);
      setSynergies(recResult.synergies);

      // 3. Benefit Gap Analysis
      const evaluatedCategories = needResult.needs.map(n => n.category);
      const gap = computeBenefitGap(profile, evaluatedCategories, familyProfile, needResult.needs);
      setGapReport(gap);
    } catch (err) {
      console.error('Error during navigator analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToActionPlan = (rec: RankedRecommendation) => {
    const taskId = `task-plan-${rec.scheme.id}`;
    addTaskToActionPlan({
      id: taskId,
      schemeId: rec.scheme.id,
      schemeName: rec.scheme.name,
      title: `Apply for ${rec.scheme.shortName}`,
      category: 'immediate',
      priority: rec.urgencyLevel,
      matchPercentage: rec.priorityScore,
      whyMatch: rec.evaluation.decisionFactors,
      missingRequirement: rec.evaluation.missingCriteria.map(c => c.name).join(', '),
      nextAction: rec.evaluation.actionGuidance,
      status: 'not_started',
      officialUrl: rec.scheme.official_url,
      officialSource: rec.scheme.official_source,
      assignedMember: rec.targetBeneficiary,
      createdAt: new Date().toISOString()
    });

    setAddedTaskId(taskId);
    setTimeout(() => setAddedTaskId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            AI-Powered Citizen Benefit Navigator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Describe Your Situation. <br className="hidden sm:inline" />
            Discover Every Government Benefit You Qualify For.
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Move beyond manual scheme searching. Our intelligence layer analyzes your family circumstances, identifies multiple welfare needs, evaluates eligibility transparently, and builds your personalized action plan.
          </p>
        </div>
      </div>

      {/* Query Input Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="situation-input" className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            Tell us about your household or personal situation:
          </label>
          <span className="text-xs text-slate-400">Supports English, हिन्दी, தமிழ், and other Indian languages</span>
        </div>

        <div className="relative">
          <textarea
            id="situation-input"
            rows={3}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="e.g. My father lost his job and I am struggling to pay my college fees..."
            className="w-full p-4 pr-28 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none shadow-inner"
          />
          <button
            onClick={() => runAnalysis(inputQuery)}
            disabled={isAnalyzing || !inputQuery.trim()}
            className="absolute right-3 bottom-3.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Analyze Needs
              </>
            )}
          </button>
        </div>

        {/* Preset Scenarios */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-500 mb-2">Try a real Indian citizen scenario:</div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SCENARIOS.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputQuery(scenario.prompt);
                  runAnalysis(scenario.prompt);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 text-xs rounded-lg font-medium transition-all text-left"
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Innovation 1: Multi-Need Detection Output */}
      {detectedNeeds.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Identified Welfare Support Areas ({detectedNeeds.length})
            </h2>
            <span className="text-xs text-slate-500">Multi-intent semantic inference</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detectedNeeds.map((need, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {need.category.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      need.priority === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : need.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {need.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm">{need.label}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{need.reasoning}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Confidence: {Math.round(need.confidence * 100)}%</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Keywords: {need.keywords.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Innovation 2 & 4: Ranked Recommendations & Transparent Almost-Eligible Engine */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Prioritized Government Scheme Recommendations ({recommendations.length})
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by need relevance, criteria fulfillment, and official scheme freshness.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('action_plan')}
            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            View Full Action Plan ({actionPlanTasks.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => {
            const isEligible = rec.evaluation.status === 'eligible';
            const isAlmost = rec.evaluation.status === 'almost_eligible';

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {rec.scheme.level} Govt
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {rec.scheme.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          Beneficiary: <strong className="text-slate-700">{rec.targetBeneficiary}</strong>
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        {rec.scheme.name}
                      </h3>
                    </div>

                    {/* Score Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="text-xl font-extrabold text-blue-600">
                        {rec.priorityScore}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Match Score
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                      isEligible
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isAlmost
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isEligible ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                      <span>
                        {isEligible ? '🟢 Eligible (100% Criteria Satisfied)' : '🟡 Almost Eligible'}
                      </span>
                    </div>
                    <span className="text-[11px] font-normal">
                      {rec.evaluation.matchedCount} of {rec.evaluation.totalCriteriaCount} criteria met
                    </span>
                  </div>

                  {/* Key Benefits */}
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">Key Benefit:</strong> {rec.scheme.benefits}
                  </div>

                  {/* Transparent Why This Scheme Decision Factors */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      Why this scheme matches your profile:
                    </div>
                    <ul className="space-y-1">
                      {rec.evaluation.decisionFactors.map((factor, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing criteria if almost eligible */}
                  {isAlmost && rec.evaluation.missingCriteria.length > 0 && (
                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1 text-xs text-amber-900">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Missing Requirement / Guidance:
                      </div>
                      <p>{rec.evaluation.actionGuidance}</p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Official Source: {rec.scheme.official_source}
                    </span>
                    <span>Verified: {rec.scheme.last_verified}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveReadinessModal({ id: rec.scheme.id, name: rec.scheme.name })}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      Check Documents
                    </button>

                    <button
                      onClick={() => handleAddToActionPlan(rec)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                        addedTaskId === `task-plan-${rec.scheme.id}`
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      {addedTaskId === `task-plan-${rec.scheme.id}` ? '✓ Added to Plan' : 'Add to Action Plan'}
                    </button>

                    <a
                      href={rec.scheme.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      Official Portal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Innovation 8: Scheme Combination & Synergy Analysis */}
      {synergies.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Related Support & Scheme Combination Analysis
            </h2>
            <span className="text-xs text-indigo-700 font-semibold">
              Cross-Ministry Welfare Synergy
            </span>
          </div>

          <p className="text-xs text-indigo-900/80">
            These programs address different support areas (e.g. Education + Skill Development). Review verified simultaneous enrollment rules below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synergies.map((synergy, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-indigo-100 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2">
                  {synergy.schemeNames.map((name, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold"
                    >
                      {name}
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {synergy.verifiedCombination ? '✓ Verified Combination' : 'Conditional'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900">{synergy.summary}</div>
                <div className="text-xs text-slate-600">
                  <strong>Combined Benefit:</strong> {synergy.combinedBenefits}
                </div>
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {synergy.compatibilityNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Innovation 3: Benefit Gap Analysis */}
      {gapReport && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                Comprehensive Welfare Sector Gap Analysis (13 Sectors)
              </h2>
              <p className="text-xs text-slate-500">
                Identify potentially relevant support areas that have not yet been evaluated for your household.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {gapReport.checkedCount} Checked
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> {gapReport.unexploredCount} Unexplored
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Gap Summary:</strong> {gapReport.recommendationsSummary}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {gapReport.sectors.map((sector, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  sector.state === 'checked'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : sector.state === 'not_evaluated'
                    ? 'bg-amber-50/30 border-amber-200 hover:border-amber-300'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{sector.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      sector.state === 'checked'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sector.state === 'not_evaluated'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sector.state === 'checked' ? '✓ Checked' : sector.state === 'not_evaluated' ? '? Not Evaluated' : '✗ No Program'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2.5 line-clamp-2">{sector.description}</p>

                {sector.potentialPrograms.length > 0 && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 flex-wrap">
                    <span className="font-semibold text-slate-700">Available Schemes:</span>
                    {sector.potentialPrograms.map((prog, pIdx) => (
                      <span key={pIdx} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                        {prog}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Readiness Modal Trigger */}
      {activeReadinessModal && (
        <DocumentReadinessModal
          schemeId={activeReadinessModal.id}
          schemeName={activeReadinessModal.name}
          isOpen={true}
          onClose={() => setActiveReadinessModal(null)}
        />
      )}
    </div>
  );
};
