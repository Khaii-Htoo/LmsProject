"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Label } from "@radix-ui/react-dropdown-menu";
import { GithubIcon, Loader } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  const handleGithubSignIn = async () => {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("SignIn with github you will be redirected");
          },
          onError: (error) => {
            toast.error("Github Login error!");
          },
        },
      });
    });
  };

  const signinWithEmail = async () => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: (data) => {
            toast.success("Send otp to your account");
            redirect(`/verify-email?email=${email}`);
          },
          onError: () => {
            toast.error("Email Login Fail");
          },
        },
      });
    });
  };

  return (
    <Card className=" min-w-md py-7 ">
      <CardHeader>
        {" "}
        <h1>Welcome Back !</h1>
        <h1>Login with your Github email account</h1>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGithubSignIn}
          variant={"outline"}
          className=" w-full cursor-pointer"
          disabled={githubPending}
        >
          {" "}
          {githubPending ? (
            <Loader size={4} className=" animate-spin" />
          ) : (
            <>
              {" "}
              <GithubIcon className=" size-4 " />{" "}
              <span>SignIn with Github</span>
            </>
          )}
        </Button>
        <div className=" relative after:absolute my-3  text-muted-foreground after:border-t text-center text-sm after:flex after:inset-0 after:top-1/2 after:z-0">
          <span className=" z-10 bg-card   relative px-2">
            Or Continue with
          </span>
        </div>
        <div className="flex space-y-3 flex-col">
          <Label>Email</Label>
          <Input
            placeholder="m@example.com"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button onClick={signinWithEmail} disabled={emailPending}>
            {emailPending ? (
              <Loader size={4} className=" animate-spin" />
            ) : (
              "Continue with email"
            )}{" "}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
