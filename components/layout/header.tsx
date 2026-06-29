import Link from "next/link";
import { AuthNav } from "@/components/auth/auth-nav";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          Collab Editor
        </Link>
        <AuthNav />
      </div>
    </header>
  );
}
