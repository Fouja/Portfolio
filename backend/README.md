# Resume-Based Chatbot Backend 🤖

This is the backend server for Fouad's AI-powered portfolio chatbot with **RAG (Retrieval-Augmented Generation)** capability. It retrieves relevant resume sections and sends them to Google Gemini API for context-aware responses.

## Architecture

```
Frontend (React) 
    ↓ POST /api/chat
Backend (Express)
    ↓ (retrieve resume chunks)
Vector Database / Resume Storage
    ↓ (send context + query)
Google Gemini API
    ↓ (AI response)
Frontend (display message)
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Gemini API key
# Get it from: https://ai.google.dev/
```

### 3. Add Your Resume

Edit `backend/resume.txt` with your actual resume content. Format it with clear sections separated by double line breaks:

```
## SECTION NAME
Content here...

## ANOTHER SECTION
More content...
```

### 4. Start the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### POST /api/chat

Send a message and get AI response based on resume context.

**Request:**
```javascript
POST http://localhost:3000/api/chat
Content-Type: application/json

{
  "message": "What is your experience with React?",
  "context": {
    "courses": [...],
    "profile": {...}
  }
}
```

**Response:**
```json
{
  "response": "Based on my resume, I have extensive experience with React including...",
  "sources": [
    "Resume chunk 1 that was used...",
    "Resume chunk 2 that was used..."
  ],
  "timestamp": "2024-07-04T10:00:00.000Z"
}
```

### GET /api/health

Health check endpoint.

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "resumeChunksLoaded": 15,
  "apiKey": "configured"
}
```

## How RAG Works

1. **Resume Chunking**: Your resume is split into sections (~50+ word minimum)
2. **Query Processing**: User question is analyzed
3. **Chunk Retrieval**: Relevant resume sections are found using keyword matching (simple) or embeddings (advanced)
4. **Context Assembly**: Top 3 relevant chunks are combined
5. **AI Generation**: Gemini API receives system prompt + resume context + user question
6. **Response**: AI responds based on your resume information

## Advanced: Semantic Search with Embeddings

The current implementation uses simple **keyword matching**. For better accuracy, upgrade to **semantic search with embeddings**:

### Option A: Use OpenAI Embeddings

```bash
npm install openai
```

```javascript
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY
});
```

### Option B: Use Local Embeddings (Free)

```bash
npm install @xenova/transformers
```

```javascript
import { pipeline } from "@xenova/transformers";

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);
```

### Option C: Use LangChain + Chroma

For production RAG with vector database:

```bash
npm install langchain @langchain/core @langchain/community
```

This allows persistent vector storage and similarity search.

## Deployment

### Option 1: Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Option 2: Render.com

1. Create new Web Service
2. Connect GitHub repo
3. Set `Start Command`: `npm start`
4. Add environment variables
5. Deploy

### Option 3: Railway

```bash
npm i -g @railway/cli
railway init
railway up
```

### Option 4: Self-Hosted (VPS/Server)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <your-repo>
cd backend
npm install
npm start
```

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name "portfolio-chatbot"
pm2 save
pm2 startup
```

## Frontend Integration

The frontend (`app.js`) automatically calls this backend:

```javascript
const backendUrl = 'http://localhost:3000/api/chat'

const response = await fetch(backendUrl, {
  method: 'POST',
  body: JSON.stringify({
    message: userMessage,
    context: { courses, profile }
  })
})
```

**For production**, update `backendUrl` to your deployed backend URL.

## Troubleshooting

### Resume chunks not loading
- Check `resume.txt` exists in backend folder
- Ensure sections are separated by double line breaks
- Check console output for loaded chunk count

### API Key errors
- Verify `GEMINI_API_KEY` is set in `.env`
- Get key from: https://ai.google.dev/
- Check key has proper permissions

### CORS errors
- CORS is enabled for all origins by default
- For production, restrict to your domain:
  ```javascript
  app.use(cors({
    origin: 'https://yourdomain.com'
  }))
  ```

### Backend not responding
- Check if server is running: `curl http://localhost:3000`
- Verify port 3000 is not in use
- Check console for startup errors

## Performance Tips

1. **Cache responses** - Use Redis for duplicate queries
2. **Limit chunk size** - Smaller chunks = faster retrieval
3. **Use embeddings** - Better accuracy than keyword search
4. **Batch requests** - Process multiple queries efficiently
5. **Monitor API usage** - Gemini has rate limits

## Security

- ✅ API keys stored on backend (not exposed to frontend)
- ✅ CORS configured for your domain
- ✅ Input validation on all endpoints
- ✅ Never commit `.env` file (use `.env.example`)

### Add to `.gitignore`:
```
.env
node_modules/
*.log
.DS_Store
```

## Future Enhancements

- [ ] Vector embeddings for semantic search
- [ ] Persistent message history
- [ ] Multi-user support with authentication
- [ ] Analytics dashboard
- [ ] PDF resume upload
- [ ] Conversation memory
- [ ] Rate limiting
- [ ] Webhook integrations

## Contributing

Feel free to improve this backend! Key areas:

1. Implement proper embeddings (Chroma, Pinecone)
2. Add conversation memory
3. Improve chunking strategy
4. Add authentication
5. Performance optimizations

## Support

Questions? Check the main [RAG-INTEGRATION.md](../RAG-INTEGRATION.md) guide for more details.

---

**Made with ❤️ for Fouad Hammani's Portfolio**
