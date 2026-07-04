# RAG Integration Guide for Resume-Based Chatbot

## What is RAG (Retrieval-Augmented Generation)?

RAG enhances AI responses by retrieving relevant information from your resume before generating answers. Instead of asking Gemini generic questions, you're asking it: "Based on this resume section, answer the user's question."

```
User Query → [Retrieve relevant resume sections] → Context + Query → AI → Answer
```

## Architecture Options

### Option 1: Backend Server (RECOMMENDED - Most Secure)

**Pros:**
- API key never exposed to frontend
- Scalable embeddings pipeline  
- Resume data stays on server
- Can use vector databases (Chroma, Pinecone, Weaviate)

**Flow:**
```
Frontend (ChatBot) → Your Backend API → Vector DB (retrieve resume chunks)
                                     → Gemini API (with context) → Response
```

**Tech Stack:**
- Backend: Node.js/Python (Express/FastAPI)
- Vector DB: Chroma (open source, runs locally)
- Resume Loading: PDF parser + text splitter
- Embeddings: OpenAI embeddings or local embeddings

**Backend Example (Node.js + LangChain):**
```javascript
// backend.js
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load resume document
const resumeText = fs.readFileSync("./resume.pdf.txt", "utf-8");

// Split into chunks
const splitter = new CharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});
const resumeChunks = splitter.splitText(resumeText);

// Create embeddings and store in vector DB
const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
const vectorStore = await Chroma.fromDocuments(
  resumeChunks.map(text => ({ pageContent: text })),
  embeddings
);

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  
  // Retrieve relevant resume sections
  const relevantDocs = await vectorStore.similaritySearch(message, 3);
  const resumeContext = relevantDocs.map(d => d.pageContent).join("\n\n");
  
  // Get response from Gemini with context
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const response = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{
        text: `You are Fouad's AI assistant. Based on the resume below, answer: "${message}"\n\nRESUME:\n${resumeContext}`
      }]
    }],
    generationConfig: { maxOutputTokens: 500 }
  });
  
  res.json({ 
    response: response.response.text(),
    sources: relevantDocs 
  });
});
```

**Frontend Integration:**
```javascript
const sendMessage = async (userMessage) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: userMessage })
  });
  const { response: botMessage } = await response.json();
  return botMessage;
};
```

### Option 2: Alternative - Use LangChain Cloud + API

Connect to pre-built RAG services:
- **LangServe** - Self-host LangChain apps
- **LangSmith** - Monitor LLM calls
- **Langchain Playground** - Build RAG chains

### Option 3: Frontend-Only (Simple RAG)

Less sophisticated but works without backend:
- Load resume as text
- Use simple keyword/semantic search
- Send relevant sections with query to Gemini

```javascript
const findRelevantResumeChunks = (query, resumeText) => {
  const chunks = resumeText.split("\n\n");
  // Simple keyword search (not semantic)
  return chunks.filter(chunk => 
    query.toLowerCase().split(" ").some(word => 
      chunk.toLowerCase().includes(word)
    )
  ).slice(0, 3);
};
```

## Implementation Steps

### Step 1: Set Up Backend (Recommended)
1. Create `backend/` folder in your Portfolio directory
2. Initialize Node.js: `npm init -y`
3. Install dependencies:
   ```bash
   npm install express cors langchain @langchain/core @langchain/community @google/generative-ai chroma-js
   ```
4. Create `backend/server.js` with RAG pipeline
5. Deploy to Vercel, Render, or Railway

### Step 2: Convert Resume to Embeddings
1. Export your resume as text (PDF → .txt)
2. Backend loads and chunks the text
3. Create embeddings + store in vector DB
4. This happens once on startup

### Step 3: Update Frontend Chatbot
- Remove API key UI
- Call backend `/api/chat` instead of direct Gemini API
- Backend handles all AI logic securely

### Step 4: Environment Variables
- Store API keys on backend only:
  ```
  GEMINI_API_KEY=your_key_here
  OPENAI_API_KEY=for_embeddings
  CHROMA_DB_PATH=./chroma_db
  ```

## Vector Databases Comparison

| Database | Best For | Setup |
|----------|----------|-------|
| **Chroma** | Local/self-hosted, simple RAG | Built into LangChain, no external service |
| **Pinecone** | Scalable, multi-user, cloud | Managed service, API-based |
| **Weaviate** | Enterprise, hybrid search | Docker container |
| **Supabase (pgvector)** | PostgreSQL-native | SQL + vectors |

## Example: Full Backend Integration

**Directory Structure:**
```
Portfolio/
├── app.js (remove API key UI)
├── backend/
│   ├── server.js (RAG pipeline)
│   ├── resume.txt (your resume content)
│   ├── package.json
│   └── .env (secrets)
├── .gitignore (add backend/.env)
└── index.html
```

## Security Benefits

✅ API keys never exposed to frontend
✅ Resume data stays on server (not sent to user browser)
✅ Can update resume without redeploying frontend
✅ Better rate limiting and caching
✅ Audit trail of conversations (if needed)

## Next Steps

1. **Choose your approach** - Backend (recommended) or frontend-only?
2. **Prepare resume** - Convert to text format
3. **Set up backend** (if choosing backend option)
4. **Test RAG pipeline** - Verify relevant chunks retrieved
5. **Deploy** - Backend to cloud, frontend stays same

---

**Ready to implement?** Let me know if you want the backend code + frontend changes!
