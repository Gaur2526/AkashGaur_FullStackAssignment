"use server";

import { DocumentRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { canManageMembers } from "@/lib/documents/permissions";
import { getDocumentMembership } from "@/lib/documents/queries";
import { db } from "@/lib/db";
import { addMemberSchema, updateMemberRoleSchema } from "@/lib/validations/document";

export type AddMemberState = {
  error?: string;
  success?: string;
};

export async function addMemberAction(
  _prevState: AddMemberState,
  formData: FormData,
): Promise<AddMemberState> {
  const user = await requireUser();

  const parsed = addMemberSchema.safeParse({
    documentId: formData.get("documentId"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const membership = await getDocumentMembership(user.id, parsed.data.documentId);

  if (!membership || !canManageMembers(membership.role)) {
    return { error: "Only the document owner can add members" };
  }

  const invitedUser = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!invitedUser) {
    return { error: "No user found with that email. They need to sign up first." };
  }

  if (invitedUser.id === user.id) {
    return { error: "You are already a member of this document" };
  }

  const existingMembership = await db.documentMember.findUnique({
    where: {
      documentId_userId: {
        documentId: parsed.data.documentId,
        userId: invitedUser.id,
      },
    },
  });

  if (existingMembership) {
    return {
      error: "That user is already a member. Change their role in the members list below.",
    };
  }

  await db.documentMember.create({
    data: {
      documentId: parsed.data.documentId,
      userId: invitedUser.id,
      role: parsed.data.role,
    },
  });

  revalidatePath(`/documents/${parsed.data.documentId}`);

  return { success: `${invitedUser.email} added as ${parsed.data.role.toLowerCase()}.` };
}

export async function updateMemberRoleAction(formData: FormData) {
  const user = await requireUser();

  const parsed = updateMemberRoleSchema.safeParse({
    documentId: formData.get("documentId"),
    memberId: formData.get("memberId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect(`/documents/${formData.get("documentId")}`);
  }

  const membership = await getDocumentMembership(user.id, parsed.data.documentId);

  if (!membership || !canManageMembers(membership.role)) {
    redirect(`/documents/${parsed.data.documentId}`);
  }

  const targetMember = await db.documentMember.findFirst({
    where: {
      id: parsed.data.memberId,
      documentId: parsed.data.documentId,
      role: { not: DocumentRole.OWNER },
    },
  });

  if (!targetMember) {
    redirect(`/documents/${parsed.data.documentId}`);
  }

  await db.documentMember.update({
    where: { id: targetMember.id },
    data: { role: parsed.data.role },
  });

  revalidatePath(`/documents/${parsed.data.documentId}`);
  redirect(`/documents/${parsed.data.documentId}`);
}

export async function deleteDocumentAction(formData: FormData) {
  const user = await requireUser();
  const documentId = formData.get("documentId");

  if (typeof documentId !== "string" || !documentId) {
    redirect("/dashboard");
  }

  const membership = await getDocumentMembership(user.id, documentId);

  if (!membership || membership.role !== "OWNER") {
    redirect(`/documents/${documentId}`);
  }

  await db.document.delete({
    where: { id: documentId },
  });

  redirect("/dashboard");
}
