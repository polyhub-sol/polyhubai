/**
 * Represents a market outcome with its label and current price (probability).
 */
export type OutcomePrice = {
  label: string;
  price: number;
};

export interface MarketSummary {
  id: string;
  question: string;

  /**
   * Primary slug used for frontend links:
   * - Prefer the EVENT slug (m.events[0].slug), which matches /event/{slug}
   *   and correctly redirects to sports pages when relevant.
   * - Fall back to the market slug if no event slug exists.
   */
  slug: string | null;

  /**
   * Optional: raw market slug from Gamma (for debugging / future use).
   * Not required by the UI, but useful to keep around.
   */
  marketSlug?: string | null;

  category?: string | null;
  end_date?: string | null;
  volume?: number | null;
  image?: string | null;
  outcomes: OutcomePrice[];
  active: boolean;
}

// Polymarket Gamma API base URL for fetching market data
const GAMMA_BASE_URL = "https://gamma-api.polymarket.com";

function parseOutcomes(outcomesRaw: any, pricesRaw: any): OutcomePrice[] {
  try {
    if (typeof outcomesRaw === "string") outcomesRaw = JSON.parse(outcomesRaw);
  } catch {
    outcomesRaw = [];
  }
  try {
    if (typeof pricesRaw === "string") pricesRaw = JSON.parse(pricesRaw);
  } catch {
    pricesRaw = [];
  }
  outcomesRaw = outcomesRaw || [];
  pricesRaw = pricesRaw || [];
  // Map outcomes array to OutcomePrice objects
  // Match each outcome label with its corresponding price by index
  // Ensure prices are valid numbers (default to 0 if invalid)
  return outcomesRaw.map((label: any, i: number) => {
    const rawPrice = pricesRaw[i] ?? 0;
    const price = Number(rawPrice) || 0;
    return { label: String(label), price };
  });
}

/**
 * Fetches active markets from Polymarket Gamma API.
 * @param limit - Maximum number of markets to fetch (default: 40)
 * @returns Array of market summaries sorted by volume
 */
export async function fetchMarketsFromGamma(limit = 40): Promise<MarketSummary[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    closed: "false",
    active: "true",
    order: "volume",
    ascending: "false",
  });

  const res = await fetch(`${GAMMA_BASE_URL}/markets?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gamma error: ${res.status}`);
  }
  const raw = await res.json();

  return (raw || []).map((m: any): MarketSummary => {
    const eventSlug =
      Array.isArray(m.events) && m.events.length > 0 && m.events[0]?.slug
        ? String(m.events[0].slug)
        : null;

    // Build MarketSummary object from Gamma API response
    return {
      id: String(m.id),
      question: m.question ?? "",

      // IMPORTANT: use EVENT slug first (for /event/{slug} URLs),
      // then fall back to the market's own slug.
      slug: eventSlug ?? (m.slug ? String(m.slug) : null),

      // Keep the underlying market slug separately for debugging / future logic.
      marketSlug: m.slug ? String(m.slug) : null,

      category: m.category ?? null,
      end_date: m.endDate ?? null,
      volume: m.volume != null ? Number(m.volume) : null,
      image: m.image ?? m.icon ?? null,
      outcomes: parseOutcomes(m.outcomes, m.outcomePrices),
      active: Boolean(m.active ?? true),
    };
  });
}

/**
 * Fetches a single market by ID from Polymarket Gamma API.
 * @param id - Market ID to fetch
 * @returns Market summary or null if not found
 */
export async function fetchMarketByIdFromGamma(
  id: string
): Promise<MarketSummary | null> {
  const markets = await fetchMarketsFromGamma(200);
  return markets.find((m) => m.id === id) ?? null;
}

/**
 * Builds a Polymarket URL for a given market.
 * Uses event slug if available, otherwise falls back to market slug or search query.
 */
export function buildPolymarketUrl(market: MarketSummary): string {
  const base = "https://polymarket.com";

  // Priority 1: Use event slug (most reliable, works for sports markets)
  if (market.slug && market.slug.trim().length > 0) {
    return `${base}/event/${market.slug}`;
  }

  // Priority 2: Fall back to market slug if event slug unavailable
  // Note: may 404 for some sports markets, but better than nothing
  if (market.marketSlug && market.marketSlug.trim().length > 0) {
    return `${base}/event/${market.marketSlug}`;
  }

  // Priority 3: Final fallback - search by question text
  // Ensures user always lands somewhere useful on Polymarket
  const query = encodeURIComponent(market.question.trim());
  return `${base}/search?q=${query}`;
}

