import { Main } from "next/document";
import React from "react";
import Image from "next/image";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex justify-center items-center bg-auth-light dark:bg-auth-dark bg-cover bg-no-repeat bg-center px-4 py-10 min-h-screen">
      {children}
    </main>
  );
};

export default AuthLayout;
