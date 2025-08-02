import { Main } from "next/document";
import React from "react";
import Image from "next/image";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex justify-center items-center bg-auth-light dark:bg-auth-dark bg-cover bg-no-repeat bg-center px-4 py-10 min-h-screen">
      <section className="shadow-light100_dark100 shadow-md px-4 sm:px-4 py-10 light-border rounded-[10px] min-w-full sm:min-w-[540px] background-light800_dark200">
        <div className="flex justify-between items-center gap-2">
          <div className="space-y-2 5">
            <h1 className="text-dark100_light900 h2-bold">Join Devflow</h1>
            <p className="text-dark500_light400 paragraph-regular">
              To get your quesitions answered
            </p>
          </div>
          <Image
            src="/images/site-logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="object-contain"
          ></Image>
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
