"use client";

import { z } from "zod";
import { useForm, Path, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form as RHFFormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --------- FIELD MAPS ---------
const FIELD_LABELS: Record<string, string> = {
  email: "Email Address",
  password: "Password",
  confirmPassword: "Confirm Password",
  name: "Full Name",
  username: "Username",
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  email: "Enter your email",
  password: "Enter your password",
  confirmPassword: "Confirm your password",
  name: "Enter your name",
  username: "Choose a username",
};

const AUTOCOMPLETE_MAP: Record<string, string> = {
  email: "email",
  password: "current-password",
  confirmPassword: "new-password",
  name: "name",
  username: "username",
};

function getLabel(field: string) {
  return FIELD_LABELS[field] || field[0].toUpperCase() + field.slice(1);
}
function getPlaceholder(field: string) {
  return FIELD_PLACEHOLDERS[field] || `Enter your ${field}`;
}
function getAutoComplete(field: string) {
  return AUTOCOMPLETE_MAP[field];
}

interface SubmissionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

type AnyZodObject = z.ZodObject<any, any>;

interface AuthFormProps<TSchema extends AnyZodObject> {
  formType: "SIGN_IN" | "SIGN_UP";
  schema: TSchema;
  defaultValues: z.input<TSchema>; // Changed to z.input
  onSubmit: (data: z.output<TSchema>) => Promise<SubmissionResult>; // Use z.output for submission
  className?: string;
  disabled?: boolean;
}

// ---- COMPONENT ----
export default function AuthForm<TSchema extends AnyZodObject>({
  formType,
  schema,
  defaultValues,
  onSubmit,
  className = "",
  disabled = false,
}: AuthFormProps<TSchema>) {
  // Properly type the form with input, context, and output types
  const form = useForm<
    z.input<TSchema>, // Input type (what form fields expect)
    any, // Context type
    z.output<TSchema> // Output type (what gets passed to onSubmit)
  >({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [submissionError, setSubmissionError] = useState<string>("");
  const [submissionSuccess, setSubmissionSuccess] = useState<string>("");

  const handleSubmit: SubmitHandler<z.output<TSchema>> = async (data) => {
    setSubmissionError("");
    setSubmissionSuccess("");
    try {
      const result = await onSubmit(data);
      if (result.success) {
        setSubmissionSuccess(result.message || "Success!");
        if (formType === "SIGN_UP") {
          form.reset();
        }
      } else {
        setSubmissionError(
          result.message || "An error occurred. Please try again.",
        );
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            form.setError(field as Path<z.input<TSchema>>, {
              type: "server",
              message,
            });
          });
        }
      }
    } catch {
      setSubmissionError("An unexpected error occurred. Please try again.");
    }
  };

  const isPasswordField = (field: string) =>
    field.toLowerCase().includes("password");
  const togglePasswordVisibility = (field: string) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
  const loadingText =
    formType === "SIGN_IN" ? "Signing In..." : "Signing Up...";

  return (
    <div className={className}>
      <RHFFormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
          autoComplete="on"
          noValidate
        >
          {submissionError && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}
          {submissionSuccess && (
            <Alert
              variant="default"
              className="bg-green-50 border-green-200 text-green-800"
            >
              <AlertDescription>{submissionSuccess}</AlertDescription>
            </Alert>
          )}
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<z.input<TSchema>>}
              render={({ field: rhfField, fieldState }) => (
                <FormItem>
                  <FormLabel>{getLabel(field)}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...rhfField}
                        placeholder={getPlaceholder(field)}
                        type={
                          isPasswordField(field) && !showPassword[field]
                            ? "password"
                            : field === "email"
                              ? "email"
                              : "text"
                        }
                        autoComplete={getAutoComplete(field)}
                        disabled={disabled || form.formState.isSubmitting}
                        className={isPasswordField(field) ? "pr-10" : ""}
                        aria-describedby={
                          fieldState.error ? `${field}-error` : undefined
                        }
                        aria-invalid={!!fieldState.error}
                      />
                      {isPasswordField(field) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="top-0 right-0 absolute hover:bg-transparent px-3 py-2 h-full"
                          onClick={() => togglePasswordVisibility(field)}
                          disabled={disabled || form.formState.isSubmitting}
                          aria-label={
                            showPassword[field]
                              ? "Hide password"
                              : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showPassword[field] ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage id={`${field}-error`} />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="submit"
            className="w-full min-h-12 primary-gradient"
            disabled={
              disabled || form.formState.isSubmitting || !form.formState.isValid
            }
            aria-describedby={submissionError ? "submission-error" : undefined}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      </RHFFormProvider>
    </div>
  );
}
