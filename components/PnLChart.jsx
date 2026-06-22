import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { fmtTime } from "../lib/format";

export default function PnLChart({ curve }) {
  if (!curve || curve.length < 2) {
    return (
      <div className="bg-ink-800 border border-ink-600 rounded-lg p-6 text-text-muted text-sm">
        Belum cukup data untuk chart cumulative P&amp;L (perlukan sekurang-kurangnya 2 closed trades).
      </div>
    );
  }

  const last = curve[curve.length - 1].cumulative_pl;
  const lineColor = last >= 0 ? "#2DD4BF" : "#FB7185";

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-sm uppercase tracking-wider text-text-muted">
          Cumulative P&amp;L
        </h2>
        <span className="text-xs text-text-faint font-mono">
          MY (RM) + US (USD) digabung — trend sahaja
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={curve} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="plFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#232C38" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(v) => fmtTime(v)}
            stroke="#5B6678"
            fontSize={11}
            tick={{ fill: "#5B6678" }}
            minTickGap={40}
          />
          <YAxis stroke="#5B6678" fontSize={11} tick={{ fill: "#5B6678" }} width={50} />
          <Tooltip
            contentStyle={{ background: "#121821", border: "1px solid #232C38", borderRadius: 8 }}
            labelStyle={{ color: "#8993A4" }}
            labelFormatter={(v) => fmtTime(v)}
            formatter={(value) => [value.toFixed(2), "Cumulative"]}
          />
          <Area type="monotone" dataKey="cumulative_pl" stroke={lineColor} strokeWidth={2} fill="url(#plFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
