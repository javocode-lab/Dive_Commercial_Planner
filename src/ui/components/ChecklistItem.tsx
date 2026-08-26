type ChecklistItemProps = {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
};

export function ChecklistItem({
  label,
  description,
  checked,
  onToggle
}: ChecklistItemProps) {
  return (
    <button
      className={checked ? "check-card check-card--checked" : "check-card"}
      type="button"
      onClick={onToggle}
    >
      <span className="check-card__box">{checked ? "✓" : ""}</span>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
    </button>
  );
}
