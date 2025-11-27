import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ov-bg": "#050814",
        "ov-bg-soft": "#070b1a",
        "ov-border": "#1f2937",
        "ov-accent": "#22d3ee",
        "ov-accent-soft": "#0ea5e9",
        "ov-purple": "#a855f7",
        "ov-text-muted": "#9ca3af",
      },
      boxShadow: {
        "ov-soft": "0 20px 50px rgba(15, 23, 42, 0.9)",
        "ov-glow": "0 0 35px rgba(34, 211, 238, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

