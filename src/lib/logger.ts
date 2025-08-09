// src/lib/logger.ts
import winston from "winston";

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: "auth-api",
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),

    // File transport for production
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/auth-error.log",
            level: "error",
          }),
          new winston.transports.File({
            filename: "logs/auth-combined.log",
          }),
        ]
      : []),
  ],
});

// Add external logging services in production
if (process.env.NODE_ENV === "production") {
  // Add DataDog, LogRocket, or other services here
  if (process.env.DATADOG_API_KEY) {
    // Configure DataDog transport
  }
}
