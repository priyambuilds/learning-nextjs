"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // or your auth provider
import { toast } from "sonner"; // or your toast library

import AuthForm from "@/components/forms/AuthForm";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { SignInSchema, type SignInData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubmissionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect URL from search params or default to dashboard
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Check for OAuth errors
  const error = searchParams.get("error");
  const errorMessages: Record<string, string> = {
    OAuthSignin: "Error in constructing an authorization URL.",
    OAuthCallback: "Error in handling the response from an OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Error in the OAuth callback handler route.",
    OAuthAccountNotLinked: "Email already exists with a different provider.",
    EmailSignin: "Check your email address.",
    CredentialsSignin: "Invalid email or password.",
    default: "Unable to sign in.",
  };

  const handleSignIn = async (data: SignInData): Promise<SubmissionResult> => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        let message = "Invalid email or password.";

        // Handle specific error types
        if (result.error === "CredentialsSignin") {
          message =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (result.error === "EmailSignin") {
          message = "Please check your email address and try again.";
        }

        return {
          success: false,
          message,
        };
      }

      if (result?.ok) {
        toast.success("Successfully signed in!");

        // Small delay to show success message
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh(); // Refresh to update auth state
        }, 1000);

        return {
          success: true,
          message: "Successfully signed in! Redirecting...",
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-900/50 shadow-lg backdrop-blur border-0 w-full">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="font-bold text-2xl text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
          Enter your credentials to access your account
        </CardDescription>

        {/* Display OAuth errors */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            {errorMessages[error] || errorMessages.default}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Social Authentication */}
        <SocialAuthForm callbackUrl={callbackUrl} disabled={isLoading} />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <AuthForm
          formType="SIGN_IN"
          schema={SignInSchema}
          defaultValues={{
            email: searchParams.get("email") || "", // Pre-fill email if provided
            password: "",
          }}
          onSubmit={handleSignIn}
          disabled={isLoading}
          className="space-y-4"
        />

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400 text-sm transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
