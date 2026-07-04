import type { DepthSource, PortType, ScenarioType, UnitSystem } from "./types";

export type ScenarioOption = {
  id: ScenarioType;
  title: string;
  description: string;
  icon: string;
  requiresAltitudeLater: boolean;
};

export const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    id: "sea",
    title: "Mar",
    description: "Operación marítima a nivel del mar",
    icon: "🌊",
    requiresAltitudeLater: false
  },
  {
    id: "lake",
    title: "Lago",
    description: "Entorno interior. Requiere altitud",
    icon: "🏞️",
    requiresAltitudeLater: true
  },
  {
    id: "river",
    title: "Río",
    description: "Entorno interior o fluvial",
    icon: "🌉",
    requiresAltitudeLater: true
  },
  {
    id: "quarry",
    title: "Cantera",
    description: "Entorno cerrado o interior",
    icon: "🪨",
    requiresAltitudeLater: true
  },
  {
    id: "port",
    title: "Puerto",
    description: "Requiere identificar tipo de puerto",
    icon: "⚓",
    requiresAltitudeLater: true
  },
  {
    id: "offshore",
    title: "Offshore",
    description: "Operación marítima / plataforma",
    icon: "🛢️",
    requiresAltitudeLater: false
  },
  {
    id: "dam",
    title: "Represa",
    description: "Entorno interior. Requiere altitud",
    icon: "⚙️",
    requiresAltitudeLater: true
  },
  {
    id: "underwater_work",
    title: "Obra submarina",
    description: "Operación técnica o infraestructura",
    icon: "🚧",
    requiresAltitudeLater: true
  }
];

export const UNIT_SYSTEM_OPTIONS: {
  id: UnitSystem;
  title: string;
  description: string;
  example: string;
}[] = [
  {
    id: "metric",
    title: "Métrico",
    description: "Metros",
    example: "Ejemplo: 18 m"
  },
  {
    id: "imperial",
    title: "Imperial",
    description: "Feet",
    example: "Ejemplo: 60 ft"
  }
];

export const PORT_TYPE_OPTIONS: {
  id: PortType;
  title: string;
  description: string;
}[] = [
  {
    id: "maritime",
    title: "Marítimo",
    description: "Puerto conectado a operación marítima"
  },
  {
    id: "river_or_inland",
    title: "Fluvial / interior",
    description: "Puede requerir validación de altitud"
  },
  {
    id: "unknown",
    title: "No estoy seguro",
    description: "Debe revisarse antes de fase técnica"
  }
];

export const METRIC_DEPTH_OPTIONS = [6, 9, 12, 15, 18, 21, 24, 30];

export const IMPERIAL_DEPTH_OPTIONS = [20, 30, 40, 50, 60, 70, 80, 100];

export const DEPTH_SOURCE_OPTIONS: {
  id: DepthSource;
  title: string;
  description: string;
}[] = [
  {
    id: "supervisor",
    title: "Supervisor",
    description: "Dato confirmado por responsable"
  },
  {
    id: "estimated",
    title: "Estimada",
    description: "Dato aproximado o no verificado"
  },
  {
    id: "chart_or_plan",
    title: "Carta / plano",
    description: "Dato obtenido de documentación"
  },
  {
    id: "sonar_or_measurement",
    title: "Sonar / medición",
    description: "Dato obtenido por medición"
  }
];

export const APP_COPY = {
  productName: "DIVE COMMERCIAL PLANNER",
  productSubtitle: "Pre-Dive Planning Tool",
  prototypeWarning:
    "Prototipo visual. No incluye tiempo de fondo, tablas, NDL ni validación de descompresión.",
  operationalWarning:
    "No utilizar para planificación real de inmersiones. Requiere validación profesional, técnica y legal."
} as const;
