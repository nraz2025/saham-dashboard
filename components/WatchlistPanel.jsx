import { useEffect, useState, useCallback } from "react";
import { fetchWatchlist } from "../lib/api";

const REFRESH_MS = 20000;

const ACTION_STYLE = {
  BOLEH_BELI:  { badge: "bg-pl-profit/20 text-pl-profit",  border: "border-pl-profit/30", label: "BOLEH BELI" },
  TUNGGU:      { badge: "bg-yellow-500/15 text-yellow-400", border: "border-yellow-500/20", label: "TUNGGU" },
  JANGAN_BELI: { badge: "bg-pl-loss/20 text-pl-loss",       border: "border-pl-loss/20",    label: "JANGAN BELI" },
};

const ENTRY_DOT = { BIG_MONEY: "bg-red-500", HOT_MONEY: "bg-yellow-500" };
const ENTRY_LABEL = { BIG_MONEY: "Big Money", HOT_MONEY: "Hot Money" };

function StatusBadge({ stock }) {
  if (stock.executed_this_cycle) {
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-pl-profit/20 text-pl-profit">DIBELI</span>;
  }
  if (stock.ai_considered) {
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/15 text-sky-400">AI REVIEW</span>;
  }
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-white/70">WATCH</span>;
}

function StockRow({ stock }) {
  const dot = ENTRY_DOT[stock.entry_type] || "bg-white/40";
  const entryLabel = ENTRY_LABEL[stock.entry_type] || stock.entry_type;
  const act = ACTION_STYLE[stock.action] || ACTION_STYLE.TUNGGU;

  return (
    <div className={`rounded-lg bg-white/[0.04] border ${act.border} mb-1.5 overflow-hidden`}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-text truncate">
              {stock.name || stock.symbol}
              <span className="text-white/50 font-normal ml-1.5 text-xs">{stock.symbol}</span>
            </div>
            {/* ── Diterangkan: tukar dari text-text-faint (gelap) ke text-white/75 (lebih nampak) ── */}
            <div className="text-xs text-white/75">
              CMF {stock.cmf >= 0 ? "+" : ""}{stock.cmf?.toFixed(3)} · MFI {stock.mfi?.toFixed(0)} · Vol {stock.vol_ratio}x · {entryLabel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-text">RM{Number(stock.price).toFixed(3)}</div>
            <div className="text-[11px] font-medium text-white/60">Score {stock.aov_score}</div>
          </div>
          <StatusBadge stock={stock} />
        </div>
      </div>

      {/* ── Real-time action verdict — recalculated every cycle dari harga semasa ── */}
      <div className={`px-3 py-2 flex items-start gap-2 ${act.badge} border-t ${act.border}`}>
        <span className="text-xs font-bold whitespace-nowrap mt-0.5">{act.label}</span>
        <span className="text-xs opacity-90">{stock.action_reason}</span>
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
          <h3 className="text-sm font-semibold text-text">Potential Saham — Big Money Radar</h3>
          <p className="text-xs text-white/60 mt-0.5">
            {data?.bursa_open ? "Bursa open" : "Bursa closed"} · refresh tiap {data?.check_interval_min || 10} min
            {data?.last_scan && (() => {
              const dt = new Date(data.last_scan);
              const dateStr = dt.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
              const timeStr = dt.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: false });
              return <> · last scan {dateStr} {timeStr}</>;
            })()}
          </p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${(data?.boleh_beli_count || 0) > 0 ? "bg-pl-profit/20 text-pl-profit" : "bg-white/10 text-white/70"}`}>
          {data?.boleh_beli_count ?? 0} boleh beli
        </span>
      </div>

      <p className="text-[11px] text-white/50 mb-3">
        Verdict "Boleh Beli / Tunggu / Jangan Beli" dikira SEMULA setiap cycle dari harga semasa —
        kalau pagi tadi elok tapi harga dah lari dari support, verdict auto turun ke Tunggu/Jangan Beli.
      </p>

      {error && <div className="text-xs text-pl-loss mb-2">Gagal load watchlist: {error}</div>}

      {!error && (!data?.stocks || data.stocks.length === 0) && (
        <div className="rounded-lg bg-white/[0.04] p-3 text-xs text-white/60">
          Tiada saham tunjuk Big Money/Hot Money signal cycle ni.
        </div>
      )}

      {data?.stocks?.map((s) => <StockRow key={s.symbol} stock={s} />)}
    </div>
  );
}