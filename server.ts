import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      const ai = getGeminiClient();

      if (ai && process.env.GEMINI_API_KEY) {
        const prompt = `You are OneConnect AI Citizen Assistant, an authoritative Indian Government citizen services and welfare guide.
Provide precise, helpful, step-by-step guidance on government schemes (PM-KISAN, Ayushman Bharat, PMAY, Mudra), documents (Aadhaar, PAN, Passport, DL, Caste, Income certificate), jobs (SSC, UPSC, RRB, Banking), and eligibility criteria.
Keep the answer structured, clear, and actionable.

Citizen Query: ${message}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        return res.json({
          reply: response.text,
          source: 'gemini'
        });
      }

      // If no API key, return structured response signal
      return res.json({
        reply: null,
        source: 'local'
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({ error: 'AI processing failed', details: err?.message });
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
    console.log(`OneConnect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
