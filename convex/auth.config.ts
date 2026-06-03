// Connects Convex's server-side auth to Clerk so that `ctx.auth.getUserIdentity()`
// returns the verified caller inside queries/mutations.
//
// ── REQUIRED ONE-TIME SETUP ─────────────────────────────────────────────────
// 1. Clerk dashboard → JWT Templates → "New template" → name it EXACTLY `convex`.
//    In that template, make sure an `email` claim is present:
//        email  ->  {{user.primary_email_address}}
//    (This is what populates `identity.email`, which the app uses as the owner key.)
// 2. Copy the template's *Issuer* URL (your Clerk Frontend API URL, e.g.
//    https://your-app.clerk.accounts.dev) and register it with Convex:
//        npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app.clerk.accounts.dev
//
// Until both steps are done, getUserIdentity() returns null and every
// authenticated function below throws — trips can't be saved or listed.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
