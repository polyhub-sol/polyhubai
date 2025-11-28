"use client";

type Props = {
  reasoning: string;
  bullets: string[];
  sources: { title: string; url: string }[];
};

/**
 * Displays AI reasoning text, bullet points, and optional source links.
 * Used to show the AI's explanation for its probability forecasts.
 */
export function ReasoningFeed({ reasoning, bullets, sources }: Props) {
  return (
      <div className="space-y-3 rounded-2xl border border-ov-border/50 bg-black/60 p-4">
      <h3 className="text-xs font-semibold text-ov-text-muted uppercase tracking-wide">
        AI reasoning
      </h3>
      <p className="text-sm leading-relaxed text-slate-200/90">{reasoning}</p>
      {bullets.length > 0 && (
        <ul className="mt-2 space-y-1.5 text-sm text-ov-text-muted">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-ov-accent/80" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {sources.length > 0 && (
        <div className="mt-3 border-t border-ov-border/60 pt-2">
          <h4 className="mb-1 text-[11px] font-semibold text-ov-text-muted uppercase tracking-wide">
            Sources (declared by model)
          </h4>
          <ul className="space-y-1 text-[11px] text-ov-text-muted">
            {sources.map((s, i) => (
              <li key={i} className="truncate">
                <span className="mr-1 text-ov-accent-soft/90">•</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-ov-accent-soft hover:text-ov-accent"
                >
                  {s.title || s.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-2 text-[10px] text-ov-text-muted">
        This is an AI-generated forecast and may be wrong. Do not use this as
        financial or betting advice.
      </p>
    </div>
  );
}

