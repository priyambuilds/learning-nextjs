// src/app/api/auth/[...nextauth]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { validateRequest } from "@/lib/security";

// ---- Security headers ----
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// ---- CORS headers ----
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXTAUTH_URL || "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

async function handleAuthRequest(
  request: NextRequest,
  context: { params: { nextauth: string[] } },
  method: "GET" | "POST",
) {
  const startTime = Date.now();
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip =
    request.headers.get("x-forwarded-for") || (request as any).ip || "unknown";
  const pathname = request.nextUrl.pathname;

  try {
    // ---- Security check ----
    const securityCheck = await validateRequest(request);
    if (!securityCheck.isValid) {
      logger.warn("Security validation failed", {
        ip,
        userAgent,
        reason: securityCheck.reason,
        pathname,
      });

      return new NextResponse("Forbidden", {
        status: 403,
        headers: securityHeaders,
      });
    }

    // ---- Rate limit ----
    const { success, limit, remaining, reset } = await checkRateLimit(ip);
    if (!success) {
      logger.warn("Rate limit exceeded", {
        ip,
        userAgent,
        pathname,
        limit,
        remaining,
      });

      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          ...securityHeaders,
          "Retry-After": Math.round((reset - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }

    // ---- Handle Auth Request ----
    logger.info(`Auth ${method} request`, {
      ip,
      userAgent,
      pathname,
      provider: context.params.nextauth[0],
      action: context.params.nextauth[1],
    });

    const handler = method === "GET" ? handlers.GET : handlers.POST;
    const response = await handler(request);
    // ---- Add headers ----
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    // ---- Log successful response ----
    const duration = Date.now() - startTime;
    logger.info(`Auth ${method} response`, {
      ip,
      userAgent,
      pathname,
      status: response.status,
      duration,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Auth request failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      ip,
      userAgent,
      pathname,
      method,
      duration,
    });

    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: {
        ...securityHeaders,
        "Content-Type": "application/json",
      },
    });
  }
}

// ---- GET handler ----
export async function GET(
  request: NextRequest,
  context: { params: { nextauth: string[] } },
) {
  return handleAuthRequest(request, context, "GET");
}

// ---- POST handler ----
export async function POST(
  request: NextRequest,
  context: { params: { nextauth: string[] } },
) {
  return handleAuthRequest(request, context, "POST");
}

// ---- OPTIONS handler (CORS preflight) ----
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      ...securityHeaders,
    },
  });
}

// ---- Next.js Edge runtime config (optional) ----
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
