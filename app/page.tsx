"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const page = () => {
  const { data: session } = authClient.useSession();
  console.log(session);
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
  return (
    <div>
      <ThemeToggle />
      {session ? (
        <>
          <h1>{session.user.name}</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <Button>Login</Button>
      )}
    </div>
  );
};

export default page;
