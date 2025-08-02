import { headers } from "next/headers";
import LoginForm from "./_components/login-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  session && redirect("/");

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default page;
