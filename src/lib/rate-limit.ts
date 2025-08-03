import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Upstash Redis instance. Ensure your environment variables are set.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a single global rate limiter instance
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute sliding window
  analytics: true,
});

// This function checks the rate limit for the provided identifier (e.g., IP, userId)
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  try {
    const result = await authRateLimit.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // If Upstash/Redis fails, warn (but allow the request)
    console.warn("Upstash rate limiting failed, allowing request", error);
    return {
      success: true,
      limit: 1000,
      remaining: 1000,
      reset: Date.now() + 60_000,
    };
  }
}
