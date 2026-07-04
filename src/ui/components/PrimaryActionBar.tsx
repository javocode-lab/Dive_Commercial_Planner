type PrimaryActionBarProps = {
  primaryLabel: string;
  secondaryLabel?: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export function PrimaryActionBar({
  primaryLabel,
  secondaryLabel,
  primaryDisabled = false,
  onPrimary,
  onSecondary
}: PrimaryActionBarProps) {
  return (
    <footer className="primary-action-bar">
      {secondaryLabel && onSecondary && (
        <button className="secondary-button" type="button" onClick={onSecondary}>
          {secondaryLabel}
        </button>
      )}

      <button
        className="primary-button"
        type="button"
        disabled={primaryDisabled}
        onClick={onPrimary}
      >
        {primaryLabel}
      </button>
    </footer>
  );
}
