"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";
import AuthForm from "@/components/forms/AuthForm";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { SignUpSchema, type SignUpData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface SubmissionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  requiresVerification?: boolean;
}

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignUp = async (data: SignUpData): Promise<SubmissionResult> => {
    if (!acceptTerms) {
      return {
        success: false,
        message:
          "Please accept the Terms of Service and Privacy Policy to continue.",
      };
    }

    setIsLoading(true);

    try {
      // Call your API to create the user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 409) {
          return {
            success: false,
            message: "An account with this email already exists.",
            errors: {
              email:
                "This email is already registered. Try signing in instead.",
            },
          };
        }

        if (response.status === 422) {
          return {
            success: false,
            message: "Please check your information and try again.",
            errors: result.errors || {},
          };
        }

        return {
          success: false,
          message:
            result.message || "Failed to create account. Please try again.",
        };
      }

      // Handle successful registration
      if (result.requiresVerification) {
        setShowSuccess(true);
        return {
          success: true,
          message: `Account created successfully! Please check ${data.email} for a verification link.`,
          requiresVerification: true,
        };
      }

      // Auto sign-in after successful registration (if verification not required)
      toast.success("Account created successfully!");

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        // If auto sign-in fails, redirect to sign-in page
        setTimeout(() => {
          router.push(`/sign-in?email=${encodeURIComponent(data.email)}`);
        }, 2000);
      }

      return {
        success: true,
        message: "Account created successfully! Signing you in...",
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="bg-white/50 dark:bg-gray-900/50 shadow-lg backdrop-blur border-0 w-full">
        <CardContent className="pt-6">
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto w-16 h-16 text-green-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-xl">
              Check your email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a verification link to your email address. Please click
              the link to activate your account.
            </p>
            <div className="space-y-2 pt-4">
              <Button
                onClick={() => setShowSuccess(false)}
                variant="outline"
                className="w-full"
              >
                Back to Sign Up
              </Button>
              <Button
                onClick={() => router.push("/sign-in")}
                variant="ghost"
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/50 dark:bg-gray-900/50 shadow-lg backdrop-blur border-0 w-full">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="font-bold text-2xl text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
          Enter your details to get started
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Social Authentication */}
        <SocialAuthForm
          callbackUrl="/dashboard"
          disabled={isLoading}
          mode="signup"
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              Or create with email
            </span>
          </div>
        </div>

        {/* Sign Up Form */}
        <AuthForm
          formType="SIGN_UP"
          schema={SignUpSchema}
          defaultValues={{
            username: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={handleSignUp}
          disabled={isLoading}
          className="space-y-4"
        />

        {/* Terms and Conditions (fully type-safe for Radix UI) */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="accept-terms"
            checked={acceptTerms}
            // CheckedState ("indeterminate" | boolean) → strictly converted to boolean
            onCheckedChange={(value: CheckedState) =>
              setAcceptTerms(value === true)
            }
            className="mt-1"
            disabled={isLoading}
          />
          <div className="gap-1.5 grid leading-none">
            <label
              htmlFor="accept-terms"
              className="peer-disabled:opacity-70 font-medium text-sm leading-none cursor-pointer peer-disabled:cursor-not-allowed"
            >
              I accept the terms and conditions
            </label>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              By creating an account, you agree to our{" "}
              <a
                href="/terms"
                className="hover:text-gray-900 dark:hover:text-gray-100 underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="hover:text-gray-900 dark:hover:text-gray-100 underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Warning for terms */}
        {!acceptTerms && (
          <Alert
            variant="default"
            className="bg-amber-50 dark:bg-amber-900/20 border-amber-200"
          >
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Please accept our terms and conditions to create your account.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
