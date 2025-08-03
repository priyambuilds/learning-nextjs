// src/app/(auth)/sign-in/page.tsx
import { Metadata } from "next";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | Your App Name",
  description:
    "Sign in to your account to access your dashboard and manage your data.",
  robots: "noindex, nofollow", // Prevent indexing of auth pages
};

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex flex-1 justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-bold text-gray-900 dark:text-white text-3xl tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Sign In Form */}
          <SignInForm />

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400 transition-colors"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
