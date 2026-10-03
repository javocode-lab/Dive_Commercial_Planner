import { useI18n } from "../../i18n/I18nProvider";

type DepthStepperProps = {
  value: number;
  unit: "m" | "ft";
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export function DepthStepper({ value, unit, step, min, max, onChange }: DepthStepperProps) {
  const { copy } = useI18n();
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <section className="depth-stepper" aria-label={copy.depth.selector}>
      <div className="depth-stepper__value">{value} <span>{unit}</span></div>
      <div className="depth-stepper__controls">
        <button type="button" onClick={decrease} aria-label={copy.depth.decrease}>−</button>
        <button type="button" onClick={increase} aria-label={copy.depth.increase}>+</button>
      </div>
    </section>
  );
}
