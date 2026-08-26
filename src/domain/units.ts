import type { UnitSystem } from "./types";

const FEET_PER_METER = 3.28084;

export function parsePositiveNumber(value: string): number | null {
  const normalizedValue = value.trim().replace(",", ".");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

export function convertDepthToMeters(value: number, unitSystem: UnitSystem): number {
  if (unitSystem === "metric") {
    return value;
  }

  return value / FEET_PER_METER;
}

export function convertAltitudeToMeters(
  value: number,
  unitSystem: UnitSystem
): number {
  if (unitSystem === "metric") {
    return value;
  }

  return value / FEET_PER_METER;
}

export function formatMeters(value: number): string {
  return `${value.toFixed(1)} m`;
}

export function formatMinutes(value: number): string {
  return `${value.toFixed(0)} min`;
}
