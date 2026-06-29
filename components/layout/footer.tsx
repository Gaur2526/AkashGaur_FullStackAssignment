export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Built by Akash Gaur</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/Gaur2526"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/akash-gaur-295936227/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
