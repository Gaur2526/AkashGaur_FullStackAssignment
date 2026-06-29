import Link from "next/link";
import { auth, signOut } from "@/auth";

async function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="text-sm text-zinc-600 hover:text-zinc-900"
      >
        Sign out
      </button>
    </form>
  );
}

export async function AuthNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <nav className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-600 sm:inline">
        {session.user.email}
      </span>
      <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">
        Dashboard
      </Link>
      <SignOutButton />
    </nav>
  );
}
