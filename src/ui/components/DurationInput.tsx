import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";

type DurationInputProps = {
  label: string;
  helper?: string;
  valueMinutes: number;
  onChange: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
  quickOptions?: readonly number[];
  allowEmpty?: boolean;
  placeholder?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${hours} h ${String(mins).padStart(2, "0")} min`;
}

export function formatDurationInput(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Accepts both explicit HH:MM and compact numeric entry:
 *   5    -> 00:05
 *   45   -> 00:45
 *   145  -> 01:45
 *   230  -> 02:30
 *   1015 -> 10:15
 *
 * When a colon is used, one or two hour digits are accepted as well:
 *   1:45 -> 01:45
 */
export function parseDurationInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  let hours: number;
  let minutes: number;

  if (trimmed.includes(":")) {
    const match = trimmed.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;

    hours = Number(match[1]);
    minutes = Number(match[2]);
  } else {
    if (!/^\d{1,4}$/.test(trimmed)) return null;

    if (trimmed.length <= 2) {
      hours = 0;
      minutes = Number(trimmed);
    } else if (trimmed.length === 3) {
      hours = Number(trimmed.slice(0, 1));
      minutes = Number(trimmed.slice(1));
    } else {
      hours = Number(trimmed.slice(0, 2));
      minutes = Number(trimmed.slice(2));
    }
  }

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function sanitizeDurationDraft(value: string): string {
  const filtered = value.replace(/[^\d:]/g, "");

  if (!filtered.includes(":")) {
    return filtered.replace(/\D/g, "").slice(0, 4);
  }

  const firstColonIndex = filtered.indexOf(":");
  const hours = filtered.slice(0, firstColonIndex).replace(/\D/g, "").slice(0, 2);
  const minutes = filtered.slice(firstColonIndex + 1).replace(/\D/g, "").slice(0, 2);

  return `${hours}:${minutes}`;
}

export function DurationInput({
  label,
  helper,
  valueMinutes,
  onChange,
  minMinutes = 0,
  maxMinutes = 720,
  quickOptions = [],
  allowEmpty = false,
  placeholder = "01:30"
}: DurationInputProps) {
  const isEmpty = allowEmpty && valueMinutes <= 0;
  const safeValue = isEmpty ? 0 : clamp(Math.floor(valueMinutes), minMinutes, maxMinutes);
  const [draftValue, setDraftValue] = useState(() => (isEmpty ? "" : formatDurationInput(safeValue)));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEmpty) {
      setDraftValue("");
      return;
    }

    if (valueMinutes !== safeValue) {
      onChange(safeValue);
      return;
    }

    setDraftValue(formatDurationInput(safeValue));
  }, [isEmpty, safeValue, valueMinutes]);

  const commitValue = (rawValue = draftValue) => {
    if (allowEmpty && rawValue.trim() === "") {
      setError(null);
      onChange(0);
      return true;
    }

    const parsed = parseDurationInput(rawValue);

    if (parsed === null) {
      setError("Ingresá HH:MM o escribí los números seguidos. Ejemplo: 145 = 01:45.");
      return false;
    }

    if (parsed < minMinutes || parsed > maxMinutes) {
      setError(`La duración debe estar entre ${formatDuration(minMinutes)} y ${formatDuration(maxMinutes)}.`);
      return false;
    }

    setError(null);
    setDraftValue(formatDurationInput(parsed));
    onChange(parsed);
    return true;
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDraft = sanitizeDurationDraft(event.target.value);
    setDraftValue(nextDraft);
    setError(null);

    // Do not normalize while the user is still typing. This is important for
    // compact entries such as 1015 -> 10:15; formatting after the third digit
    // would otherwise interrupt the fourth keystroke.
    if (allowEmpty && nextDraft === "") {
      onChange(0);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const selectQuickOption = (option: number) => {
    const nextValue = clamp(option, minMinutes, maxMinutes);
    setDraftValue(formatDurationInput(nextValue));
    setError(null);
    onChange(nextValue);
  };

  const inputId = `duration-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const helperId = `duration-help-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="duration-input">
      <div className="duration-input__heading">
        <div>
          <label className="duration-input__label" htmlFor={inputId}>
            {label}
          </label>
          {helper && <small className="duration-input__helper">{helper}</small>}
        </div>
      </div>

      <div className="duration-input__single-field">
        <input
          id={inputId}
          className={error ? "duration-input__text duration-input__text--error" : "duration-input__text"}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={5}
          value={draftValue}
          placeholder={placeholder}
          aria-describedby={helperId}
          aria-invalid={Boolean(error)}
          onChange={handleTextChange}
          onBlur={() => {
            if (!commitValue()) {
              setDraftValue(isEmpty ? "" : formatDurationInput(safeValue));
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <span className="duration-input__format" aria-hidden="true">HH:MM</span>
      </div>

      <small
        id={helperId}
        className={error ? "duration-input__message duration-input__message--error" : "duration-input__message"}
        aria-live="polite"
      >
        {error ?? (isEmpty
          ? "Podés escribir 145 → 01:45 (1 h 45 min)."
          : `Podés escribir 145 → 01:45 · Valor actual: ${formatDuration(safeValue)}`)}
      </small>

      {quickOptions.length > 0 && (
        <div
          className="quick-select-grid quick-select-grid--dense duration-input__quick-options"
          aria-label={`Valores rápidos para ${label.toLowerCase()}`}
        >
          {quickOptions.map((option) => (
            <button
              key={option}
              className={!isEmpty && safeValue === option ? "quick-select-chip quick-select-chip--selected" : "quick-select-chip"}
              type="button"
              onClick={() => selectQuickOption(option)}
            >
              {formatDuration(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
