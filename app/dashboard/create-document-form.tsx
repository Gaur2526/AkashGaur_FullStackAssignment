"use client";

import { useActionState } from "react";
import { createDocumentAction, type CreateDocumentState } from "./actions";

const initialState: CreateDocumentState = {};

export function CreateDocumentForm() {
  const [state, formAction, pending] = useActionState(
    createDocumentAction,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-4">
      <label htmlFor="title" className="block text-sm font-medium text-zinc-900">
        New document
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Untitled document"
          required
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 sm:shrink-0"
        >
          {pending ? "Creating..." : "Create"}
        </button>
      </div>
      {state.error ? (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      ) : null}
    </form>
  );
}
