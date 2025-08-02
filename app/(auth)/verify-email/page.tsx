import React, { Suspense } from "react";
import VerifyEmail from "./_components/verify-email";

const page = () => {
  return (
    <Suspense fallback="Loading...">
      <VerifyEmail />
    </Suspense>
  );
};

export default page;
