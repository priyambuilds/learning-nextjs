"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routs";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

interface SocialAuthFormProps {
  callbackUrl?: string;
  disabled?: boolean;
  mode?: "signup" | "login" | string;
}

const SOCIAL_PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: "/icons/google.svg",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "/icons/github.svg",
  },
] as const;

const SocialAuthForm: React.FC<SocialAuthFormProps> = ({
  callbackUrl = ROUTES.HOME,
  disabled = false,
  mode,
}) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
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

  const handleSocialSignIn = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      // Optional: Use mode for analytics or logic here if needed
      await signIn(provider, {
        callbackUrl,
        redirect: true,
      });
    } catch {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5 mt-10">
      {SOCIAL_PROVIDERS.map(({ id, name, icon }) => (
        <Button
          key={id}
          type="button"
          className="flex-1 px-4 py-3.5 rounded-2 min-h-12 text-dark-200_light800 background-dark400_light900 body-medium"
          onClick={() => handleSocialSignIn(id)}
          disabled={disabled || !!loadingProvider}
          aria-disabled={disabled || !!loadingProvider}
          aria-busy={loadingProvider === id}
        >
          <Image
            src={icon}
            alt={name}
            width={20}
            height={20}
            className={id === "github" ? "invert-colors mr-h-12" : "mr-h-12"}
          />
          <span className="text-dark-200_light800 body-medium">
            {loadingProvider === id ? `Loading...` : `Login with ${name}`}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default SocialAuthForm;
