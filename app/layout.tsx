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
              <p className="text-[9px]">
                Respect Polymarket&apos;s Terms of Service when using their
                platform.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

