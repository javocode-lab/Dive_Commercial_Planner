type ButtonVariant = "primary" | "secondary" | "danger";

interface AppButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export function AppButton({
  label,
  onClick,
  variant = "primary",
  disabled = false
}: AppButtonProps) {
  return (
    <button
      type="button"
      className={`app-button app-button--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
