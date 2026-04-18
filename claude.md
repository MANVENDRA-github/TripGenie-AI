# TripGenie-AI — Architecture & Context Document

> **Purpose**: This file serves as a comprehensive context document for any AI model or developer working on TripGenie-AI. It covers every detail of how the project works — architecture, data flow, file structure, tech stack, and design decisions.

---

## 1. Project Overview

**TripGenie-AI** is an AI-powered travel planning SaaS that:
- Collects user preferences through a conversational chat interface (origin, destination, group size, budget, duration)
- Sends a single structured prompt to an LLM via OpenRouter API
- Generates a complete travel itinerary with hotel recommendations and day-by-day activity plans
- Displays results in a rich structured UI with interactive maps
- Persists trips in Convex database for later retrieval

---

## 2. Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15.4 (App Router) | React 19, TypeScript, server/client components |
| **Styling** | Tailwind CSS v4 + Vanilla CSS | Tailwind for utilities, custom CSS for cinematic landing & complex layouts |
| **UI Components** | shadcn/ui (Radix UI) | Button, Textarea — customized with `class-variance-authority` |
| **Authentication** | Clerk | OAuth + email auth, middleware-based route protection |
| **Database** | Convex | Real-time serverless database with mutations/queries |
| **AI** | OpenRouter API (GPT-4.1-mini) | Via OpenAI SDK pointed at OpenRouter's base URL |
| **Maps** | Leaflet + OpenStreetMap | 100% free, no API key required |
| **Animations** | Framer Motion (`motion`) | Landing page animations, staggered reveals |
| **Font** | Outfit (Google Fonts) | Loaded via `next/font/google` |
| **Rate Limiting** | Arcjet | Token bucket rate limiting on API routes |
| **Deployment** | Vercel (free tier) | Auto-deploys from Git |

---

## 3. Folder Structure

```
TripGenie-AI/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx   # Clerk sign-in page
│   │   └── sign-up/[[...sign-up]]/page.tsx   # Clerk sign-up page
│   ├── _components/                           # Landing page components
│   │   ├── Header.tsx                         # Glass header with auth-aware nav
│   │   ├── CinematicHero.tsx                  # Canvas particles, gradient orbs, hero content
│   │   └── FeaturesSection.tsx                # Feature cards with glass effect
│   ├── api/
│   │   ├── aimodel/route.tsx                  # AI endpoint — chat + trip generation
│   │   └── arcjet/route.ts                    # Rate limiting endpoint
│   ├── create-new-trip/
│   │   ├── page.tsx                           # Planner layout (chat + map split)
│   │   └── _components/
│   │       ├── ChatBox.tsx                    # Main chat conversation handler
│   │       ├── BudgetUi.tsx                   # Budget selector (Cheap/Moderate/Luxury)
│   │       ├── GroupSizeUi.tsx                # Group selector (Solo/Couple/Family/Friends)
│   │       ├── SelectDaysUi.tsx               # Day counter with +/- buttons
│   │       ├── FinalUi.tsx                    # Generation loading/completion state
│   │       ├── EmptyBoxState.tsx              # Initial state with suggestion options
│   │       ├── TripMap.tsx                    # Dynamic import wrapper for Leaflet
│   │       └── TripMapInner.tsx               # Leaflet map with markers
│   ├── trip/[id]/
│   │   └── page.tsx                           # Full trip view (header, map, hotels, itinerary)
│   ├── my-trips/
│   │   └── page.tsx                           # Grid of saved trips
│   ├── ConvexClientProvider.tsx               # Convex + Provider wrapper
│   ├── provider.tsx                           # User auto-creation + context
│   ├── layout.tsx                             # Root layout (Clerk, Convex, Leaflet CSS, fonts)
│   ├── page.tsx                               # Landing page
│   └── globals.css                            # All styles — Tailwind theme + cinematic + app CSS
├── components/ui/                             # shadcn UI primitives
│   ├── button.tsx
│   └── textarea.tsx
├── context/
│   └── UserDetailContext.tsx                  # React context for user details
├── convex/
│   ├── schema.ts                              # DB schema (UserTable + TripsTable)
│   ├── user.ts                                # CreateNewUser mutation
│   ├── trips.ts                               # saveTrip, getUserTrips, getTripById
│   └── _generated/                            # Auto-generated Convex types
├── hooks/
│   └── use-outside-click.tsx                  # Click outside hook
├── lib/
│   └── utils.ts                               # cn() utility (clsx + tailwind-merge)
├── middleware.ts                               # Clerk route protection
├── next.config.ts                             # Next.js config (image domains)
├── package.json
├── tsconfig.json
└── claude.md                                  # This file
```

