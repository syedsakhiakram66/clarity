# CLARITY
### Repo intelligence. Powered by IBM Granite.

> Drop into any codebase. Know exactly where to start.

Clarity is an AI-powered developer tool that onboards you to any GitHub repository in under 30 seconds. Paste a URL, pick a mode, and IBM Bob — powered by IBM Granite — reads the entire codebase and tells you exactly what to do next.

---

## What it does

Most developers waste hours trying to understand a new codebase. They read random files, ask teammates, get lost in complexity. Clarity solves this.

**Two modes. One tool.**

| Mode | Who it's for | What you get |
|------|-------------|--------------|
| `[NEW HERE]` | Developers joining a new repo | Mental model, files to read first, danger zones, first task |
| `[IMPROVE IT]` | Developers who own a repo | Health score, specific issues with exact fixes, improvement roadmap |

**Three features that make it real:**

**1. Clarity Report** — Bob reads your codebase and generates a structured report with real file paths, real function names, and real actionable insights. No generic advice.

**2. Fix with Bob** — An interactive guided fix queue. Bob walks you through each issue one by one, writes the actual code fix, and answers your follow-up questions in context. It's pair programming with a principal engineer.

**3. Annotated File Tree** — Every file in your repo color-coded by Bob. Green = core function. Yellow = read first. Red = danger zone. Click any file to read it inline.

---

## Tech stack

**Frontend**
- React + Vite
- Cascadia Code font
- GitHub REST API
- Vitest for testing

**Backend**
- Python + Flask
- IBM WatsonX (Granite 4)
- IBM IAM token authentication

---

## Project structure

```
clarity/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Results.jsx       # Report + tabs
│   │   │   ├── BobChat.jsx       # Fix with Bob — guided queue + chat
│   │   │   ├── FileTree.jsx      # Annotated file tree + inline viewer
│   │   │   ├── Section.jsx       # Report section wrapper
│   │   │   ├── StatPill.jsx      # Stat display component
│   │   │   └── LoadingStep.jsx   # Animated loading steps
│   │   ├── constants/
│   │   │   └── prompts.js        # IBM Bob system prompts
│   │   ├── utils/
│   │   │   ├── github.js         # GitHub API — smart context fetching
│   │   │   └── history.js        # Local session history
│   │   ├── styles/
│   │   │   └── index.js          # Design system
│   │   ├── tests/
│   │   │   └── clarity.test.js   # 37 tests — all passing
│   │   └── App.jsx               # Root component + state
│   ├── .env                      # VITE_GITHUB_TOKEN
│   └── vite.config.js
│
└── backend/
    ├── app.py                    # Flask server — /analyze + /chat routes
    ├── requirements.txt
    └── .env                      # IBM_API_KEY + IBM_PROJECT_ID
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Python 3.10+
- IBM WatsonX account with Granite 4 access
- GitHub Personal Access Token (public_repo scope)

---

### 1. Clone the repo

```bash
git clone https://github.com/syedsakhiakram66/clarity.git
cd clarity
```

---

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
IBM_API_KEY=your_ibm_api_key_here
IBM_PROJECT_ID=your_ibm_project_id_here
```

**Getting IBM credentials:**
1. Go to [IBM Cloud](https://cloud.ibm.com)
2. Create a WatsonX project
3. Generate an API key under Manage → Access (IAM)
4. Copy your Project ID from the WatsonX project settings

Start the backend:

```bash
python app.py
```

Backend runs on `http://localhost:3001`

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_GITHUB_TOKEN=your_github_token_here
```

**Getting a GitHub token:**
1. Go to github.com → Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select only `public_repo` scope
4. Copy the token

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

### 4. Run tests

```bash
cd frontend
npm run test:run
```

37 tests. All pass.

---

## How it works

### Context fetching

Clarity doesn't just grab random files. It categorizes every file in the repo by purpose and fetches the most signal-rich ones first:

```
Priority order:
1. Config files (package.json, requirements.txt, Dockerfile...)  → 2500 chars each
2. Entry points (main.py, index.js, app.ts...)                  → 2500 chars each
3. Auth/security files (auth, middleware, jwt, session...)       → 2000 chars each
4. API/route files (router, controller, handler, endpoint...)   → 1500 chars each
5. Database/model files (model, schema, migration, db...)       → 1500 chars each
6. Test files (test, spec, __test__...)                         → 1000 chars each
```

Up to 20 files, chosen by importance — not alphabetically.

### IBM Bob prompts

Bob operates under strict rules:
- Every file path must exist in the actual file structure
- Every function name must exist in the actual file contents
- Security issues can only be flagged if the vulnerable code is visible
- `.env` files are never assumed to contain real secrets
- Inferred issues must be labeled "Likely:" and capped at LOW severity

This prevents hallucination and ensures every insight is grounded in real code.

### Fix with Bob

The guided fix queue is built from the report's existing data — no extra API call. Issues are presented one at a time. Bob writes the actual fix, explains it in 2-3 sentences, and tells you what to do next. The developer can ask follow-up questions before moving on.

---

## API reference

### `POST /analyze`

Sends repository context to IBM Granite and returns a structured JSON report.

**Request:**
```json
{
  "systemPrompt": "string — the Bob system prompt (onboard or improve)",
  "context": "string — the full repository context"
}
```

**Response:**
```json
{
  "success": true,
  "text": "string — raw JSON from IBM Granite"
}
```

---

### `POST /chat`

Sends a conversation history to IBM Granite and returns Bob's fix + explanation.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ],
  "repoContext": "string — the full repository context"
}
```

**Response:**
```json
{
  "success": true,
  "text": "string — EXPLANATION + FIX + NEXT formatted response"
}
```

---

## Features

| Feature | Status |
|---------|--------|
| GitHub repo search | ✅ |
| GitHub URL paste | ✅ |
| Private repo support | ✅ |
| Onboarding report | ✅ |
| Improvement report | ✅ |
| Health score | ✅ |
| Fix with Bob — guided queue | ✅ |
| Fix with Bob — inline chat | ✅ |
| Annotated file tree | ✅ |
| Inline file viewer | ✅ |
| Session history | ✅ |
| Export report | ✅ |
| Mobile responsive | ✅ |
| 37 passing tests | ✅ |

---

## Environment variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token — `public_repo` scope only |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `IBM_API_KEY` | IBM Cloud API key |
| `IBM_PROJECT_ID` | WatsonX project ID |

---

## Built with

- [IBM WatsonX](https://www.ibm.com/watsonx) — IBM Granite 4 model
- [GitHub REST API](https://docs.github.com/en/rest) — Repository data
- [React](https://react.dev) — UI
- [Flask](https://flask.palletsprojects.com) — Backend API
- [Vitest](https://vitest.dev) — Testing
- [Cascadia Code](https://github.com/microsoft/cascadia-code) — Font

---

## License

MIT

---

*Built in one night. Powered by IBM. Insha'Allah.* 🚀