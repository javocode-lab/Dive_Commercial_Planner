export type CalculationStepCategory =
  | "input"
  | "validation"
  | "conversion"
  | "rounding"
  | "lookup"
  | "pressureGroup"
  | "surfaceInterval"
  | "residualNitrogen"
  | "repetitiveDive"
  | "comparison"
  | "result"
  | "source";

export type CalculationStep = {
  id: string;
  category: CalculationStepCategory;
  title: string;
  detail: string;
  data?: Record<string, string | number | boolean | null>;
};
