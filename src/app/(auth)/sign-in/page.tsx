// app/sign-in/page.tsx
"use client";

import React from "react";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";

export default function SignInPage() {
  return (
    <div className="space-y-4 p-6 border rounded-lg w-full max-w-md">
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
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
      {/* Any custom email/password form or text here */}
      <SocialAuthForm />
    </div>
  );
}
