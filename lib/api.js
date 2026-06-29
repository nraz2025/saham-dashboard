const BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function getJSON(path) {
  if (!BASE) throw new Error("NEXT_PUBLIC_API_URL belum diset");
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function postJSON(path, body) {
  if (!BASE) throw new Error("NEXT_PUBLIC_API_URL belum diset");
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

export const fetchStatus    = () => getJSON("/api/status");
export const fetchPositions = () => getJSON("/api/positions");
export const fetchTrades    = (limit = 200) => getJSON(`/api/trades?limit=${limit}`);
export const fetchSummary   = () => getJSON("/api/summary");
export const fetchConfig    = () => getJSON("/api/config");
export const updateConfig   = (cfg) => postJSON("/api/config", cfg);
export const fetchWatchlist = () => getJSON("/api/watchlist");
