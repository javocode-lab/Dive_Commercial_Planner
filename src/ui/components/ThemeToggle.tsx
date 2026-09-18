export type ThemeMode = "dark" | "light";

type ThemeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
};

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M20.1 15.4A8.5 8.5 0 0 1 8.6 3.9 8.5 8.5 0 1 0 20.1 15.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const isLight = theme === "light";
  const nextTheme: ThemeMode = isLight ? "dark" : "light";
  const accessibleLabel = isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro";

  return (
    <div className="theme-toggle">
      <button
        type="button"
        className="theme-toggle__button"
        onClick={() => onChange(nextTheme)}
        aria-label={accessibleLabel}
        title={accessibleLabel}
      >
        {isLight ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
}
