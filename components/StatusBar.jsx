import { timeAgo } from "../lib/format";
import MarketToggle from "./MarketToggle";

export default function StatusBar({ status, error, config, onToggle, toggling }) {
  const isLive = status?.last_update && (Date.now() - new Date(status.last_update).getTime() < 3 * 60 * 1000);
  const dotColor = error ? "bg-pl-loss" : isLive ? "bg-aov-green" : "bg-aov-amber";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-600 pb-5 mb-6">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} animate-pulse-soft`} />
        </span>
        <h1 className="font-display text-xl sm:text-2xl tracking-tight text-text">
          AOV Big Money Desk
        </h1>
        <span className="text-xs uppercase tracking-wider text-text-faint border border-ink-600 rounded px-2 py-0.5 font-mono">
          {status?.mode === "REAL" ? "REAL" : "PAPER"}
        </span>
      </div>
      <div className="flex items-center gap-5 text-sm font-mono text-text-muted">
        <div className="flex items-center gap-3 border-r border-ink-600 pr-5">
          <MarketToggle
            label="MY"
            checked={config?.trade_my ?? true}
            onChange={(v) => onToggle("trade_my", v)}
            disabled={toggling}
          />
          <MarketToggle
            label="US"
            checked={config?.trade_us ?? true}
            onChange={(v) => onToggle("trade_us", v)}
            disabled={toggling}
          />
        </div>
        <span>Bursa {status?.bursa_open ? <b className="text-aov-green">OPEN</b> : "closed"}</span>
        <span>US {status?.us_open ? <b className="text-aov-green">OPEN</b> : "closed"}</span>
        <span>
          {error ? (
            <span className="text-pl-loss">offline — {error}</span>
          ) : (
            `sync ${timeAgo(status?.last_update)}`
          )}
        </span>
      </div>
    </header>
  );
}

