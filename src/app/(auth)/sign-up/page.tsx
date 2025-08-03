// src/app/(auth)/sign-up/page.tsx
import { Metadata } from "next";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create Account | Your App Name",
  description:
    "Create your account to get started with our platform and access all features.",
  robots: "noindex, nofollow",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-bold text-gray-900 dark:text-white text-3xl tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              Join us today and start your journey
            </p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{" "}
              <a
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
