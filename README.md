# TripGenie-AI ✈️

> An AI-powered travel planner that turns a short chat into a complete, day-by-day trip itinerary — hotels, activities, geo-coordinates, and interactive maps included.

TripGenie-AI collects your trip preferences through a friendly conversational interface (origin, destination, group size, budget, duration), sends a single structured prompt to a large language model, and generates a full travel plan rendered in a rich UI with interactive maps. Trips are saved so you can revisit or share them later.

---

## ✨ Features

- **Conversational trip builder** — the assistant asks one question at a time and renders inline "generative UI" selectors for group size, budget, and trip duration.
- **AI-generated itineraries** — complete plans with 3–4 hotel recommendations and a day-by-day schedule, each with descriptions, addresses, ticket pricing, and best times to visit.
- **Interactive maps** — every hotel, activity, and the destination is plotted on a Leaflet + OpenStreetMap map that auto-fits to show all markers (no API key required).
- **Save & manage trips** — itineraries are persisted in Convex; view them on a dedicated trip page or browse them all under *My Trips*.
- **Shareable trips** — each trip has an unguessable link that anyone can open, no sign-in required.
- **Secure by design** — Clerk authentication, server-side identity derivation, ownership checks on every mutation, per-user rate limiting, and input validation on the AI endpoint.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4 + custom CSS, shadcn/ui (Radix) |
| **Authentication** | Clerk |
| **Database** | Convex (real-time serverless) |
| **AI** | OpenRouter (GPT-4.1-mini) via the OpenAI SDK |
| **Maps** | Leaflet + OpenStreetMap (free, no key) |
| **Animations** | Framer Motion (`motion`) |
| **Rate limiting** | Arcjet (per-user, optional) |
| **Deployment** | Vercel |

---

## 🏗 How It Works

```
Chat (client) ──► POST /api/aimodel ──► OpenRouter (GPT-4.1-mini) ──► JSON
                       │
                       ├─ Clerk auth (401 if signed out)
                       ├─ Arcjet rate limit (429 if exceeded)
                       └─ Payload validation (400 if invalid/oversized)
```

The `/api/aimodel` route runs in two modes:

1. **Conversation** (`isFinal: false`) — the AI returns `{ resp, ui }` and asks one question at a time. The `ui` hint (`groupSize` / `budget` / `tripDuration` / `final` / `none`) triggers inline React components in the chat.
2. **Final generation** (`isFinal: true`) — the AI returns a structured `trip_plan` JSON object (hotels + itinerary with geo-coordinates). The trip is saved to Convex and the user is routed to `/trip/[id]`.

The system prompt is fixed server-side, so clients cannot inject their own. Convex functions derive the caller's identity from the verified Clerk token — no `userId`/`email` is ever trusted from the client.

> For a full architecture deep-dive (data flow, schema, design decisions), see [`CLAUDE.md`](./CLAUDE.md).

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Clerk](https://clerk.com) account
- A [Convex](https://convex.dev) account
- An [OpenRouter](https://openrouter.ai) API key
- *(Optional)* an [Arcjet](https://arcjet.com) key for rate limiting

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/TripGenie-AI.git
cd TripGenie-AI
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI
OPENROUTER_API_KEY=sk-or-v1-...

# Optional — enables per-user rate limiting on the AI endpoint
ARCJET_KEY=ajkey_...
```

### 3. Wire Convex auth to Clerk (one-time)

This step is **required** — without it, signed-in mutations throw and trips can't be saved.

1. In the **Clerk dashboard → JWT Templates**, create a template named exactly **`convex`** with an `email` claim mapped to `{{user.primary_email_address}}`.
2. Register the issuer with Convex:

   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev
   ```

### 4. Run it

```bash
# Terminal 1 — Convex dev server (also pushes schema + indexes)
npx convex dev

# Terminal 2 — Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📖 Usage

1. Sign up or log in.
2. Click **Start Planning** to open the planner.
3. Answer the assistant's questions (origin, destination, group size, budget, duration).
4. Confirm — the AI generates your full itinerary.
5. Explore the trip page: header, interactive map, hotels, and a day-by-day timeline.
6. Revisit any saved trip from **My Trips**, or share its link with others.

---

## 📁 Project Structure

```
app/
├── (auth)/                  # Clerk sign-in / sign-up
├── _components/             # Landing page (hero, features, header)
├── api/aimodel/route.ts     # AI endpoint (auth + rate limit + validation)
├── create-new-trip/         # Planner (chat + map) and generative UI components
├── trip/[id]/               # Full trip view
├── my-trips/                # Grid of saved trips
└── layout.tsx               # Root layout (Clerk, Convex, fonts, Leaflet CSS)
convex/                      # Schema, auth config, and auth-gated functions
lib/                         # cn(), plan caps, Arcjet client
middleware.ts                # Clerk route protection
```

---

## ☁️ Deployment (Vercel)

1. Push to GitHub and import the project in Vercel.
2. Add every variable from `.env.local` to **Settings → Environment Variables**.
3. Deploy your Convex backend: `npx convex deploy`.
4. In the **production** Clerk instance, create the `convex` JWT template and set the issuer on the production Convex deployment:

   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev --prod
   ```

5. Vercel auto-detects Next.js and deploys.

---

## 📄 License

This project is provided as-is for learning and demonstration purposes.
