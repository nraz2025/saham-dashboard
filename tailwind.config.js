/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F14",
          900: "#0B0F14",
          800: "#121821",
          700: "#1A222D",
          600: "#232C38",
        },
        text: {
          DEFAULT: "#E7ECF2",
          muted: "#8993A4",
          faint: "#5B6678",
        },
        aov: {
          darkred: "#991B1B",
          red: "#DC2626",
          amber: "#D9A02C",
          green: "#3D8F6B",
        },
        pl: {
          profit: "#2DD4BF",
          loss: "#FB7185",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px -8px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
