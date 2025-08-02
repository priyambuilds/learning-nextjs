"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from "@auth";
import ROUTES from "@/constants/routs";

const SocialAuthForm = () => {
  const buttonClassName =
    "flex-1 px-4 py-3.5 rounded-2 min-h-12 text-dark-200_light800 background-dark400_light900 body-medium";

  type Provider = "google" | "github";

  const handleSignIn = async (provider: "google" | "github") => {
    const loadingId = toast.loading("Redirecting to sign-in...");
    try {
      const result = await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
      toast.dismiss(loadingId);

      if (result?.error) {
        toast.error("Sign-in Failed", {
          description:
            result.error === "OAuthAccountNotLinked"
              ? "Please sign in using the account you originally used."
              : result.error ||
                "Unable to sign in. Try again or use another method.",
        });
        return false;
      }

      if (result?.ok) {
        toast.success("Signed in!", {
          description: "Welcome back!",
        });
        window.location.href = result.url ?? "/";
      }
      return true;
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Sign-in Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during sign-in.",
      });
      console.error(error);
      return false;
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5 mt-10">
      <Button
        className={buttonClassName}
        onClick={() => handleSignIn("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="google"
          width={20}
          height={20}
          className="mr-h-12"
        ></Image>
        <span className="text-dark-200_light800 body-medium">
          Login with Google
        </span>
      </Button>
      <Button
        className={buttonClassName}
        onClick={() => handleSignIn("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="google"
          width={20}
          height={20}
          className="invert-colors mr-h-12"
        ></Image>
        <span className="text-dark-200_light800 body-medium">
          Login with Github
        </span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
