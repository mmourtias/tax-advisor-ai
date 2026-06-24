# Tax Advisor AI

AI-powered tax guidance assistant built with **React**, **FastAPI**, and **Groq LLM**. Users enter their financial profile and receive structured, personalized tax advice in seconds.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [AI Integration](#ai-integration)
- [CI/CD](#cicd)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Disclaimer](#disclaimer)

---

## Project Overview

**Τι κάνει η εφαρμογή**

Tax Advisor AI is a full-stack web application that helps users understand their tax situation based on a short financial profile. The user fills in:

- Country of residence
- Annual income and expenses
- Employment status (employee or self-employed)
- Marital status and number of children

The backend validates the input, sends it to a Groq-hosted LLM (`llama-3.3-70b-versatile`), and returns structured tax guidance rendered as Markdown in the browser.

The advice is organized into four sections:

1. **Overview** — high-level summary of the user's tax position
2. **Key Tax Considerations** — country- and status-specific factors
3. **Potential Deductions & Benefits** — relevant allowances and savings
4. **Recommended Next Steps** — actionable follow-ups

> **Important:** This app provides general information only. It is not a substitute for advice from a certified tax professional.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + Vite | Single-page UI, form handling, Markdown rendering |
| **Backend** | FastAPI + Pydantic | REST API, request validation, error handling |
| **AI** | Groq API (`llama-3.3-70b-versatile`) | LLM-powered tax advice generation |
| **Containerization** | Docker + Docker Compose | Reproducible local and deployment setup |
| **CI** | GitHub Actions | Automated backend tests and frontend build |

---

## Architecture

**Πώς συνδέεται frontend με backend με AI**

```
┌─────────────────┐     POST /tax-advice      ┌─────────────────┐     Groq API      ┌──────────────┐
│  React Frontend │  ───────────────────────► │  FastAPI Backend │  ───────────────► │  LLM (Groq)  │
│  (port 5173)    │  JSON (camelCase fields)  │  (port 8000)     │  system + user    │  llama-3.3   │
│                 │  ◄─────────────────────── │                  │  ◄─────────────── │  70b         │
│  TaxForm.jsx    │  { "advice": "..." }      │  router.py       │  markdown text    └──────────────┘
│  TaxAdvice.jsx  │                           │  llm_services.py │
└─────────────────┘                           └─────────────────┘
```

### Request flow

1. **User submits the form** — `TaxForm.jsx` validates fields client-side, then calls `getTaxAdvice()` in `taxService.js`.
2. **Frontend → Backend** — A `POST` request is sent to `http://127.0.0.1:8000/tax-advice` (configurable via `VITE_API_URL`) with JSON in camelCase (`employmentStatus`, `numberOfChildren`, etc.).
3. **Validation** — FastAPI deserializes the body into a Pydantic `TaxForm` model (snake_case internally, camelCase aliases accepted).
4. **LLM call** — `router.py` offloads the blocking Groq call to a thread via `asyncio.to_thread`. `llm_services.py` builds the system and user prompts and calls the Groq Chat Completions API.
5. **Response** — The model's Markdown output is returned as `{ "advice": "..." }`.
6. **Rendering** — `TaxAdvice.jsx` renders the Markdown with `react-markdown`.

### Error handling

| HTTP Status | Cause |
|-------------|-------|
| `422` | Invalid or missing form fields (Pydantic validation) |
| `429` | Groq rate limit exceeded |
| `500` | `GROQ_API_KEY` not configured |
| `502` | Groq API error or empty response |
| `503` | Cannot connect to Groq |

CORS is enabled for `http://localhost:5173` so the Vite dev server can call the API during local development.

---

## Project Structure

```
tax-advisor-ai/
├── backend/
│   ├── main.py                 # FastAPI app, CORS middleware
│   ├── router.py               # POST /tax-advice endpoint
│   ├── schemas.py              # Pydantic request model
│   ├── config.py               # Environment variable loading
│   ├── prompt.py               # System prompt + user prompt builder
│   ├── services/
│   │   └── llm_services.py     # Groq client integration
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── TaxForm.jsx     # Financial profile form
│   │   │   └── TaxAdvice.jsx   # Advice display (Markdown)
│   │   └── services/
│   │       └── taxService.js   # API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## Setup Instructions

### Prerequisites

- **Node.js** 20+
- **Python** 3.12+
- A **Groq API key** — create one at [console.groq.com](https://console.groq.com)

### Local development

#### 1. Clone the repository

```bash
git clone <repository-url>
cd tax-advisor-ai
```

#### 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the API server:

```bash
uvicorn main:app --reload --port 8000
```

The API is available at `http://127.0.0.1:8000`. Interactive docs at `http://127.0.0.1:8000/docs`.

#### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

Optionally create `frontend/.env.local` if the backend runs on a different host:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Docker

From the project root, create `backend/.env` with your Groq API key, then:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |

The frontend container runs Vite in dev mode (`npm run dev -- --host`). The backend container runs Uvicorn on port 8000 and loads environment variables from `backend/.env`.

To stop:

```bash
docker compose down
```

---

## API Documentation

### `POST /tax-advice`

Generates personalized tax advice from a financial profile.

**Content-Type:** `application/json`

#### Request body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `country` | `string` | Yes | Non-empty |
| `income` | `number` | Yes | ≥ 0 |
| `expenses` | `number` | Yes | ≥ 0 |
| `employmentStatus` | `string` | Yes | `"employee"` or `"self-employed"` |
| `maritalStatus` | `string` | Yes | `"single"` or `"married"` |
| `numberOfChildren` | `integer` | Yes | ≥ 0 |

#### Example request

```bash
curl -X POST http://127.0.0.1:8000/tax-advice \
  -H "Content-Type: application/json" \
  -d '{
    "country": "Greece",
    "income": 35000,
    "expenses": 8000,
    "employmentStatus": "employee",
    "maritalStatus": "married",
    "numberOfChildren": 2
  }'
```

#### Example response (`200 OK`)

```json
{
  "advice": "### Overview\n\nBased on your profile as an employee in Greece with an annual income of €35,000...\n\n### Key Tax Considerations\n\n- Progressive income tax brackets apply...\n\n### Potential Deductions & Benefits\n\n- Dependent children may qualify for tax credits...\n\n### Recommended Next Steps\n\n- Gather annual income statements (E1/E2)...\n\n*Disclaimer: This is general information. Consult a certified tax professional.*"
}
```

#### Validation error (`422 Unprocessable Entity`)

```json
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "country"],
      "msg": "String should have at least 1 character",
      "input": ""
    }
  ]
}
```

#### Server error examples

```json
{ "detail": "GROQ_API_KEY is not configured" }
```

```json
{ "detail": "AI service rate limit reached. Please try again later." }
```

---

## AI Integration

**Πώς δουλεύει το prompt**

The LLM integration lives in `backend/prompt.py` and `backend/services/llm_services.py`.

### Model

- **Provider:** Groq
- **Model:** `llama-3.3-70b-versatile`
- **Interface:** Chat Completions API

### Prompt design

Two messages are sent on every request:

#### 1. System prompt

Defines the assistant's role and output format:

- Acts as an experienced international tax advisor
- Responds in Markdown with fixed sections: Overview, Key Tax Considerations, Potential Deductions & Benefits, Recommended Next Steps
- Tailors advice to the user's country and employment status
- Ends with a disclaimer to consult a certified professional

#### 2. User prompt

Built dynamically from the submitted form via `build_user_prompt()`:

```
Please provide tax advice for the following profile:
- Country: Greece
- Employment Status: employee
- Annual Income: 35000 (local currency)
- Annual Expenses: 8000 (local currency)
- Marital Status: married
- Number of Children: 2
```

### Code path

```python
# llm_services.py (simplified)
client = Groq(api_key=GROQ_API_KEY)
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": build_user_prompt(data)},
    ],
)
return response.choices[0].message.content
```

The blocking Groq HTTP call runs in a worker thread so the FastAPI event loop stays non-blocking:

```python
advice = await asyncio.to_thread(get_tax_advice, data)
```

### Why this design?

| Decision | Rationale |
|----------|-----------|
| Separate `prompt.py` | Keeps prompt engineering isolated from API and transport logic |
| Structured system prompt | Ensures consistent, readable output for the Markdown renderer |
| `asyncio.to_thread` | Groq SDK is synchronous; offloading avoids blocking async handlers |
| Explicit error mapping | Rate limits, connection failures, and API errors surface as clear HTTP statuses |

---

## CI/CD

GitHub Actions runs on every **push** and **pull request** to `main`.

Workflow file: `.github/workflows/ci.yml`

### Backend job

| Step | Action |
|------|--------|
| Setup | Python 3.12 on `ubuntu-latest` |
| Install | `pip install -r backend/requirements.txt` |
| Test | `pytest tests/` (mocks the LLM — no API key needed in CI) |

### Frontend job

| Step | Action |
|------|--------|
| Setup | Node.js 20 on `ubuntu-latest` |
| Install | `npm install` in `frontend/` |
| Build | `npm run build` — verifies the production bundle compiles |

Both jobs must pass before a PR can be merged.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | **Yes** | API key from [Groq Console](https://console.groq.com). Used to authenticate LLM requests. |

Loaded via `python-dotenv` in `backend/config.py`. If missing, the API returns `500` with `"GROQ_API_KEY is not configured"`.

**Example `backend/.env`:**

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend (`frontend/.env.local`, optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://127.0.0.1:8000` | Base URL of the FastAPI backend |

**Example `frontend/.env.local`:**

```env
VITE_API_URL=http://127.0.0.1:8000
```

> `.env` and `frontend/.env.local` are gitignored. Never commit API keys.

---

## Testing

### Backend

```bash
cd backend
pytest tests/ -v
```

Tests use `TestClient` and mock `get_tax_advice` so no live Groq calls are made:

- `test_valid_tax_advice` — valid payload returns `200` with an `advice` field
- `test_invalid_data` — missing/invalid fields return `422`

### Frontend

```bash
cd frontend
npm run build    # production build check
npm run lint     # ESLint
```

---

## Disclaimer

This application provides **general tax information only**. It does not constitute professional tax, legal, or financial advice. Tax laws vary by jurisdiction and change over time. Always consult a **certified tax professional** before making financial or filing decisions.
