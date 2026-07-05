export type ThemeMode = "dark" | "light";

type ThemeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
};

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const isLight = theme === "light";

  return (
    <div className="theme-toggle" aria-label="Selector de tema visual">
      <span className="theme-toggle__label">Tema</span>
      <div className="theme-toggle__control" role="group" aria-label="Cambiar tema visual">
        <button
          type="button"
          className={!isLight ? "theme-toggle__option theme-toggle__option--active" : "theme-toggle__option"}
          onClick={() => onChange("dark")}
          aria-pressed={!isLight}
        >
          Navy
        </button>
        <button
          type="button"
          className={isLight ? "theme-toggle__option theme-toggle__option--active" : "theme-toggle__option"}
          onClick={() => onChange("light")}
          aria-pressed={isLight}
        >
          Light
        </button>
      </div>
    </div>
  );
}
