export default function StatTile({ label, value, sub, tone = "neutral" }) {
  const toneClass =
    tone === "profit" ? "text-pl-profit" :
    tone === "loss"   ? "text-pl-loss"   :
    "text-text";

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-lg px-4 py-3.5 shadow-glow">
      <div className="text-[11px] uppercase tracking-wider text-text-faint mb-1.5">{label}</div>
      <div className={`font-mono text-2xl tabular ${toneClass}`}>{value}</div>
      {sub ? <div className="text-xs text-text-muted mt-1">{sub}</div> : null}
    </div>
  );
}
