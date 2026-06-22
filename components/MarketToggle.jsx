export default function MarketToggle({ label, checked, onChange, disabled }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? "opacity-50 cursor-wait" : ""}`}>
      <span className="text-xs font-mono text-text-muted">{label}</span>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-aov-green" : "bg-ink-600"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-ink-900 transition-transform duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </span>
    </label>
  );
}
