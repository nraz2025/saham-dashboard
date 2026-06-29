// ============================================================================
// FILE: components/WatchlistPanel.jsx
// ============================================================================
// Add this as a NEW file in your saham-dashboard repo, import + render in
// pages/index.js (instructions at bottom).
//
// Shows the SAME ranked Big Money/Hot Money candidates the bot's own
// scanner produces every cycle (~10 min, Bursa hours) — any Shariah-
// compliant Bursa stock, not a fixed list. Fetches /api/watchlist every 20s.
// ============================================================================

import { useEffect, useState } from "react";
import WatchlistPanel from '../components/WatchlistPanel';

const REFRESH_MS = 20000;

const ENTRY_STYLES = {
  BIG_MONEY: { dot: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Big Money" },
  HOT_MONEY: { dot: "#ca8a04", bg: "#fefce8", border: "#fef08a", label: "Hot Money" },
};

function StatusBadge({ stock }) {
  if (stock.executed_this_cycle) {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#1a5f3c", borderRadius: 6, padding: "2px 7px" }}>
        DIBELI
      </span>
    );
  }
  if (stock.ai_considered) {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: "#1a5f3c", background: "#dcfce7", borderRadius: 6, padding: "2px 7px" }}>
        AI REVIEW
      </span>
    );
  }
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f1f5f9", borderRadius: 6, padding: "2px 7px" }}>
      WATCH
    </span>
  );
}

function StockRow({ stock }) {
  const style = ENTRY_STYLES[stock.entry_type] || ENTRY_STYLES.HOT_MONEY;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        marginBottom: 6,
        borderRadius: 8,
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: style.dot, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
            {stock.name || stock.symbol}
            <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: 6, fontSize: 12 }}>
              {stock.symbol}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            CMF {stock.cmf >= 0 ? "+" : ""}{stock.cmf?.toFixed(3)} · MFI {stock.mfi?.toFixed(0)} · Vol {stock.vol_ratio}x · Score {stock.aov_score}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
            RM{Number(stock.price).toFixed(3)}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: style.dot }}>{style.label}</div>
        </div>
        <StatusBadge stock={stock} />
      </div>
    </div>
  );
}

export default function WatchlistPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchWatchlist() {
      try {
        const res = await fetch("/api/watchlist");
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        console.error("Watchlist fetch failed:", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div style={{ padding: 20, color: "#94a3b8", fontSize: 13 }}>Loading watchlist...</div>;
  }

  const lastScan = data?.last_scan ? new Date(data.last_scan) : null;
  const lastScanStr = lastScan
    ? lastScan.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "—";

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Potential Saham — Big Money Radar
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Last scan: {lastScanStr} MYT · {data?.bursa_open ? "Bursa Open" : "Bursa Closed"} · Refresh setiap {data?.check_interval_min || 10} min
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            background: (data?.showing_count || 0) > 0 ? "#1a5f3c" : "#94a3b8",
            borderRadius: 8,
            padding: "6px 12px",
          }}
        >
          {data?.showing_count || 0} saham
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 10 }}>
        Semua saham Bursa Shariah-compliant yang lepas filter Big Money/Hot Money (CMF+MFI) — bukan list tetap.
        Ranked tertinggi dulu, sama macam logic scanner trading.
      </div>

      {(!data?.stocks || data.stocks.length === 0) ? (
        <div style={{ padding: 16, borderRadius: 8, background: "#f1f5f9", color: "#64748b", fontSize: 13 }}>
          Tiada saham tunjuk Big Money/Hot Money signal cycle ni. Bot scan setiap{" "}
          {data?.check_interval_min || 10} minit semasa Bursa buka.
        </div>
      ) : (
        data.stocks.map((s) => <StockRow key={s.symbol} stock={s} />)
      )}
    </div>
  );
}

// ============================================================================
// HOW TO ADD TO YOUR DASHBOARD
// ============================================================================
// 1. Save as: components/WatchlistPanel.jsx
// 2. In pages/index.js:
//      import WatchlistPanel from '../components/WatchlistPanel';
//      ... <PositionsPanel positions={positions} /> <WatchlistPanel /> ...
// 3. If your /api/* calls go to FastAPI directly (not proxied), use the
//    same base URL your /api/positions call already uses.
//
// BADGE MEANINGS:
//   WATCH      = ada Big Money/Hot Money signal, tapi bukan dalam top 10
//                yang dihantar ke AI (rank lebih rendah)
//   AI REVIEW  = masuk top 10, AI dah review, tapi tak ditrade cycle ni
//                (sebab confidence rendah / slot penuh / cooldown / dsb)
//   DIBELI     = betul-betul dibeli/dijual cycle ni
// ============================================================================