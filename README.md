DevAudit AI — Local Development

Quick start

1) Backend (Node/Express + TypeScript)

- Install dependencies:

```bash
cd "Backend"
npm install
```

- Create `.env` in `Backend/` (copy from `.env.example`) and set:
  - `MONGO_URI`, `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`
  - `AI_SERVICE_URL` (if using local Python AI service)
  - Optional: `CLERK_SECRET_KEY` and `CLERK_WEBHOOK_SECRET` to enable Clerk server verification

- Start dev server:

```bash
npm run dev
```

2) Python AI Service (optional)

- Create and activate a virtualenv, then install:

```bash
cd Backend/devaudit-ai-service
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

3) Frontend (Vite + React)

```bash
cd devaudit-ai-ui
npm install
npm run dev
# Open http://localhost:5173 (or the port Vite selects)
```

Notes
- During development the backend contains a `authGuard` dev fallback that creates/uses a local `DevUser` if token verification fails. This is only active when `NODE_ENV !== 'production'` — remove or replace before deploying.
- To enable secure Clerk verification, set `CLERK_SECRET_KEY` in the backend `.env`. The server will attempt to verify Clerk session tokens using the Clerk SDK.
- If you use the local Python AI service, ensure `AI_SERVICE_URL` in `.env` points to `http://127.0.0.1:8000`.

Testing
- Use the Dashboard UI to start a scan (New Review) and visit Repositories / Chat to interact with the AI.

If you want, I can now:
- Run a full E2E walkthrough and fix any runtime errors,
- Harden the Clerk verification integration to a production-safe implementation,
- Add CI scripts and a more detailed developer contribution guide.
