"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routs";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"; // Use the classic next-auth/react for this usage!

const SocialAuthForm = () => {
  const buttonClassName =
    "flex-1 px-4 py-3.5 rounded-2 min-h-12 text-dark-200_light800 background-dark400_light900 body-medium";

  // Get error message from query params using Next.js hook
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  React.useEffect(() => {
    if (error) {
      toast.error("Sign-in Failed", {
        description:
          error === "OAuthAccountNotLinked"
            ? "Please sign in using the account you originally used."
            : error,
      });
    }
  }, [error]);

  return (
    <div className="flex flex-wrap gap-2.5 mt-10">
      <Button
        className={buttonClassName}
        onClick={() => signIn("google", { callbackUrl: ROUTES.HOME })}
      >
        <Image
          src="/icons/google.svg"
          alt="google"
          width={20}
          height={20}
          className="mr-h-12"
        />
        <span className="text-dark-200_light800 body-medium">
          Login with Google
        </span>
      </Button>
      <Button
        className={buttonClassName}
        onClick={() => signIn("github", { callbackUrl: ROUTES.HOME })}
      >
        <Image
          src="/icons/github.svg"
          alt="github"
          width={20}
          height={20}
          className="invert-colors mr-h-12"
        />
        <span className="text-dark-200_light800 body-medium">
          Login with Github
        </span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
