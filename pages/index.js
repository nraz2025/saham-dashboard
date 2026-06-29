import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import StatusBar from "../components/StatusBar";
import StatTile from "../components/StatTile";
import PositionsPanel from "../components/PositionsPanel";
import TradesPanel from "../components/TradesPanel";
import PnLChart from "../components/PnLChart";
import WatchlistPanel from "../components/WatchlistPanel";   {/* TAMBAH NI ↑ */}
import { fetchStatus, fetchPositions, fetchTrades, fetchSummary, fetchConfig, updateConfig } from "../lib/api";
import { fmtPlain, fmtPct } from "../lib/format";

const REFRESH_MS = 20000;

export default function Home() {
  const [status, setStatus] = useState(null);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [summary, setSummary] = useState(null);
  const [config, setConfig] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [s, p, t, sm, cfg] = await Promise.all([
        fetchStatus(), fetchPositions(), fetchTrades(100), fetchSummary(), fetchConfig(),
      ]);
      setStatus(s); setPositions(p); setTrades(t); setSummary(sm); setConfig(cfg);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleToggle = useCallback(async (key, value) => {
    const next = { trade_my: true, trade_us: true, ...config, [key]: value };
    setConfig(next); // optimistic update — terasa responsive serta-merta
    setToggling(true);
    try {
      await updateConfig(next);
    } catch (e) {
      setError(e.message);
      setConfig(config); // rollback kalau gagal
    } finally {
      setToggling(false);
    }
  }, [config]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <>
      <Head>
        <title>AOV Big Money Desk</title>
        <meta name="description" content="Dashboard untuk AI trading bot — Bursa Malaysia + US, AOV Big Money detection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-ink-900 text-text px-4 sm:px-8 py-6 max-w-6xl mx-auto">
        <StatusBar status={status} error={error} config={config} onToggle={handleToggle} toggling={toggling} />

        {/* Stat strip */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatTile
            label="MY Realized P&L"
            value={fmtPlain(summary?.MY?.total_realized_pl ?? 0, "MYR")}
            sub={`${summary?.MY?.closed_trades ?? 0} closed trades`}
            tone={(summary?.MY?.total_realized_pl ?? 0) >= 0 ? "profit" : "loss"}
          />
          <StatTile
            label="US Realized P&L"
            value={fmtPlain(summary?.US?.total_realized_pl ?? 0, "USD")}
            sub={`${summary?.US?.closed_trades ?? 0} closed trades`}
            tone={(summary?.US?.total_realized_pl ?? 0) >= 0 ? "profit" : "loss"}
          />
          <StatTile
            label="Today's P&L"
            value={`${fmtPlain(summary?.today?.MY?.total_realized_pl ?? 0, "MYR")} · ${fmtPlain(summary?.today?.US?.total_realized_pl ?? 0, "USD")}`}
            sub={`${(summary?.today?.MY?.closed_trades ?? 0) + (summary?.today?.US?.closed_trades ?? 0)} closed hari ni`}
            tone={((summary?.today?.MY?.total_realized_pl ?? 0) + (summary?.today?.US?.total_realized_pl ?? 0)) >= 0 ? "profit" : "loss"}
          />
          <StatTile
            label="Win Rate (MY)"
            value={summary?.MY ? `${summary.MY.win_rate}%` : "—"}
          />
          <StatTile
            label="Win Rate (US)"
            value={summary?.US ? `${summary.US.win_rate}%` : "—"}
          />
          <StatTile
            label="Open Positions"
            value={summary?.open_now ?? positions.length}
            sub={`${summary?.total_trades_all_time ?? 0} total executed`}
          />
        </section>

        <section className="mb-6">
          <PnLChart curve={summary?.pl_curve} />
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <PositionsPanel positions={positions} />
          <TradesPanel trades={trades} />
        </section>


        {/* TAMBAH NI ↓ */}
        <section className="mb-6">
          <WatchlistPanel />
        </section>
        {/* TAMBAH NI ↑ */}



        <footer className="mt-8 pb-6 text-xs text-text-faint flex flex-wrap gap-4">
          <span><span className="text-pl-profit">●</span> profit</span>
          <span><span className="text-pl-loss">●</span> loss</span>
          <span>"virtual" = MY paper trading (Moomoo OpenAPI tak support order MY market, dikira sendiri oleh bot guna live price)</span>
        </footer>
      </div>
    </>
  );
}
