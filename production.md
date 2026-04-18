# TripGenie AI — Production Deployment Guide

This guide walks you through deploying the TripGenie AI Next.js application to Vercel.

## 1. Prerequisites
- A GitHub repository with your latest code.
- A free Vercel account (https://vercel.com).
- Clerk Account (for authentication).
- Convex Account (for database).
- OpenRouter API Key (for the AI models).

## 2. Vercel Project Setup
1. Log in to your Vercel Dashboard and click **Add New > Project**.
2. Select your TripGenie AI GitHub repository and click **Import**.
3. In the Configuration screen:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

## 3. Environment Variables
Before clicking Deploy, you must add the same environment variables you use locally. Go to the **Environment Variables** section in Vercel and add:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... # Get from Clerk Dashboard
CLERK_SECRET_KEY=sk_test_... # Get from Clerk Dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project-id.convex.cloud # Get from Convex Dashboard
CONVEX_DEPLOYMENT=... # Required for production

# OpenRouter (AI endpoint)
OPENROUTER_API_KEY=sk-or-v1-... # Get from OpenRouter

# Arcjet (Optional for security & rate limiting)
ARCJET_KEY=ajkey_...
```

## 4. Deploy Content
1. Click **Deploy**. Vercel will build and deploy your application.
2. If the build fails because of Convex schema mismatches, run `npx convex deploy` from your local terminal to push the finalized schema to Convex production.

## 5. Post-Deployment Optimization
- **Custom Domain**: Go to Vercel Settings > Domains to attach a `.com` or customized domain name.
- **Set Up Real URLs in Clerk**: Make sure to go back to Clerk dashboard and set your production domain as the authorized application URL! 
- **Set Up Real URLs in Convex**: Make sure Convex is aware of your production URL if doing strict URL protections.

You're done! Your TripGenie AI SaaS is officially live in production.
