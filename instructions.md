# TripGenie-AI — Setup & Deployment Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Convex account (free at https://convex.dev)
- A Clerk account (free at https://clerk.com)
- An OpenRouter API key (https://openrouter.ai)

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd TripGenie-AI
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project-id.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxx

# Rate Limiting (optional)
ARCJET_KEY=ajkey_xxxx
```

### How to get each key:

| Key | Where to get |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex dashboard → Settings → Deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `OPENROUTER_API_KEY` | https://openrouter.ai/keys |
| `ARCJET_KEY` | https://app.arcjet.com (optional) |

### 3. Start Convex

Open a **separate terminal** and run:

```bash
npx convex dev
```

This will:
- Sync your schema to Convex cloud
- Watch for changes to `convex/` files
- Generate types in `convex/_generated/`

### 4. Start Next.js

```bash
npm run dev
```

Open http://localhost:3000

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "TripGenie-AI MVP"
git push origin main
```

### 2. Import in Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)

### 3. Set Environment Variables

In Vercel → Project → Settings → Environment Variables, add ALL variables from `.env.local`.

### 4. Deploy Convex to Production

```bash
npx convex deploy
```

This deploys your Convex schema and functions to production. Use the production URL for `NEXT_PUBLIC_CONVEX_URL` in Vercel.

### 5. Deploy

Click "Deploy" in Vercel. It will build and deploy automatically.

---

## How AI Integration Works

### Flow:
1. User chats in the planner interface
2. Each message is sent to `POST /api/aimodel` with the full conversation history
3. The backend forwards the conversation to OpenRouter's GPT-4.1-mini with a system prompt
4. Two modes:
   - **Chat mode** (`isFinal: false`): AI asks one question at a time, returns a UI hint for rendering generative UI components
   - **Final mode** (`isFinal: true`): AI generates a complete trip plan with hotels and itinerary in strict JSON format
5. The trip JSON is validated, saved to Convex, and the user is redirected to the trip view page

### Changing the AI model:
Edit `app/api/aimodel/route.tsx` — change the `model` field:

```typescript
model: 'openai/gpt-4.1-mini',  // Change to any OpenRouter model
// Examples:
// 'anthropic/claude-3.5-sonnet'
// 'google/gemini-2.0-flash'
// 'meta-llama/llama-3.1-70b-instruct'
```

### Customizing the trip output:
Edit `FINAL_PROMPT` in the same file to request different data fields.

---

## Project Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx convex dev` | Start Convex dev server (schema sync) |
| `npx convex deploy` | Deploy Convex to production |

---

## Extending the Project

### Adding a new page:
1. Create a new directory under `app/` (e.g., `app/explore/page.tsx`)
2. If it should be auth-protected, it is by default (middleware blocks non-public routes)
3. If it should be public, add the route pattern to `middleware.ts`

### Adding a new Convex table:
1. Define the table in `convex/schema.ts`
2. Create mutation/query functions in a new file under `convex/`
3. Run `npx convex dev` to sync

### Adding a new UI component:
1. Use `npx shadcn@latest add [component-name]` for shadcn components
2. Or create custom components in `app/_components/` or relevant `_components/` folder

### Map customization:
- Tile styles can be changed by modifying the tile URL in `TripMapInner.tsx`
- Marker styles are defined inline with `L.divIcon` in the same file
