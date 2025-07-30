"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const page = () => {
  const [otp, setOtp] = useState("");
  const [verifyPending, startVerifyTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const verifyEmail = async () => {
    startVerifyTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verify account successfully");
            redirect("/");
          },
          onError: () => {
            toast.error("failed email verify");
          },
        },
      });
    });
  };

  return (
    <Card className=" min-w-md">
      <CardHeader className=" text-center text-3xl">
        Please check your email{" "}
        <CardDescription className=" text-xl">
          We have a sent verification code to your email addresss .Please open
          the email and paste the code below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className=" w-full my-5"
          onClick={verifyEmail}
          disabled={otp.length != 6 || verifyPending}
        >
          {verifyPending ? (
            <Loader size={4} className=" animate-spin" />
          ) : (
            "Verify Account"
          )}{" "}
        </Button>
      </CardContent>
    </Card>
  );
};

export default page;
