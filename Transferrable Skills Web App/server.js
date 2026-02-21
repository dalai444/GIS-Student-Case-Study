require('dotenv').config();
const path = require('path');
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set. Set it in .env or environment to enable recommendations.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const SYSTEM_PROMPT = `You are a career advisor focused on the insurance industry. Your goal is to help reduce systemic workforce risk by matching people from other industries to insurance roles where their transferable skills are a good fit.

Given a person's skills, interests, work preferences, age (if provided), and previous experience, recommend 2–4 specific job titles or career paths within the insurance industry (e.g., claims adjuster, underwriting assistant, risk analyst, customer service in insurance, etc.). For each recommendation:
- Name the role clearly.
- Explain in 2–3 sentences why their background is a good fit (tie to their skills/experience).
- Mention 1–2 concrete next steps they could take (e.g., look for "claims trainee" roles, consider a CPCU or similar credential, apply to carriers that offer training).

Keep the tone encouraging and practical. Write in clear, plain language. Do not use bullet points with markdown symbols; use line breaks and short paragraphs instead.`;

function buildUserMessage(body) {
  const parts = [];
  if (body.age) parts.push(`Age: ${body.age}`);
  if (body.location) parts.push(`Location / work preference: ${body.location}`);
  if (body.skills) parts.push(`Skills: ${body.skills}`);
  if (body.certifications) parts.push(`Certifications / education: ${body.certifications}`);
  if (body.work_preferences) parts.push(`Types of work they enjoy: ${body.work_preferences}`);
  if (body.interests) parts.push(`Interests (industries/topics): ${body.interests}`);
  parts.push(`Previous work experience: ${body.experience}`);
  if (body.additional) parts.push(`Additional context: ${body.additional}`);
  return parts.join('\n\n');
}

app.post('/api/recommend', async (req, res) => {
  if (!genAI) {
    return res.status(503).json({
      error: 'Recommendations are not configured. Please set GEMINI_API_KEY.',
    });
  }

  const { experience } = req.body || {};
  if (!experience || typeof experience !== 'string' || !experience.trim()) {
    return res.status(400).json({ error: 'Work experience is required.' });
  }

  const userMessage = buildUserMessage(req.body);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(userMessage);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(500).json({
        error: 'The recommendation service did not return a response. Please try again.',
      });
    }

    const recommendation = response.text().trim() || 'Unable to generate a recommendation.';

    return res.json({ recommendation });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    const status = err.message?.includes('API key') ? 401 : 500;
    const message =
      status === 401
        ? 'Invalid API key. Please check GEMINI_API_KEY.'
        : err.message || 'The recommendation service failed. Please try again.';
    return res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Insurance Career Match running at http://localhost:${PORT}`);
});
