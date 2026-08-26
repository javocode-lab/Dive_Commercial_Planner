export type CalculationStepCategory = "input" | "validation" | "conversion" | "rounding" | "lookup" | "comparison" | "result" | "source";
export type CalculationStep = { id: string; category: CalculationStepCategory; title: string; detail: string; data?: Record<string, string | number | boolean | null>; };
