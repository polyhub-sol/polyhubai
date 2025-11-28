import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section: Main landing page content */}
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Who&apos;s smarter:
            <span className="block bg-gradient-to-r from-ov-accent-soft to-ov-purple bg-clip-text text-transparent">
              the crowd or the model?
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-ov-text-muted">
            PolyHubAI lets you explore live Polymarket questions and compare
            current market odds to a structured AI forecast. It&apos;s an
            experimental research tool, not a trading interface.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/markets"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-ov-accent-soft to-ov-purple px-5 py-2 text-sm font-semibold text-black shadow-ov-glow transition-all hover:shadow-ov-glow/80 hover:scale-[1.02]"
            >
              Explore markets
            </Link>
            <span className="text-[11px] text-ov-text-muted">
              No wallet. No trades. Pure insight.
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative overflow-hidden rounded-3xl border border-ov-border/80 bg-gradient-to-br from-black/80 via-ov-bg-soft/90 to-black/90 p-4 shadow-ov-soft">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0,_rgba(34,211,238,0.18)_0,_transparent_50%),radial-gradient(circle_at_80%_100%,_rgba(168,85,247,0.2)_0,_transparent_50%)]" />
            <div className="relative space-y-4">
              <p className="text-xs font-semibold text-ov-text-muted">
                Example snapshot
              </p>
              <div className="space-y-2 rounded-2xl border border-ov-border/60 bg-black/60 p-3">
                <p className="text-[11px] text-ov-text-muted">Question</p>
                <p className="text-sm font-semibold">
                  Will BTC close above $100K by year-end?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-1 rounded-2xl border border-ov-border/60 bg-black/60 p-3">
                  <p className="text-ov-text-muted">Market odds</p>
                  <p className="font-semibold text-purple-300">Yes · 42%</p>
                  <p className="font-semibold text-purple-300">No · 58%</p>
                </div>
                <div className="space-y-1 rounded-2xl border border-ov-border/60 bg-black/60 p-3">
                  <p className="text-ov-text-muted">AI view</p>
                  <p className="font-semibold text-cyan-300">Yes · 55%</p>
                  <p className="font-semibold text-cyan-300">No · 45%</p>
                </div>
              </div>
              <p className="text-[10px] text-ov-text-muted">
                For research and curiosity only. Trading on Polymarket is
                subject to their Terms of Service and jurisdictional
                restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Section: Describes upcoming features like embedded wallets and auto-trading */}
      <section className="border-t border-ov-border/60 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-9">
          <div className="relative overflow-hidden rounded-3xl border border-ov-border/80 bg-gradient-to-br from-black/85 via-ov-bg-soft/95 to-black/90 p-5 shadow-ov-soft">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-ov-accent/20 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-ov-purple/25 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
              {/* Left: copy */}
              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-ov-border/70 bg-black/70 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                    Coming soon · PolyHubAI upgrades
                  </span>
                </div>

                <h2 className="text-lg font-semibold tracking-tight">
                  From research terminal to{" "}
                  <span className="bg-gradient-to-r from-ov-accent-soft to-ov-purple bg-clip-text text-transparent">
                    auto-trading cockpit
                  </span>
                  .
                </h2>

                <p className="text-sm leading-relaxed text-ov-text-muted">
                  Today, PolyHubAI is a clean, read-only layer on top of
                  Polymarket. Next, we&apos;re wiring in embedded wallets and
                  agent-driven auto trading so you can go from &quot;this looks
                  mispriced&quot; to &quot;execute my play like this&quot; in
                  one place.
                </p>

                <div className="grid gap-3 text-[11px] md:grid-cols-3">
                  <div className="space-y-1 rounded-2xl border border-ov-border/70 bg-black/70 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ov-text-muted">
                      Embedded wallets
                    </p>
                    <p className="text-ov-text-muted">
                      Custodial, in-app wallets so new users can spin up an
                      account, deposit, and route volume without juggling seed
                      phrases or extensions.
                    </p>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-ov-border/70 bg-black/70 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ov-text-muted">
                      Auto trading agents
                    </p>
                    <p className="text-ov-text-muted">
                      Configurable agents that watch selected markets, compare
                      AI vs market edges, and prepare orders according to your
                      rules, risk limits, and sizing logic.
                    </p>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-ov-border/70 bg-black/70 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ov-text-muted">
                      One interface, full loop
                    </p>
                    <p className="text-ov-text-muted">
                      Research the edge, simulate strategies, and eventually
                      send real orders from the same surface – with clear logs,
                      P&amp;L views, and safety rails.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: tiny roadmap */}
              <div className="flex-1 md:max-w-xs">
                <div className="space-y-3 rounded-2xl border border-ov-border/80 bg-black/80 p-4">
                  <p className="text-[11px] font-semibold text-ov-text-muted uppercase tracking-wide">
                    Upgrade roadmap
                  </p>
                  <ul className="space-y-2 text-[11px] text-ov-text-muted">
                    <li className="flex gap-2">
                      <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-ov-accent-soft" />
                      <span>
                        <span className="font-semibold text-slate-200">
                          Phase 1 – Now:
                        </span>{" "}
                        Read-only AI vs market explorer on top of Polymarket
                        Gamma.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-ov-accent-soft" />
                      <span>
                        <span className="font-semibold text-slate-200">
                          Phase 2 – Coming Soon:
                        </span>{" "}
                        Embedded wallets, account abstraction, and basic
                        strategy templates (no manual key juggling).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-ov-accent-soft" />
                      <span>
                        <span className="font-semibold text-slate-200">
                          Phase 3 – Experimental:
                        </span>{" "}
                        Agent-powered auto trading with configurable playbooks,
                        risk controls, and detailed execution logs.
                      </span>
                    </li>
                  </ul>
                  <p className="pt-1 text-[10px] text-ov-text-muted">
                    Auto trading and embedded wallets are not live yet. Final
                    features, jurisdictions, and integrations will depend on
                    compliance and partner constraints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
