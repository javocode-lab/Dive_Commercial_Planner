import type { CalculationStep } from "../domain/dive-planner-core/shared/trace";
import type { RecreationalAirDiveResult, RecreationalDiveWarning } from "../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import type { AppLocale } from "./copy";

function pt(locale: AppLocale): boolean {
  return locale === "pt-BR";
}

function n(data: CalculationStep["data"] | undefined, key: string): number | null {
  const value = data?.[key];
  return typeof value === "number" ? value : null;
}

function s(data: CalculationStep["data"] | undefined, key: string): string | null {
  const value = data?.[key];
  return typeof value === "string" ? value : null;
}

export function localizedResultLabel(result: RecreationalAirDiveResult, locale: AppLocale): string {
  if (!pt(locale)) return result.resultLabel;
  switch (result.status) {
    case "within_table_limit": return "Dentro do limite tabular";
    case "exceeds_table_time_limit": return "Excede o limite tabular";
    case "unsupported_depth": return "Profundidade fora do escopo da tabela";
    case "invalid_input": return "Dados inválidos";
    default: return "Requer revisão manual";
  }
}

export function localizedRepetitiveMessage(result: RecreationalAirDiveResult, locale: AppLocale): string {
  if (!pt(locale)) return result.repetitiveDiveAnalysis.message;
  const analysis = result.repetitiveDiveAnalysis;
  switch (analysis.status) {
    case "not_requested": return "Cálculo repetitivo não solicitado.";
    case "ready_for_repetitive_input": return "Primeiro mergulho calculado. Informe o intervalo de superfície e os dados do segundo mergulho para calcular o repetitivo.";
    case "calculated_within_adjusted_limit": return "Mergulho repetitivo calculado dentro do limite ajustado da Tabela III, sujeito à revisão manual.";
    case "exceeds_adjusted_no_decompression_limit": {
      const remaining = analysis.residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes;
      return `O segundo mergulho excede o limite ajustado${remaining !== null ? ` em ${Math.abs(remaining)} min` : ""}.`;
    }
    case "blocked_by_first_dive": return "O cálculo repetitivo está bloqueado porque o primeiro mergulho não está dentro do limite tabular.";
    case "surface_interval_out_of_range": return "O intervalo de superfície está fora dos intervalos carregados da Tabela II. O protótipo não extrapola além da tabela.";
    case "unsupported_second_dive_depth": return "A profundidade do segundo mergulho está fora do intervalo suportado pela Tabela III neste protótipo.";
    case "residual_table_entry_not_supported": return "A célula correspondente da Tabela III não possui um limite ajustado utilizável neste protótipo. É necessária revisão manual.";
    case "invalid_repetitive_input": return "Não foi possível concluir o cálculo repetitivo com os dados informados.";
    default: return "Requer revisão manual.";
  }
}

export function localizedWarning(warning: RecreationalDiveWarning, result: RecreationalAirDiveResult, locale: AppLocale): string {
  if (!pt(locale)) return warning.message;
  const message = warning.message;
  if (message.includes("profundidad ingresada excede")) return "A profundidade informada excede o máximo operacional coberto pela Tabela I.";
  if (message.includes("No se encontró una profundidad")) return "Não foi encontrada uma profundidade tabular igual ou superior.";
  if (message.includes("tiempo de fondo excede")) return `O tempo de fundo excede o limite tabular${result.remainingTime !== null ? ` em ${Math.abs(result.remainingTime)} minutos` : ""}.`;
  if (message.includes("Buceo repetitivo calculado como prototipo")) return "Mergulho repetitivo calculado como protótipo. Deve ser validado manualmente com as Tabelas II e III antes de qualquer uso real.";
  if (message === result.repetitiveDiveAnalysis.message) return localizedRepetitiveMessage(result, locale);
  return "Aviso técnico gerado pelo motor. Revise os Detalhes do cálculo antes de continuar.";
}

