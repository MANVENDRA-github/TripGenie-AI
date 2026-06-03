import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Resolve the authenticated caller's email from the Clerk-verified identity.
 *
 * This is the ONLY trustworthy source of who is calling — never accept a user id
 * or email from the client request, since Convex functions are public endpoints.
 *
 * Throws if the request is unauthenticated or the JWT is missing the `email`
 * claim (see `convex/auth.config.ts` for the required Clerk setup).
 */
export async function requireEmail(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated: please sign in to continue.");
  }
  const email = identity.email;
  if (!email) {
    throw new Error(
      "Authenticated identity is missing an email claim. Add `email` to the Clerk 'convex' JWT template."
    );
  }
  return email;
}
