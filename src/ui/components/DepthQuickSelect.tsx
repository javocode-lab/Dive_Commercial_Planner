type DepthQuickSelectProps = {
  options: number[];
  selectedValue: number | null;
  unit: "m" | "ft";
  onSelect: (value: number) => void;
};

export function DepthQuickSelect({
  options,
  selectedValue,
  unit,
  onSelect
}: DepthQuickSelectProps) {
  return (
    <div className="quick-select-grid">
      {options.map((option) => (
        <button
          key={option}
          className={
            selectedValue === option
              ? "quick-select-chip quick-select-chip--selected"
              : "quick-select-chip"
          }
          type="button"
          onClick={() => onSelect(option)}
        >
          {option} {unit}
        </button>
      ))}
    </div>
  );
}
