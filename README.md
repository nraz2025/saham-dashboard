# Saham Dashboard — AOV Big Money Desk

Dashboard untuk monitor AI Trading Bot (Bursa Malaysia + US, AOV Big Money
detection). Tunjuk open positions, trade history, win rate, dan cumulative
P&L — sama struktur macam XM dashboard (Next.js di Vercel + FastAPI di VPS
melalui Cloudflare tunnel).

## Architecture

```
Trading Bot (VPS)  ──writes──>  trade_history.json
                                live_positions.json       dashboard_api.py (FastAPI, port 8001)
                                dashboard_status.json            │
                                                                  │ Cloudflare quick tunnel
                                                                  ▼
                                                    https://xxxx.trycloudflare.com
                                                                  │
                                                                  ▼
                                              Next.js Dashboard (Vercel) — awak browse dari mana-mana
```

## Setup — Backend (dalam VPS, sebelah bot)

1. Copy `dashboard_api.py` ke `C:\trading-saham\` (folder sama macam bot)
2. Install dependency (sekali je):
   ```
   pip install fastapi uvicorn --break-system-packages
   ```
3. Run dalam CMD window **berasingan** dari bot:
   ```
   cd C:\trading-saham
   python dashboard_api.py
   ```
   Akan jalan di `http://localhost:8001`

4. Run Cloudflare tunnel (CMD window lain lagi):
   ```
   cloudflared tunnel --url http://localhost:8001
   ```
   Copy URL `https://xxxx.trycloudflare.com` yang keluar.

   > **Note**: URL ni berubah setiap kali `cloudflared` restart. Lepas
   > restart, kena update `NEXT_PUBLIC_API_URL` di Vercel dan redeploy
   > (sama macam awak dah biasa buat untuk XM dashboard).

## Setup — Frontend (local, sebelum push)

```bash
npm install
cp .env.local.example .env.local
# edit .env.local, masukkan URL Cloudflare tunnel
npm run dev
```

Buka `http://localhost:3000` untuk preview.

## Deploy ke Vercel

1. Push folder ni ke GitHub repo baru (contoh: `saham-dashboard`)
2. Di [vercel.com](https://vercel.com), **Import Project** dari repo tu
3. Dalam **Environment Variables**, tambah:
   - `NEXT_PUBLIC_API_URL` = URL Cloudflare tunnel awak
4. Deploy.
5. Setiap kali tunnel URL berubah (lepas restart VPS/cloudflared):
   - Settings → Environment Variables → update `NEXT_PUBLIC_API_URL`
   - Deployments → Redeploy

## Fail data yang bot tulis (auto, setiap cycle)

- `trade_history.json` — semua executed trades (BUY/SELL, P&L bila SELL)
- `live_positions.json` — snapshot open positions terkini
- `dashboard_status.json` — status bot (market open/closed, last sync, mode)

Dashboard refresh automatik setiap 20 saat.
