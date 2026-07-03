import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name required"),
  role: z.enum(["admin", "officer", "viewer"]).optional(),
  walletAddress: z.string().optional(),
});
