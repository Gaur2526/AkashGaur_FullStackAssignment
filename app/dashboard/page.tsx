import Link from "next/link";
import { requireUser } from "@/lib/auth/require-user";
import { formatRole } from "@/lib/documents/permissions";
import { getDocumentsForUser } from "@/lib/documents/queries";
import { CreateDocumentForm } from "./create-document-form";

export default async function DashboardPage() {
  const user = await requireUser();
  const documents = await getDocumentsForUser(user.id);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Welcome back, {user.name ?? user.email}.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CreateDocumentForm />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-zinc-900">Your documents</h2>

        {documents.length === 0 ? (
          <div className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-600">
            No documents yet. Create one to get started.
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            {documents.map((document) => (
              <li key={document.id}>
                <Link
                  href={`/documents/${document.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-zinc-50"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{document.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Updated {document.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {formatRole(document.role)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
