"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const createUser = useMutation(api.user.CreateNewUser);
  const [userDetails, setUserDetails] = useState<any>();
  const { user } = useUser();

  const syncUser = useCallback(async () => {
    if (!user) return;
    // The user's email/identity is derived server-side from the verified Clerk
    // token; we only pass display fields here.
    const result = await createUser({
      name: user.fullName ?? "",
      imageUrl: user.imageUrl ?? "",
    });
    setUserDetails(result);
  }, [user, createUser]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUserDetail = () => useContext(UserDetailContext);
