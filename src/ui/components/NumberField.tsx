interface NumberFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function NumberField({
  label,
  value,
  placeholder,
  onChange
}: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
