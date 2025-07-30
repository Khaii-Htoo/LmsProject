import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" relative min-h-svh flex flex-col items-center justify-center p-3">
      {children}
    </div>
  );
};

export default layout;
