import { z } from "zod";

export const issueCertificateSchema = z.object({
  holderName: z.string().min(1, "Holder name required"),
  holderDocument: z.string().min(1, "Document required"),
  holderEmail: z.string().email().optional().or(z.literal("")),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["USD", "EUR", "PEN"]).optional(),
  description: z.string().optional(),
  documentData: z.string().min(1, "Document data required"),
  metadata: z.record(z.any()).optional(),
});
