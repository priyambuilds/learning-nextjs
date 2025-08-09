import { z } from "zod";

// ========================
// REUSABLE VALIDATION PATTERNS
// ========================

const emailValidator = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email address is too long")
  .transform((email) => email.toLowerCase().trim());

const passwordValidator = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
  .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
  .regex(/^(?=.*\d)/, "Password must contain at least one number")
  .regex(
    /^(?=.*[@$!%*?&])/,
    "Password must contain at least one special character (@$!%*?&)",
  );

const nameValidator = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, apostrophes, and hyphens",
  )
  .transform((name) => name.trim());

const usernameValidator = z
  .string()
  .min(1, "Username is required")
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username cannot exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens",
  )
  .regex(/^[a-zA-Z]/, "Username must start with a letter")
  .transform((username) => username.toLowerCase().trim());

const urlValidator = z
  .string()
  .url("Please enter a valid URL")
  .max(2048, "URL is too long")
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }, "URL must use HTTP or HTTPS protocol");

const optionalUrlValidator = z
  .string()
  .optional()
  .refine(
    (url) => !url || urlValidator.safeParse(url).success,
    "Please enter a valid URL or leave empty",
  );

// ========================
// AUTHENTICATION SCHEMAS
// ========================

export const SignInSchema = z.object({
  email: emailValidator,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const SignUpSchema = z
  .object({
    name: nameValidator,
    username: usernameValidator,
    email: emailValidator,
    password: passwordValidator,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: emailValidator,
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordValidator,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordValidator,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// ========================
// OAUTH SCHEMAS
// ========================

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["github", "google", "discord", "twitter"]),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  user: z.object({
    name: nameValidator,
    username: usernameValidator,
    email: emailValidator,
    image: optionalUrlValidator,
  }),
});

export const AccountSchema = z.object({
  userId: z.string().cuid("Invalid user ID format"),
  name: nameValidator,
  image: optionalUrlValidator,
  password: passwordValidator.optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

// ========================
// USER MANAGEMENT SCHEMAS
// ========================

export const UserSchema = z.object({
  name: nameValidator,
  username: usernameValidator,
  email: emailValidator,
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  image: optionalUrlValidator,
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional(),
  portfolio: optionalUrlValidator,
  reputation: z
    .number()
    .int("Reputation must be a whole number")
    .min(0, "Reputation cannot be negative")
    .optional(),
});

export const UpdateProfileSchema = z.object({
  name: nameValidator,
  username: usernameValidator,
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  portfolio: z
    .string()
    .optional()
    .refine(
      (url) => !url || url === "" || urlValidator.safeParse(url).success,
      "Please enter a valid URL or leave empty",
    ),
});

export const GetUserSchema = z.object({
  userId: z.string().cuid("Invalid user ID format"),
});

// ========================
// QUESTION & ANSWER SCHEMAS
// ========================

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(130, "Title cannot exceed 130 characters")
    .transform((title) => title.trim()),
  content: z
    .string()
    .min(1, "Content is required")
    .min(100, "Content must be at least 100 characters")
    .max(50000, "Content cannot exceed 50,000 characters"),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag cannot be empty")
        .max(15, "Tag cannot exceed 15 characters")
        .regex(/^[a-zA-Z0-9-+#.]+$/, "Tag contains invalid characters")
        .transform((tag) => tag.toLowerCase().trim()),
    )
    .min(1, "At least one tag is required")
    .max(5, "Maximum of 5 tags allowed")
    .refine(
      (tags) => new Set(tags).size === tags.length,
      "Duplicate tags are not allowed",
    ),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().cuid("Invalid question ID format"),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().cuid("Invalid question ID format"),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string().cuid("Invalid question ID format"),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(1, "Answer content is required")
    .min(100, "Answer must be at least 100 characters")
    .max(50000, "Answer cannot exceed 50,000 characters"),
});

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().cuid("Invalid question ID format"),
});

export const DeleteAnswerSchema = z.object({
  answerId: z.string().cuid("Invalid answer ID format"),
});

// ========================
// SEARCH & PAGINATION SCHEMAS
// ========================

