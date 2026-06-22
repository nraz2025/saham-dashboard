export function fmtMoney(value, currency) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  const symbol = currency === "USD" ? "$" : "RM";
  return `${sign}${symbol}${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/^/, value < 0 ? "-" : "")}`;
}

export function fmtPlain(value, currency) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const symbol = currency === "USD" ? "$" : "RM";
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtPct(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function timeAgo(iso) {
  if (!iso) return "tidak pernah";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "baru sekarang";
  if (mins < 60) return `${mins} min lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

export function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-MY", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}
