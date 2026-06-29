import { db } from "@/lib/db";

export async function getDocumentsForUser(userId: string) {
  const memberships = await db.documentMember.findMany({
    where: { userId },
    include: {
      document: {
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      document: {
        updatedAt: "desc",
      },
    },
  });

  return memberships.map((membership) => ({
    id: membership.document.id,
    title: membership.document.title,
    role: membership.role,
    updatedAt: membership.document.updatedAt,
  }));
}

export async function getDocumentMembership(userId: string, documentId: string) {
  return db.documentMember.findUnique({
    where: {
      documentId_userId: {
        documentId,
        userId,
      },
    },
    include: {
      document: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });
}