export function localizedStep(step: CalculationStep, locale: AppLocale): { title: string; detail: string } {
  if (!pt(locale)) return { title: step.title, detail: step.detail };
  const d = step.data;

  switch (step.id) {
    case "input-001": {
      const depth = n(d, "depth");
      const bottom = n(d, "bottomTime");
      const unit = s(d, "unitSystem") === "imperial" ? "ft" : "m";
      const repetitive = d?.repetitiveRequested === true;
      const surface = n(d, "surfaceIntervalMinutes");
      const secondDepth = n(d, "secondDiveDepth");
      const secondTime = n(d, "secondDiveBottomTime");
      return {
        title: "Dados informados",
        detail: `Profundidade do primeiro mergulho: ${depth ?? "—"} ${unit}. Tempo de fundo do primeiro mergulho: ${bottom ?? "—"} min. Gás: ar. Sistema: ${unit === "m" ? "métrico" : "imperial"}.${repetitive ? ` Mergulho repetitivo solicitado: intervalo de superfície ${surface ?? "—"} min, segunda profundidade ${secondDepth ?? "—"} ${unit}, segundo tempo ${secondTime ?? "—"} min.` : " Mergulho repetitivo não solicitado."}`
      };
    }
    case "source-001":
      return { title: "Fonte técnica selecionada", detail: step.detail.replace("Tabla", "Tabela").replace("Motor", "Motor") };
    case "validation-001":
      return { title: "Validação dos dados", detail: "Os dados informados não permitem executar o cálculo tabular." };
    case "pressure-group-001":
      return { title: "Grupo de pressão final", detail: "Não se aplica porque o cálculo foi bloqueado por dados inválidos." };
    case "conversion-001": {
      const m = n(d, "normalizedDepthMeters");
      const ft = n(d, "normalizedDepthFeet");
      const converted = d?.conversionPerformed === true;
      return {
        title: "Conversão e normalização",
        detail: converted
          ? `Entrada imperial detectada. Profundidade normalizada aproximada: ${m ?? "—"} m / ${ft ?? "—"} ft. A equivalência métrica/imperial é preservada para rastreabilidade.`
          : `Entrada métrica detectada. Equivalência aproximada: ${m ?? "—"} m / ${ft ?? "—"} ft. A coluna métrica é utilizada na consulta.`
      };
    }
    case "validation-002":
      return { title: "Validação de escopo", detail: `Máximo operacional carregado: ${n(d, "maxOperationalDepthMeters") ?? 39} m / ${n(d, "maxOperationalDepthFeet") ?? 130} ft.` };
    case "lookup-001":
      return { title: "Consulta de profundidade", detail: "Não foi possível aplicar uma coluna de profundidade válida da Tabela I. O cálculo fica bloqueado." };
    case "pressure-group-002":
      return { title: "Grupo de pressão final", detail: "Nenhum grupo é atribuído para um caso fora do escopo." };
    case "pressure-group-003":
      return { title: "Grupo de pressão final", detail: "Não se aplica porque não houve profundidade tabular válida." };
    case "rounding-001": {
      const m = n(d, "effectiveDepthMeters");
      const ft = n(d, "effectiveDepthFeet");
      return {
        title: "Arredondamento de profundidade",
        detail: d?.depthRounded === true
          ? `A profundidade informada não coincide exatamente com uma coluna. Regra aplicada: arredondar sempre para cima. Profundidade efetiva do primeiro mergulho: ${m} m / ${ft} ft.`
          : `A profundidade informada coincide com uma coluna da tabela. Profundidade efetiva do primeiro mergulho: ${m} m / ${ft} ft.`
      };
    }
    case "lookup-002":
      return { title: "Limite tabular encontrado", detail: `A Tabela I indica um limite sem descompressão de ${n(d, "limitMinutes") ?? "—"} minutos para a profundidade efetiva.` };
    case "pressure-group-004": {
      const group = s(d, "finalPressureGroup");
      const m = n(d, "effectiveDepthMeters");
      const ft = n(d, "effectiveDepthFeet");
      const bottom = n(d, "bottomTimeMinutes");
      const min = n(d, "matchedRangeMinExclusiveMinutes");
      const max = n(d, "matchedRangeMaxInclusiveMinutes");
      return {
        title: "Grupo de pressão final",
        detail: group
          ? `A Tabela I é consultada para obter a letra de classificação ao final do primeiro mergulho. Profundidade efetiva: ${m} m / ${ft} ft. Tempo avaliado: ${bottom} min. Faixa utilizada: acima de ${min} min e até ${max} min. Grupo final: ${group}.`
          : "Não foi possível atribuir um grupo de pressão final utilizável."
      };
    }
    case "surface-interval-004": {
      const requested = d?.repetitiveRequested === true;
      const previous = s(d, "previousDivePressureGroup");
      const interval = n(d, "surfaceIntervalMinutes");
      const resulting = s(d, "resultingPressureGroup");
      const start = n(d, "surfaceIntervalRangeStart");
      const end = n(d, "surfaceIntervalRangeEnd");
      return {
        title: requested ? "Intervalo de superfície / Tabela II" : "Intervalo de superfície",
        detail: !requested
          ? `Primeiro mergulho com grupo final ${previous ?? "—"}. O intervalo de superfície pode ser informado para calcular um mergulho repetitivo.`
          : resulting
            ? `Tabela II: grupo inicial ${previous}, intervalo informado ${interval} min, faixa aplicável ${start} a ${end} min. Novo grupo de pressão: ${resulting}.`
            : "A Tabela II não produziu um novo grupo de pressão utilizável para os dados informados."
      };
    }
    case "residual-nitrogen-001": {
      const group = s(d, "pressureGroupAfterSurfaceInterval");
      const m = n(d, "secondDiveEffectiveDepthMeters");
      const ft = n(d, "secondDiveEffectiveDepthFeet");
      const residual = n(d, "residualNitrogenMinutes");
      const adjusted = n(d, "adjustedNoDecompressionLimitMinutes");
      return {
        title: "Nitrogênio residual / Tabela III",
        detail: residual !== null
          ? `Tabela III: grupo ${group ?? "—"}, segunda profundidade efetiva ${m ?? "—"} m / ${ft ?? "—"} ft. Tempo de nitrogênio residual: ${residual} min. Limite ajustado: ${adjusted ?? "não disponível"}${adjusted !== null ? " min" : ""}.`
          : "A Tabela III não produziu um valor de nitrogênio residual utilizável para os dados informados."
      };
    }
    case "repetitive-dive-001":
      return {
        title: "Avaliação do segundo mergulho",
        detail: `Tempo equivalente total: ${n(d, "residualNitrogenMinutes") ?? "—"} min de nitrogênio residual + ${n(d, "secondDiveBottomTimeMinutes") ?? "—"} min do segundo mergulho = ${n(d, "totalEquivalentBottomTimeMinutes") ?? "—"} min. Tempo restante em relação ao limite ajustado: ${n(d, "remainingAdjustedNoDecompressionTimeMinutes") ?? "—"} min.`
      };
    case "comparison-001":
      return { title: "Comparação do tempo do primeiro mergulho", detail: `O tempo informado é avaliado exatamente, sem arredondamento. Cálculo: ${n(d, "limitMinutes") ?? "—"} - ${n(d, "bottomTimeMinutes") ?? "—"} = ${n(d, "remainingTimeMinutes") ?? "—"} minutos.` };
    case "result-001":
      return { title: "Resultado final", detail: "O motor consolidou o estado final do primeiro mergulho e, quando solicitado, do mergulho repetitivo. Revise os avisos e os valores acima manualmente." };
    default:
      return { title: step.title, detail: step.detail };
  }
}

export function localizedValidationStatus(raw: string, locale: AppLocale): string {
  if (!pt(locale)) return raw;
  if (raw.includes("validated") || raw.includes("prototype")) return "Validado para protótipo / pendente de auditoria final";
  return raw;
}
