import { DocumentRole } from "@prisma/client";
import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),
});

export const addMemberSchema = z.object({
  documentId: z.string().min(1),
  email: z.string().email("Enter a valid email address"),
  role: z.enum([DocumentRole.EDITOR, DocumentRole.VIEWER]),
});

export const updateMemberRoleSchema = z.object({
  documentId: z.string().min(1),
  memberId: z.string().min(1),
  role: z.enum([DocumentRole.EDITOR, DocumentRole.VIEWER]),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
