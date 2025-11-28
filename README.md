# PolyHubAI

An AI-powered prediction market explorer for Polymarket. Compare AI-generated probabilities with live market odds.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the project root:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Fetches live markets from Polymarket Gamma API
- Generates AI probabilities for selected markets using OpenAI
- Displays polished comparison UI with probability bars and reasoning
- Read-only interface (no trading, no wallet, no orders)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenAI API
- Polymarket Gamma API
