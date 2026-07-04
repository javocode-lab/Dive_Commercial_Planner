type DepthStepperProps = {
  value: number;
  unit: "m" | "ft";
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export function DepthStepper({
  value,
  unit,
  step,
  min,
  max,
  onChange
}: DepthStepperProps) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <section className="depth-stepper" aria-label="Selector de profundidad">
      <div className="depth-stepper__value">
        {value} <span>{unit}</span>
      </div>

      <div className="depth-stepper__controls">
        <button type="button" onClick={decrease} aria-label="Disminuir profundidad">
          −
        </button>
        <button type="button" onClick={increase} aria-label="Aumentar profundidad">
          +
        </button>
      </div>
    </section>
  );
}
