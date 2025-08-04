"use client ";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useSignout = () => {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully Logout!");
          redirect("/login");
        },
      },
    });
  };
  return handleLogout;
};