---

## 4. Authentication Flow

```
User visits site → Clerk middleware checks route
├── Public routes: /, /sign-in, /sign-up, /trip/*
│   → Renders without auth
├── Protected routes: /create-new-trip, /my-trips
│   → Redirects to sign-in if not authenticated
│
After sign-in:
├── provider.tsx fires useEffect
├── Calls Convex CreateNewUser mutation
├── If user doesn't exist in UserTable → creates new entry
├── Stores user details in UserDetailContext
```

### Environment Variables for Clerk:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## 5. AI Integration — How It Works

### Architecture:
```
ChatBox (client) → POST /api/aimodel → OpenRouter API (GPT-4.1-mini) → JSON response
```

### Two Modes:

#### Mode 1: Conversational (isFinal=false)
- System prompt instructs AI to ask ONE question at a time in order:
  1. Source city
  2. Destination city
  3. Group size → renders `GroupSizeUi` component
  4. Budget → renders `BudgetUi` component
  5. Trip duration → renders `SelectDaysUi` component
  6. Interests
  7. Special preferences
- Response format: `{ "resp": "text", "ui": "budget|groupSize|tripDuration|final|none" }`
- The `ui` field triggers "generative UI" — inline React components rendered in the chat

#### Mode 2: Final Generation (isFinal=true)
- System prompt: `FINAL_PROMPT` — requests complete trip plan in strict JSON
- Response format:
```json
{
  "trip_plan": {
    "destination": "string",
    "origin": "string",
    "duration": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "geo_coordinates": { "latitude": 0, "longitude": 0 },
        "rating": 4.5,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "geo_coordinates": { "latitude": 0, "longitude": 0 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}
```

### Error Handling:
- JSON parsing with try/catch
- Fallback regex extraction if response wrapped in markdown
- Structured error responses with status codes

### Environment Variable:
```
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 6. Database Schema (Convex)

### UserTable
| Field | Type | Description |
|---|---|---|
| name | string | User's full name from Clerk |
| email | string | Primary email (used as lookup key) |
| imageUrl | string | Profile picture URL |
| subscription | string? | Optional subscription tier |

### TripsTable
| Field | Type | Description |
|---|---|---|
| userId | string | User's email (links to UserTable) |
| tripData | string | Full AI response JSON stringified |
| destination | string | Trip destination (denormalized for display) |
| origin | string | Trip origin (denormalized) |
| days | number | Number of days |
| budget | string | Budget level |
| groupSize | string | Group size description |
| createdAt | number | Unix timestamp |

### Convex Functions:
- `trips.saveTrip` — mutation: saves a new trip
- `trips.getUserTrips` — query: gets all trips for a user, ordered desc by creation
- `trips.getTripById` — query: gets a single trip by its Convex ID
- `user.CreateNewUser` — mutation: creates user if not exists (idempotent)

### Environment Variable:
```
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

---

## 7. Map Integration

- **Library**: Leaflet + OpenStreetMap (100% free, no API key)
- **Import Strategy**: Dynamic import with `ssr: false` — Leaflet requires DOM
- **Marker Types**:
  - 🟣 Purple: Hotels
  - 🟡 Yellow: Activities
  - 🔴 Red: Destination
- **Auto-bounds**: Map auto-fits to show all markers with padding
- **Leaflet CSS**: Loaded via CDN in `layout.tsx` `<head>` tag

---

## 8. UI/UX Design System

