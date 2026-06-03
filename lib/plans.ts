// Trip-length limits per subscription tier.
//
// Subscriptions aren't wired to billing yet, so freshly-created users have no
// `subscription` value and fall through to the free cap. Paid tiers are
// unbounded. Update the tier list here if pricing changes.
export const FREE_PLAN_MAX_DAYS = 10;

const UNLIMITED_TIERS = new Set(["premium", "agency"]);

/**
 * Maximum number of days a trip may span for the given subscription tier.
 * Returns `null` when the tier has no limit (paid plans).
 */
export function maxTripDaysFor(subscription?: string | null): number | null {
  const tier = (subscription ?? "").trim().toLowerCase();
  return UNLIMITED_TIERS.has(tier) ? null : FREE_PLAN_MAX_DAYS;
}
