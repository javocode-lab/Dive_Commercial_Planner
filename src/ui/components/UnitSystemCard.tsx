type UnitSystemCardProps = {
  title: string;
  description: string;
  example: string;
  selected: boolean;
  onSelect: () => void;
};

export function UnitSystemCard({
  title,
  description,
  example,
  selected,
  onSelect
}: UnitSystemCardProps) {
  return (
    <button
      className={selected ? "wide-card wide-card--selected" : "wide-card"}
      type="button"
      onClick={onSelect}
    >
      <span className="radio-mark">{selected ? "●" : "○"}</span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <em>{example}</em>
    </button>
  );
}
