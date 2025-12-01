import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PolyHubAI – AI vs Market Explorer",
  description:
    "Compare AI probabilities vs Polymarket market odds in a clean, read-only explorer.",
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
          <header className="relative z-20 border-b border-ov-border/70 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-ov-accent-soft to-ov-purple shadow-ov-glow">
                  <span className="text-xs font-black tracking-tight">PHA</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-tight">
                    PolyHubAI
                  </span>
                  <span className="text-[10px] font-medium text-ov-text-muted">
                    AI vs Market · Read-only
                  </span>
                </div>
              </Link>

              <nav className="flex items-center gap-3 text-xs font-medium">
                <Link
                  href="/markets"
                  className="rounded-full border border-ov-border/80 bg-black/40 px-3 py-1.5 text-xs text-ov-text-muted hover:border-ov-accent hover:text-white hover:shadow-ov-glow transition-all"
                >
                  Markets
                </Link>
                <Link
                  href="/agent-manager"
                  className="rounded-full border border-ov-border/80 bg-black/40 px-3 py-1.5 text-xs text-ov-text-muted hover:border-ov-accent hover:text-white hover:shadow-ov-glow transition-all"
                >
                  Agent Manager
                </Link>
              </nav>
            </div>
          </header>

          {/* Content */}
          <main className="relative z-10 flex-1">{children}</main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-ov-border/60 bg-black/50 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-[10px] text-ov-text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                Market data from Polymarket Gamma API. This UI is informational
                only and does not execute trades.
              </p>
              <div className="flex flex-col items-end gap-1 sm:items-end">
                <p className="text-[9px]">
                  Respect Polymarket&apos;s Terms of Service when using their
                  platform.
                </p>
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
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

