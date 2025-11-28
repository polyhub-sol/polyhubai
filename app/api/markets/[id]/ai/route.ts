import { NextResponse } from "next/server";
import { fetchMarketByIdFromGamma } from "@/lib/polymarket";
import OpenAI from "openai";

type Params = { params: { id: string } };

/**
 * Normalizes outcome prices to probabilities that sum to 1.0.
 * Handles edge cases where prices sum to zero by distributing evenly.
 */
function normalizeMarketProbabilities(
  outcomes: { label: string; price: number }[]
) {
  const total = outcomes.reduce((sum, o) => sum + Math.max(o.price, 0), 0);
  if (total <= 0) {
    const n = outcomes.length || 1;
    return Object.fromEntries(outcomes.map((o) => [o.label, 1 / n]));
  }
  return Object.fromEntries(
    outcomes.map((o) => [o.label, Math.max(o.price, 0) / total])
  );
}

/**
 * POST /api/markets/[id]/ai
 * Generates AI analysis for a market using OpenAI.
 * Returns probabilities, reasoning, bullet points, and sources.
 */
export async function POST(_: Request, { params }: Params) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({ error: "OPENAI_API_KEY environment variable is not set" }),
      { status: 500 }
    );
  }

  const market = await fetchMarketByIdFromGamma(params.id);
  if (!market) {
    return new NextResponse(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  const client = new OpenAI({
    apiKey,
  });

  // Normalize market probabilities so they sum to ~1.0 for comparison with AI probabilities
  const marketProbs = normalizeMarketProbabilities(market.outcomes);

  const messages = [
    {
      role: "system" as const,
      content:
        "You are an expert forecaster analyzing real-money prediction markets. " +
        "You are given a question and current implied probabilities for each outcome. " +
        "Return your own probabilities (must sum to 1), plus reasoning and brief bullet points. " +
        "Return JSON ONLY with keys: ai_probabilities, reasoning, bullet_points, sources. " +
        "Do not give betting or investment advice.",
    },
    {
      role: "user" as const,
      content:
        `Question: ${market.question}\n` +
        `Category: ${market.category ?? "Unknown"}\n` +
        `End date: ${market.end_date ?? "Unknown"}\n` +
        `Outcomes and current market probabilities:\n` +
        Object.entries(marketProbs)
          .map(([label, p]) => `- ${label}: ${p.toFixed(3)}`)
          .join("\n"),
    },
  ];

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.4,
    });
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ error: `OpenAI API error: ${e?.message ?? "Unknown error"}` }),
      { status: 500 }
    );
  }

  const raw = completion.choices[0].message.content ?? "{}";
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    data = {};
  }

  const ai_probs_raw = data.ai_probabilities ?? {};
  const bullet_points = data.bullet_points ?? [];
  const reasoning = data.reasoning ?? "No reasoning provided.";
  const sources_raw = data.sources ?? [];

  const labels = market.outcomes.map((o) => o.label);
  const aiClean: Record<string, number> = {};
  for (const [label, value] of Object.entries(ai_probs_raw)) {
    if (!labels.includes(label)) continue;
    const v = Number(value);
    if (!Number.isFinite(v) || v < 0) continue;
    aiClean[label] = v;
  }

  let total = Object.values(aiClean).reduce((sum, v) => sum + v, 0);
  if (total <= 0) {
    Object.assign(aiClean, marketProbs);
    total = 1;
  }
  for (const key of Object.keys(aiClean)) {
    aiClean[key] = aiClean[key] / total;
  }

  const edge: Record<string, number> = {};
  for (const label of labels) {
    const ai = aiClean[label] ?? 0;
    const mkt = marketProbs[label] ?? 0;
    edge[label] = ai - mkt;
  }

  const sources = (sources_raw || []).map((s: any) => ({
    title: String(s?.title ?? "Source"),
    url: String(s?.url ?? ""),
  }));

  return NextResponse.json({
    ai_probabilities: aiClean,
    market_probabilities: marketProbs,
    edge,
    reasoning,
    bullet_points,
    sources,
  });
}

