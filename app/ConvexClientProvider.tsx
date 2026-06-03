"use client";

import React, { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import Provider from "./provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ConvexProviderWithClerk forwards the Clerk auth token to Convex so that
// `ctx.auth.getUserIdentity()` works inside queries/mutations.
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Provider>{children}</Provider>
    </ConvexProviderWithClerk>
  );
}

export default ConvexClientProvider;