### Landing Page (Dark Cinematic Theme):
- **Background**: Pure black (#050505) with canvas particle system
- **Particles**: 80 max particles with connection lines, drift animation
- **Orbs**: 3 gradient orbs with float animation (indigo, violet, pink)
- **Grain**: SVG noise filter overlay at 3% opacity
- **Typography**: Outfit font, gradient text with animated background-position
- **CTAs**: Glassmorphism buttons with backdrop-blur
- **Features**: Glass cards with hover elevation
- **Header**: Fixed, transparent → solid with blur on scroll

### Planner Page (Light Theme):
- **Layout**: 50/50 grid split — chat left, map right
- **Chat bubbles**: User (purple gradient, right-aligned), AI (gray, left-aligned)
- **Generative UI**: Budget/group/days selectors render inline in chat
- **Input**: Clean input bar with Enter-to-send

### Trip View Page (Light Theme):
- **Header**: Purple gradient card with origin→destination, metadata badges
- **Map**: Full-width Leaflet map with all markers
- **Hotels**: Card grid with emoji placeholder images, price/rating
- **Itinerary**: Timeline with vertical line, dot markers, day badges, activity cards with chips

---

## 9. Routing

| Route | Access | Description |
|---|---|---|
| `/` | Public | Cinematic landing page |
| `/sign-in` | Public | Clerk authentication |
| `/sign-up` | Public | Clerk registration |
| `/create-new-trip` | Auth required | Planner with chat + map |
| `/my-trips` | Auth required | Grid of saved trips |
| `/trip/[id]` | Public | View a specific trip |

Middleware (`middleware.ts`) uses Clerk's `createRouteMatcher` to define public routes. Everything else requires authentication.

---

## 10. Data Flow — End to End

```
1. User lands on / → CinematicHero renders
2. Clicks "Start Planning" → /create-new-trip (auth required)
3. ChatBox initializes with EmptyBoxState
4. User selects suggestion → sends first message to /api/aimodel
5. AI asks questions one-by-one:
   - Text responses + ui hints (budget/groupSize/tripDuration)
   - Generative UI components render inline
6. After all inputs collected → AI returns ui:"final"
7. ChatBox detects "final" → sets isFinal=true → sends "Ok, Great!"
8. API calls OpenRouter with FINAL_PROMPT + full chat history
9. AI returns trip_plan JSON (hotels + itinerary with geo coords)
10. ChatBox:
    - Saves trip to Convex (trips.saveTrip)
    - Extracts markers from geo_coordinates
    - Navigates to /trip/[tripId]
11. Trip page:
    - Fetches trip from Convex by ID
    - Parses tripData JSON
    - Renders header, map, hotels, day-by-day itinerary
12. User can revisit via /my-trips (fetches all trips for their email)
```

---

## 11. Performance Considerations

- Canvas particles capped at 80, DPR limited to 2x
- `prefers-reduced-motion` media query disables particles
- Leaflet loaded via dynamic import (no SSR)
- Leaflet CSS via CDN (avoids webpack bundling issues)
- AI max_tokens: 1500 for chat, 4000 for final generation
- Convex queries are real-time reactive (no polling needed)

---

## 12. How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/TripGenie-AI.git
cd TripGenie-AI

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local with:
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
OPENROUTER_API_KEY=sk-or-v1-...
ARCJET_KEY=ajkey_...  # optional

# 4. Start Convex dev server (in separate terminal)
npx convex dev

# 5. Start Next.js dev server
npm run dev

# 6. Open http://localhost:3000
```

---

## 13. How to Deploy on Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add all environment variables from `.env.local` to Vercel → Settings → Environment Variables
4. Set Convex deployment URL to production (run `npx convex deploy`)
5. Deploy — Vercel auto-detects Next.js

---

## 14. How to Extend

### Add a new AI feature:
1. Modify `FINAL_PROMPT` in `/app/api/aimodel/route.tsx`
2. Update the response JSON schema
3. Create UI components to render the new data in `/app/trip/[id]/page.tsx`

### Add a new chat input step:
1. Add new UI component in `/app/create-new-trip/_components/`
2. Add case in `RenderGenerativeUI` in `ChatBox.tsx`
3. Update AI system prompt to include the new step

### Add new Convex table:
1. Add table definition in `convex/schema.ts`
2. Create mutations/queries in a new file under `convex/`
3. Run `npx convex dev` to sync schema

### Change AI model:
1. Update `model` field in `/app/api/aimodel/route.tsx`
2. Supported models: any model available on OpenRouter (e.g., `anthropic/claude-3.5-sonnet`, `google/gemini-2.0-flash`)

---

## 15. Dependencies

### Production:
- `next` — React framework
- `react`, `react-dom` — UI library
- `@clerk/nextjs` — Authentication
- `convex` — Database
- `openai` — OpenRouter API client
- `axios` — HTTP client for API calls
- `leaflet`, `react-leaflet` — Maps (free)
- `motion` — Animations (Framer Motion)
- `lucide-react` — Icons
- `@radix-ui/react-slot` — shadcn primitives
- `class-variance-authority`, `clsx`, `tailwind-merge` — Styling utilities
- `@arcjet/next` — Rate limiting

### Dev:
- `typescript` — Type safety
- `tailwindcss`, `@tailwindcss/postcss` — Styling
- `@types/node`, `@types/react`, `@types/react-dom`, `@types/leaflet` — Type definitions
