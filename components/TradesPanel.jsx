import { fmtPlain, fmtPct, fmtTime } from "../lib/format";

export default function TradesPanel({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-ink-800 border border-ink-600 rounded-lg p-6 text-text-muted text-sm">
        Belum ada trade direkod lagi.
      </div>
    );
  }

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-600 flex items-center justify-between">
        <h2 className="font-display text-sm uppercase tracking-wider text-text-muted">
          Trade History
        </h2>
        <span className="text-xs font-mono text-text-faint">{trades.length} shown</span>
      </div>
      <div className="max-h-[480px] overflow-y-auto divide-y divide-ink-600">
        {trades.map((t, i) => {
          const cur = t.market === "US" ? "USD" : "MYR";
          const hasPL = t.realized_pl !== null && t.realized_pl !== undefined;
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span
                className={`text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${
                  t.action === "BUY" ? "bg-aov-green/15 text-aov-green" : "bg-aov-red/15 text-aov-red"
                }`}
              >
                {t.action}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-text truncate">
                  {t.symbol}
                  {t.name ? <span className="text-text-muted"> · {t.name}</span> : null}
                </div>
                <div className="text-xs text-text-faint font-mono mt-0.5">
                  {fmtTime(t.timestamp)} · qty {t.qty} @ {fmtPlain(t.price, cur)}
                  {t.mode === "virtual" ? " · virtual" : ""}
                </div>
              </div>
              {hasPL ? (
                <div className={`font-mono text-sm tabular shrink-0 ${t.realized_pl >= 0 ? "text-pl-profit" : "text-pl-loss"}`}>
                  {fmtPlain(t.realized_pl, cur)}
                  <span className="text-text-faint"> ({fmtPct(t.realized_pl_pct)})</span>
                </div>
              ) : (
                <div className="text-xs text-text-faint shrink-0">entry</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
