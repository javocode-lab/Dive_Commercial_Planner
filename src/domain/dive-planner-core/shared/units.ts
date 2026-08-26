export type UnitSystem = "metric" | "imperial";
export type DepthUnit = "m" | "ft";
export const METERS_TO_FEET = 3.28084;
export function metersToFeet(meters: number): number { return meters * METERS_TO_FEET; }
export function feetToMeters(feet: number): number { return feet / METERS_TO_FEET; }
export function getDepthUnit(unitSystem: UnitSystem): DepthUnit { return unitSystem === "metric" ? "m" : "ft"; }
export function formatDepth(value: number, unit: DepthUnit): string { const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1); return `${formatted} ${unit}`; }
export function formatMinutes(minutes: number): string { const abs = Math.abs(minutes); const label = abs === 1 ? "minuto" : "minutos"; const sign = minutes < 0 ? "-" : ""; return `${sign}${abs} ${label}`; }
