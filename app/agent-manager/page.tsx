export default function AgentManagerPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        <div className="mb-6">
          <h1 className="text-lg font-semibold tracking-tight">Agent Manager</h1>
          <p className="text-[11px] text-ov-text-muted/90 mt-1">
            Manage and configure your AI trading agents
          </p>
        </div>

        <div className="space-y-6">
        {/* Orders Section */}
        <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Orders</h2>
              <p className="text-[11px] text-ov-text-muted/90 mt-0.5">
                View and manage your trading orders
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-ov-border/50 text-ov-text-muted">
                  <th className="px-4 py-3 text-left font-semibold">Market</th>
                  <th className="px-4 py-3 text-left font-semibold">Outcome</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ov-border/25 text-ov-text-muted">
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="h-8 w-8 text-ov-text-muted/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm text-ov-text-muted/95">
                        No orders yet. Orders will appear here once trading is enabled.
                      </p>
                      <p className="text-[10px] text-ov-text-muted/70">
                        Coming soon: Submit orders directly from market analysis pages
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent Management Section */}
        <div className="rounded-2xl border border-ov-border/55 bg-black/55 p-6 shadow-ov-soft">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-tight">
              AI Trading Agents
            </h2>
            <p className="text-[11px] text-ov-text-muted/90 mt-0.5">
              Create and configure automated trading agents
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-ov-border/55 bg-black/40 p-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-ov-text-muted/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-4 text-sm text-ov-text-muted">
              Agent Management coming soon
            </p>
            <p className="mt-1 text-[10px] text-ov-text-muted/70">
              Configure agents to automatically execute trades based on AI vs market
              edge analysis
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-2xl border border-ov-border/75 bg-black/90 backdrop-blur-xl p-8 shadow-ov-glow text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-ov-accent-soft to-ov-purple shadow-ov-glow">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-semibold tracking-tight text-white">
              Coming Soon
            </h2>
            <p className="text-sm text-ov-text-muted">
              Agent Manager is currently under development. Check back soon for automated trading agents and advanced configuration options.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-ov-text-muted/70">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Stay tuned for updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
