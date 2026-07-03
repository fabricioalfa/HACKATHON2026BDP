import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name required"),
  role: z.enum(["admin", "officer", "viewer"]),
  walletAddress: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().min(1).optional(),
  role: z.enum(["admin", "officer", "viewer"]).optional(),
  walletAddress: z.string().optional(),
  isActive: z.boolean().optional(),
});
