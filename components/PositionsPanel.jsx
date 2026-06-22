import { fmtPlain, fmtPct } from "../lib/format";

function PulseDot({ plPct }) {
  const positive = plPct >= 0;
  const color = positive ? "#2DD4BF" : "#FB7185";
  const intensity = Math.min(Math.abs(plPct ?? 0) / 8, 1); // 0..1, saturates at 8%
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 ${6 + intensity * 10}px ${1 + intensity * 2}px ${color}55`,
      }}
    />
  );
}

export default function PositionsPanel({ positions }) {
  if (!positions || positions.length === 0) {
    return (
      <div className="bg-ink-800 border border-ink-600 rounded-lg p-6 text-text-muted text-sm">
        Tiada posisi terbuka sekarang. Bot akan masuk bila Big Money signal jumpa.
      </div>
    );
  }

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-600 flex items-center justify-between">
        <h2 className="font-display text-sm uppercase tracking-wider text-text-muted">
          Open Positions
        </h2>
        <span className="text-xs font-mono text-text-faint">{positions.length} held</span>
      </div>
      <div className="divide-y divide-ink-600">
        {positions.map((p) => (
          <div key={`${p.market}-${p.symbol}`} className="flex items-center gap-3 px-4 py-3">
            <PulseDot plPct={p.pl_pct} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-text truncate">
                {p.symbol}
                {p.name ? <span className="text-text-muted"> · {p.name}</span> : null}
              </div>
              <div className="text-xs text-text-faint font-mono mt-0.5">
                {p.market} · qty {p.quantity} · cost {fmtPlain(p.cost_price, p.market === "US" ? "USD" : "MYR")}
                {p.virtual ? " · virtual" : ""}
              </div>
            </div>
            <div className={`font-mono text-sm tabular ${p.pl_pct >= 0 ? "text-pl-profit" : "text-pl-loss"}`}>
              {fmtPct(p.pl_pct)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
