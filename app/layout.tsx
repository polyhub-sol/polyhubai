import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PolyHubAI – AI vs Market Explorer",
  description:
    "Compare AI probabilities vs Polymarket market odds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ov-bg text-white">
        <div className="relative min-h-screen flex flex-col">
          {/* Glow background */}
          <div className="pointer-events-none fixed inset-0 opacity-60">
            <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-ov-accent blur-3xl opacity-20" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-ov-purple blur-3xl opacity-25" />
          </div>

          {/* Navbar */}
          <header className="relative z-20 border-b border-ov-border/65 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" title="Home - PolyHubAI" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-ov-accent-soft to-ov-purple shadow-ov-glow">
                  <span className="text-xs font-black tracking-tight">PHA</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-tight">
                    PolyHubAI
                  </span>
                  <span className="text-[10px] font-medium text-ov-text-muted">
                    AI vs Market
                  </span>
                </div>
              </Link>

              <nav className="flex items-center gap-3 text-xs font-medium">
                <Link
                  href="/markets"
                  title="Browse active prediction markets"
                  className="rounded-full border border-ov-border/75 bg-black/40 px-3 py-1.5 text-xs text-ov-text-muted hover:border-ov-accent hover:text-white hover:shadow-ov-glow transition-all"
                >
                  Markets
                </Link>
                <Link
                  href="/agent-manager"
                  title="Manage trading agents (coming soon)"
                  className="rounded-full border border-ov-border/75 bg-black/40 px-3 py-1.5 text-xs text-ov-text-muted hover:border-ov-accent hover:text-white hover:shadow-ov-glow transition-all"
                >
                  Agent Manager
                </Link>
              </nav>
            </div>
          </header>

          {/* Content */}
          <main className="relative z-10 flex-1">{children}</main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-ov-border/55 bg-black/50 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-[10px] text-ov-text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                Market data from Polymarket Gamma API.
              </p>
              <div className="flex flex-col items-end gap-1 sm:items-end">

                <div className="flex items-center gap-3">
                  <a
                    href="https://x.com/PolyHubAI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] text-ov-text-muted hover:text-ov-accent transition-colors"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M13.482 10.577v3.844h2.496c-.19 1.22-.713 2.252-1.567 3.097-1.027 1.028-2.496 1.542-4.406 1.542-3.487 0-6.22-2.608-6.22-6.22 0-3.487 2.733-6.22 6.22-6.22 1.853 0 3.358.713 4.52 2.139l1.937-1.937C14.913 3.486 12.947 2.51 10.005 2.51c-5.168 0-9.229 4.061-9.229 9.23 0 5.168 4.061 9.229 9.229 9.229 4.787 0 8.405-3.298 9.352-7.748H22v-5.844h-8.518z" />
                    </svg>
                    <span>@PolyHubAI</span>
                  </a>
                  <a
                    href="https://github.com/polyhub-sol/polyhubai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] text-ov-text-muted hover:text-ov-accent transition-colors"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

