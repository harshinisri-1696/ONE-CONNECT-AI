import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import { detectNeedsFromText } from './src/server/needDetector';
import { SCHEMES_DATABASE } from './src/server/schemeDatabase';
import { evaluateSchemeEligibility, evaluateAllSchemes } from './src/server/eligibilityEngine';
import { rankSchemeRecommendations } from './src/server/recommendationEngine';
import { computeBenefitGap } from './src/server/benefitGapEngine';
import { evaluateDocumentReadiness } from './src/server/documentReadinessEngine';
import { generatePersonalizedActionPlan } from './src/server/actionPlanEngine';

dotenv.config();

let genAiClient: any = null;

function getGeminiClient() {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = require('@google/genai');
      genAiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('GoogleGenAI initialization warning:', e);
    }
  }
  return genAiClient;
}

// In-memory runtime cache for admin overrides and verification dates
const schemeOverrides: Record<string, { last_verified?: string; official_url?: string; verification_status?: any }> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CitizenConnect AI Benefit Navigator',
      timestamp: new Date().toISOString()
    });
  });

  // API 2: Need Detection (POST /api/needs/analyze)
  app.post('/api/needs/analyze', (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text prompt is required' });
      }
      const result = detectNeedsFromText(text);
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/needs/analyze:', err);
      return res.status(500).json({ error: 'Failed to analyze needs', details: err?.message });
    }
  });

  // API 3: Eligibility Check (POST /api/eligibility/check)
  app.post('/api/eligibility/check', (req, res) => {
    try {
      const { schemeId, profile, member, userDocuments } = req.body;
      const targetScheme = SCHEMES_DATABASE.find(s => String(s.id) === String(schemeId));

      if (!targetScheme) {
        return res.status(404).json({ error: 'Scheme not found' });
      }

      const defaultProfile = profile || {
        age: 24,
        gender: 'All',
        employmentStatus: 'Unemployed',
        annualIncome: 180000,
        state: 'National',
        isStudent: false,
        isFarmer: false,
        isSeniorCitizen: false,
        isDifferentlyAbled: false,
        hasBPLCard: false
      };

      const evaluation = evaluateSchemeEligibility(
        targetScheme,
        defaultProfile,
        member,
        userDocuments || ['Aadhaar Card', 'Bank Passbook']
      );

      return res.json({ evaluation });
    } catch (err: any) {
      console.error('Error in /api/eligibility/check:', err);
      return res.status(500).json({ error: 'Failed to evaluate eligibility', details: err?.message });
    }
  });

  // API 4: Scheme Recommendations (POST /api/recommendations)
  app.post('/api/recommendations', (req, res) => {
    try {
      const { profile, detectedNeeds, family, userDocuments } = req.body;
      const defaultProfile = profile || {
        name: 'Aarav Sharma',
        age: 24,
        gender: 'All',
        employmentStatus: 'Unemployed',
        annualIncome: 180000,
        state: 'National',
        isStudent: false,
        isFarmer: false,
        isSeniorCitizen: false,
        isDifferentlyAbled: false,
        hasBPLCard: false
      };

      const result = rankSchemeRecommendations(
        defaultProfile,
        detectedNeeds || [],
        family,
        userDocuments || ['Aadhaar Card', 'Bank Passbook']
      );

      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/recommendations:', err);
      return res.status(500).json({ error: 'Failed to compute recommendations', details: err?.message });
    }
  });

  // API 5: Benefit Gap Analysis (GET & POST /api/benefit-gap)
  app.post('/api/benefit-gap', (req, res) => {
    try {
      const { profile, evaluatedCategories, family, detectedNeeds } = req.body;
      const defaultProfile = profile || {
        age: 24,
        gender: 'All',
        employmentStatus: 'Unemployed',
        annualIncome: 180000,
        state: 'National',
        isStudent: false,
        isFarmer: false,
        isSeniorCitizen: false,
        isDifferentlyAbled: false,
        hasBPLCard: false
      };

      const report = computeBenefitGap(
        defaultProfile,
        evaluatedCategories || [],
        family,
        detectedNeeds || []
      );

      return res.json(report);
    } catch (err: any) {
      console.error('Error in /api/benefit-gap:', err);
      return res.status(500).json({ error: 'Failed to calculate benefit gap', details: err?.message });
    }
  });

  app.get('/api/benefit-gap/:citizen_id', (req, res) => {
    const report = computeBenefitGap({
      age: 24,
      gender: 'All',
      employmentStatus: 'Unemployed',
      annualIncome: 180000,
      state: 'National',
      isStudent: false,
      isFarmer: false,
      isSeniorCitizen: false,
      isDifferentlyAbled: false,
      hasBPLCard: false,
      qualification: "Bachelor's Degree",
      specialization: 'General',
      percentage: 70,
      category: 'General',
      experienceYears: 0
    });
    return res.json(report);
  });

  // API 6: Document Readiness (POST & GET /api/documents/readiness)
  app.post('/api/documents/readiness', (req, res) => {
    try {
      const { schemeId, userDocumentsMap } = req.body;
      const result = evaluateDocumentReadiness(schemeId || 9901, userDocumentsMap || {});
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/documents/readiness:', err);
      return res.status(500).json({ error: 'Failed to calculate document readiness', details: err?.message });
    }
  });

  app.get('/api/documents/readiness/:citizen_id/:scheme_id', (req, res) => {
    const { scheme_id } = req.params;
    const result = evaluateDocumentReadiness(scheme_id, {
      'Aadhaar Card': 'available',
      'Bank Passbook': 'available'
    });
    return res.json(result);
  });

  // API 7: Action Plan Generation (POST & GET /api/action-plan)
  app.post('/api/action-plan', (req, res) => {
    try {
      const { profile, detectedNeeds, family, userDocuments } = req.body;
      const defaultProfile = profile || {
        name: 'Aarav Sharma',
        age: 24,
        gender: 'All',
        employmentStatus: 'Unemployed',
        annualIncome: 180000,
        state: 'National',
        isStudent: false,
        isFarmer: false,
        isSeniorCitizen: false,
        isDifferentlyAbled: false,
        hasBPLCard: false
      };

      const plan = generatePersonalizedActionPlan(
        defaultProfile,
        detectedNeeds || [],
        family,
        userDocuments || ['Aadhaar Card', 'Bank Passbook']
      );

      return res.json(plan);
    } catch (err: any) {
      console.error('Error in /api/action-plan:', err);
      return res.status(500).json({ error: 'Failed to generate action plan', details: err?.message });
    }
  });

  app.get('/api/action-plan/:citizen_id', (req, res) => {
    const plan = generatePersonalizedActionPlan(
      {
        name: 'Citizen',
        age: 24,
        gender: 'All',
        employmentStatus: 'Unemployed',
        annualIncome: 180000,
        state: 'National',
        isStudent: true,
        isFarmer: false,
        isSeniorCitizen: false,
        isDifferentlyAbled: false,
        hasBPLCard: false,
        qualification: "Bachelor's Degree",
        specialization: 'General',
        percentage: 75,
        category: 'General',
        experienceYears: 0
      },
      [{ category: 'education', label: 'Education', priority: 'high', reasoning: 'Student profile', keywords: ['college'], confidence: 0.9 }]
    );
    return res.json(plan);
  });

  // API 8: Admin Scheme Data Quality and Verification
  app.get('/api/admin/schemes', (req, res) => {
    const schemes = SCHEMES_DATABASE.map(s => {
      const override = schemeOverrides[String(s.id)];
      return {
        ...s,
        last_verified: override?.last_verified || s.last_verified,
        official_url: override?.official_url || s.official_url,
        verification_status: override?.verification_status || s.verification_status
      };
    });
    return res.json({ schemes });
  });

  app.post('/api/admin/schemes/verify', (req, res) => {
    const { schemeId, last_verified, official_url, verification_status } = req.body;
    if (!schemeId) {
      return res.status(400).json({ error: 'schemeId is required' });
    }
    schemeOverrides[String(schemeId)] = {
      last_verified: last_verified || new Date().toISOString().split('T')[0],
      official_url,
      verification_status: verification_status || 'recently_verified'
    };
    return res.json({
      success: true,
      message: `Verification status updated for Scheme #${schemeId}`,
      updated: schemeOverrides[String(schemeId)]
    });
  });

  app.get('/api/admin/data-quality', (req, res) => {
    const total = SCHEMES_DATABASE.length;
    let recentlyVerified = 0;
    let verificationDue = 0;
    let outdated = 0;

    SCHEMES_DATABASE.forEach(s => {
      const override = schemeOverrides[String(s.id)];
      const status = override?.verification_status || s.verification_status;
      if (status === 'recently_verified') recentlyVerified++;
      else if (status === 'verification_due') verificationDue++;
      else outdated++;
    });

    const verifiedPct = Math.round((recentlyVerified / total) * 100);
    const duePct = Math.round((verificationDue / total) * 100);
    const outdatedPct = 100 - verifiedPct - duePct;

    return res.json({
      totalSchemes: total,
      recentlyVerified,
      verificationDue,
      outdated,
      verifiedPct,
      duePct,
      outdatedPct,
      healthStatus: verifiedPct >= 85 ? 'Healthy' : 'Attention Needed',
      lastAuditDate: '2026-08-31'
    });
  });

  // API 9: Chatbot with Need Detection & AI Explanation
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, profile, family, userDocuments } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Step 1: Detect needs from text
      const detected = detectNeedsFromText(message);

      // Step 2: Retrieve matching structured schemes
      const { recommendations, synergies } = rankSchemeRecommendations(
        profile || {
          name: 'Citizen',
          age: 24,
          gender: 'All',
          employmentStatus: 'Unemployed',
          annualIncome: 180000,
          state: 'National',
          isStudent: false,
          isFarmer: false,
          isSeniorCitizen: false,
          isDifferentlyAbled: false,
          hasBPLCard: false
        },
        detected.needs,
        family,
        userDocuments || ['Aadhaar Card', 'Bank Passbook']
      );

      const topSchemes = recommendations.slice(0, 3);
      const ai = getGeminiClient();

      if (ai && process.env.GEMINI_API_KEY) {
        const prompt = `You are CitizenConnect AI, the authoritative Indian Government Citizen Benefit Navigator.
Citizen Situation: "${message}"

Detected Needs: ${detected.needs.map(n => `${n.label} (${n.priority})`).join(', ')}

Verified Government Schemes Retrieved:
${topSchemes
  .map(
    (r, i) =>
      `${i + 1}. ${r.scheme.name} (${r.scheme.shortName})
- Match: ${r.priorityScore}% (${r.evaluation.status.toUpperCase()})
- Benefits: ${r.scheme.benefits}
- Criteria: ${r.evaluation.decisionFactors.join('; ')}
- Missing / Action: ${r.evaluation.actionGuidance}
- Official Portal: ${r.scheme.official_url} (${r.scheme.official_source})`
  )
  .join('\n\n')}

Instructions:
1. Speak in a respectful, warm, and helpful tone (Namaste).
2. Clearly acknowledge the citizen's detected needs.
3. Present the relevant verified government schemes with their transparent eligibility status (Eligible or Almost Eligible).
4. Explain clearly what document or action is required next.
5. Emphasize that final eligibility is determined by the relevant government authority.
6. If the user spoke in Hindi or Tamil, respond in that language; otherwise use English.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        return res.json({
          reply: response.text,
          detectedNeeds: detected.needs,
          recommendations: topSchemes,
          synergies,
          source: 'gemini'
        });
      }

      // Fallback deterministic response when Gemini key is not configured
      const schemeListText = topSchemes
        .map(
          r =>
            `• **${r.scheme.shortName}** (${r.evaluation.status === 'eligible' ? '🟢 Eligible' : '🟡 Almost Eligible'} - ${r.priorityScore}% Match)\n  *Benefit:* ${r.scheme.benefits}\n  *Next Action:* ${r.evaluation.actionGuidance}\n  *Official Source:* ${r.scheme.official_source} (${r.scheme.official_url})`
        )
        .join('\n\n');

      const fallbackReply = `Namaste! Based on your situation, I identified **${detected.needs.length} welfare support areas**:\n${detected.needs.map(n => `• **${n.label}** (${n.priority.toUpperCase()} priority)`).join('\n')}\n\nHere are verified government programs that may support your family:\n\n${schemeListText}\n\n💡 *Note: Final eligibility is determined by the respective government authority.*`;

      return res.json({
        reply: fallbackReply,
        detectedNeeds: detected.needs,
        recommendations: topSchemes,
        synergies,
        source: 'local'
      });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      return res.status(500).json({ error: 'Chatbot processing failed', details: err?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CitizenConnect AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
