// src/lib/security.ts
import { NextRequest } from "next/server";

interface SecurityValidation {
  isValid: boolean;
  reason?: string;
}

export async function validateRequest(
  request: NextRequest,
): Promise<SecurityValidation> {
  const userAgent = request.headers.get("user-agent");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Block suspicious user agents
  const suspiciousAgents = [
    "curl",
    "wget",
    "python",
    "scrapy",
    "bot",
    "crawler",
    "scanner",
    "nikto",
    "sqlmap",
    "nmap",
  ];

  if (
    userAgent &&
    suspiciousAgents.some((agent) => userAgent.toLowerCase().includes(agent))
  ) {
    return { isValid: false, reason: "Suspicious user agent" };
  }

  // Validate origin for POST requests
  if (request.method === "POST") {
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      "http://localhost:3000",
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin)) {
      return { isValid: false, reason: "Invalid origin" };
    }
  }

  // Check for common attack patterns in URL
  const pathname = request.nextUrl.pathname;
  const attackPatterns = [
    "../",
    "..\\",
    "%2e%2e",
    "%252e",
    "script>",
    "<script",
    "javascript:",
    "vbscript:",
    "onload=",
    "onerror=",
    "union+select",
    "drop+table",
    "insert+into",
  ];

  if (
    attackPatterns.some((pattern) =>
      pathname.toLowerCase().includes(pattern.toLowerCase()),
    )
  ) {
    return { isValid: false, reason: "Malicious pattern detected" };
  }

  return { isValid: true };
}
