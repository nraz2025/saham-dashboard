import { useEffect, useState, useCallback } from "react";
import { fetchWatchlist } from "../lib/api";

const REFRESH_MS = 20000;

const ENTRY_DOT = {
  BIG_MONEY: "bg-red-500",
  HOT_MONEY: "bg-yellow-500",
};

const ENTRY_LABEL = {
  BIG_MONEY: "Big Money",
  HOT_MONEY: "Hot Money",
};

function StatusBadge({ stock }) {
  if (stock.executed_this_cycle) {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-pl-profit/20 text-pl-profit">
        DIBELI
      </span>
    );
  }
  if (stock.ai_considered) {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/15 text-sky-400">
        AI REVIEW
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-text-faint">
      WATCH
    </span>
  );
}

function StockRow({ stock }) {
  const dot = ENTRY_DOT[stock.entry_type] || "bg-text-faint";
  const label = ENTRY_LABEL[stock.entry_type] || stock.entry_type;
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 mb-1.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
        <div className="min-w-0">
          <div className="text-sm font-medium text-text truncate">
            {stock.name || stock.symbol}
            <span className="text-text-faint font-normal ml-1.5 text-xs">
              {stock.symbol}
            </span>
          </div>
          <div className="text-xs text-text-faint">
            CMF {stock.cmf >= 0 ? "+" : ""}{stock.cmf?.toFixed(3)} · MFI {stock.mfi?.toFixed(0)} · Vol {stock.vol_ratio}x · Score {stock.aov_score}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        <div className="text-right">
          <div className="text-sm font-semibold text-text">
            RM{Number(stock.price).toFixed(3)}
          </div>
          <div className="text-[11px] font-medium text-text-faint">{label}</div>
        </div>
        <StatusBadge stock={stock} />
      </div>
    </div>
  );
}

export default function WatchlistPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const json = await fetchWatchlist();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div className="rounded-xl bg-ink-800 border border-white/5 p-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-text">
            Potential Saham — Big Money Radar
          </h3>
          <p className="text-xs text-text-faint mt-0.5">
            {data?.bursa_open ? "Bursa open" : "Bursa closed"} · refresh tiap{" "}
            {data?.check_interval_min || 10} min
            {data?.last_scan && (
              <> · last scan {new Date(data.last_scan).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: false })}</>
            )}
          </p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${(data?.showing_count || 0) > 0 ? "bg-pl-profit/20 text-pl-profit" : "bg-white/5 text-text-faint"}`}>
          {data?.showing_count ?? "—"} saham
        </span>
      </div>

      <p className="text-[11px] text-text-faint mb-3">
        Semua saham Bursa Shariah-compliant yang lepas filter Big Money/Hot Money — bukan list tetap, sama logic scanner trading.
      </p>

      {error && (
        <div className="text-xs text-pl-loss mb-2">Gagal load watchlist: {error}</div>
      )}

      {!error && (!data?.stocks || data.stocks.length === 0) && (
        <div className="rounded-lg bg-white/[0.03] p-3 text-xs text-text-faint">
          Tiada saham tunjuk Big Money/Hot Money signal cycle ni.
        </div>
      )}

      {data?.stocks?.map((s) => (
        <StockRow key={s.symbol} stock={s} />
      ))}
    </div>
  );
}