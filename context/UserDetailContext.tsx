import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

/** The signed-in user's row, or null/undefined before it has synced. */
export type UserDetails = Doc<"UserTable"> | null | undefined;

export type UserDetailContextValue = {
  userDetails: UserDetails;
  setUserDetails: Dispatch<SetStateAction<UserDetails>>;
} | null;

export const UserDetailContext = createContext<UserDetailContextValue>(null);
