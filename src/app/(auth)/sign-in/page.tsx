// app/sign-in/page.tsx
import React from "react";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="space-y-4 p-6 border rounded-lg w-full max-w-md">
        <h1 className="font-bold text-2xl text-center">Sign In</h1>
        {/* Any custom email/password form or text here */}
        <SocialAuthForm />
      </div>
    </div>
  );
}
