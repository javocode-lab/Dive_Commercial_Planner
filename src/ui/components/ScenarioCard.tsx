type ScenarioCardProps = {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

export function ScenarioCard({
  icon,
  title,
  description,
  selected,
  onSelect
}: ScenarioCardProps) {
  return (
    <button
      className={selected ? "selection-card selection-card--selected" : "selection-card"}
      type="button"
      onClick={onSelect}
    >
      <span className="selection-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="selection-card__body">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      {selected && <span className="selection-card__check">✓</span>}
    </button>
  );
}
