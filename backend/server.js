/**
 * Backend Server for Resume-Based Chatbot with RAG
 * 
 * This server provides the `/api/chat` endpoint that:
 * 1. Retrieves relevant resume sections using embeddings
 * 2. Sends them to Gemini API with user query
 * 3. Returns AI response based on resume context
 * 
 * Setup:
 * 1. npm install express cors axios chroma-sdk @google/generative-ai dotenv
 * 2. Create .env with GEMINI_API_KEY=your_key
 * 3. Add your resume text to resume.txt
 * 4. node backend.js
 * 5. Frontend will call http://localhost:3000/api/chat
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory resume storage (in production, use vector database like Chroma)
let resumeChunks = [];

// Load resume on startup
async function loadResume() {
  try {
    const resumePath = path.join(__dirname, 'resume.txt');
    if (!fs.existsSync(resumePath)) {
      console.warn('⚠️  resume.txt not found. Create it with your resume content.');
      return;
    }

    const resumeText = fs.readFileSync(resumePath, 'utf-8');
    
    // Split resume into chunks (roughly by sections)
    resumeChunks = resumeText
      .split('\n\n')
      .filter(chunk => chunk.trim().length > 50)
      .map((text, idx) => ({
        id: idx,
        text: text.trim(),
        // In production, create embeddings for semantic search
        // For now, using simple keyword matching
      }));
    
    console.log(`✅ Loaded ${resumeChunks.length} resume chunks`);
  } catch (error) {
    console.error('Error loading resume:', error);
  }
}

// Simple keyword-based retrieval (in production, use semantic embeddings)
function retrieveRelevantChunks(query, topK = 3) {
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const scored = resumeChunks.map(chunk => {
    const chunkText = chunk.text.toLowerCase();
    const score = queryWords.reduce((acc, word) => {
      return acc + (chunkText.includes(word) ? 1 : 0);
    }, 0);
    return { ...chunk, score };
  });

  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(c => c.text);
}

/**
 * Main Chat Endpoint
 * POST /api/chat
 * Body: { message: "User query", context: { courses: [...], profile: {...} } }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Retrieve relevant resume sections
    const relevantResumeChunks = retrieveRelevantChunks(message);
    const resumeContext = relevantResumeChunks.length > 0
      ? relevantResumeChunks.join('\n\n')
      : 'General portfolio information';

    // Format courses info from context
    const coursesInfo = context?.courses
      ? context.courses
          .map(c => `${c.name}: ${c.description}`)
          .join('\n')
      : '';

    // Build system prompt
    const systemPrompt = `You are Fouad Hammani's AI assistant. You help visitors learn about Fouad's:
- Professional experience and expertise
- Courses and learning content
- Skills in AI, data engineering, web development, and DevOps
- Projects and achievements
- How to contact or work with Fouad

IMPORTANT: Base your answers on the resume information provided below. If the user asks about something not in the resume or courses, politely say you don't have that information.

=== RESUME INFORMATION ===
${resumeContext}

=== COURSES ===
${coursesInfo}

Always be helpful, professional, and concise. Keep responses under 500 tokens.`;

    // Call Gemini API with RAG context
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + '\n\nUser Question: ' + message }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 500
      }
    });

    const responseText = response.response.text();

    res.json({
      response: responseText,
      sources: relevantResumeChunks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    resumeChunksLoaded: resumeChunks.length,
    apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fouad Hammani Resume-Based Chatbot Backend',
    endpoints: {
      chat: 'POST /api/chat - Send chat message',
      health: 'GET /api/health - Health check'
    },
    docs: 'See README.md for setup instructions'
  });
});

// Start server
loadResume().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📋 Resume chunks loaded: ${resumeChunks.length}`);
    console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  });
});

export default app;
