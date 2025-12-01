export default function AgentManagerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
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
  );
}
