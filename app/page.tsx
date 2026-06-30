export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-zinc-500">
        Secure collaborative writing
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Local-first collaborative document editor
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
        Create shared documents, keep writing offline, sync changes in the
        background, and restore earlier versions when you need them.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
        <p className="font-medium text-zinc-900">Stack</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Next.js 16 (App Router)</li>
          <li>PostgreSQL + Prisma</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>
    </div>
  );
}
