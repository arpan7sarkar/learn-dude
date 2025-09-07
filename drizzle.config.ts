"use server";
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default {
  dialect: "postgresql",
  schema: "./dbConnect/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;