export const PaginatedSearchParamsSchema = z.object({
  page: z
    .number()
    .int("Page must be a whole number")
    .min(1, "Page must be at least 1")
    .max(1000, "Page cannot exceed 1000")
    .default(1),
  pageSize: z
    .number()
    .int("Page size must be a whole number")
    .min(1, "Page size must be at least 1")
    .max(100, "Page size cannot exceed 100")
    .default(10),
  query: z.string().max(200, "Search query is too long").optional(),
  filter: z.string().max(50, "Filter is too long").optional(),
  sort: z.enum(["newest", "oldest", "popular", "votes", "answers"]).optional(),
});

export const GlobalSearchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(200, "Search query is too long")
    .transform((query) => query.trim()),
  type: z.enum(["question", "answer", "user", "tag"]).optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().cuid("Invalid tag ID format"),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().cuid("Invalid user ID format"),
});

export const GetUsersAnswersSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().cuid("Invalid user ID format"),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().cuid("Invalid question ID format"),
});

// ========================
// INTERACTION SCHEMAS
// ========================

export const CreateVoteSchema = z.object({
  targetId: z.string().cuid("Invalid target ID format"),
  targetType: z.enum(["question", "answer"]),
  voteType: z.enum(["upvote", "downvote"]),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z
    .number()
    .int("Change must be a whole number")
    .min(-1, "Change must be -1 or 1")
    .max(1, "Change must be -1 or 1")
    .refine((val) => val === -1 || val === 1, "Change must be exactly -1 or 1"),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().cuid("Invalid question ID format"),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().cuid("Invalid question ID format"),
});

export const CreateInteractionSchema = z.object({
  action: z.enum([
    "view",
    "upvote",
    "downvote",
    "bookmark",
    "post",
    "edit",
    "delete",
    "search",
    "comment",
    "share",
  ]),
  actionTarget: z.enum(["question", "answer", "user", "tag"]),
  actionId: z.string().cuid("Invalid action ID format"),
  authorId: z.string().cuid("Invalid author ID format"),
});

// ========================
// AI SCHEMAS
// ========================

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(130, "Question cannot exceed 130 characters")
    .transform((question) => question.trim()),
  content: z
    .string()
    .min(1, "Content is required")
    .min(100, "Content must be at least 100 characters")
    .max(10000, "Content cannot exceed 10,000 characters"),
  userAnswer: z.string().max(50000, "User answer is too long").optional(),
});

export const GetUserTagsSchema = z.object({
  userId: z.string().cuid("Invalid user ID format"),
});

// ========================
// TYPE EXPORTS
// ========================

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type SignInWithOAuthData = z.infer<typeof SignInWithOAuthSchema>;
export type AccountData = z.infer<typeof AccountSchema>;
export type UserData = z.infer<typeof UserSchema>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
export type AskQuestionData = z.infer<typeof AskQuestionSchema>;
export type EditQuestionData = z.infer<typeof EditQuestionSchema>;
export type AnswerData = z.infer<typeof AnswerSchema>;
export type AnswerServerData = z.infer<typeof AnswerServerSchema>;
export type PaginatedSearchParamsData = z.infer<
  typeof PaginatedSearchParamsSchema
>;
export type GlobalSearchData = z.infer<typeof GlobalSearchSchema>;
export type CreateVoteData = z.infer<typeof CreateVoteSchema>;
export type UpdateVoteCountData = z.infer<typeof UpdateVoteCountSchema>;
export type CreateInteractionData = z.infer<typeof CreateInteractionSchema>;
export type AIAnswerData = z.infer<typeof AIAnswerSchema>;

// ========================
// VALIDATION UTILITIES
// ========================

export const validateEmail = (email: string): boolean => {
  return emailValidator.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordValidator.safeParse(password).success;
};

export const validateUsername = (username: string): boolean => {
  return usernameValidator.safeParse(username).success;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, " ");
};

export const getPasswordStrength = (
  password: string,
): { score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("One lowercase letter");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("One uppercase letter");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("One number");

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push("One special character");

  return { score, feedback };
};
