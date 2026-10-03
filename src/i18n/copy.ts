export const esAR = {
  localeName: "Español",
  common: {
    back: "Atrás",
    home: "Inicio",
    calculate: "Calcular",
    result: "Resultado",
    newPlan: "Nuevo plan",
    editData: "Editar datos",
    manualValidation: "Validación manual",
    calculationDetail: "Detalle del cálculo",
    notApplicable: "No aplica",
    pending: "Pendiente",
    air: "Aire",
    metric: "Métrico",
    imperial: "Imperial",
    step: "Paso",
    source: "Fuente",
    dataset: "Dataset",
    engine: "Motor",
    validation: "Validación",
    warnings: "Advertencias"
  },
  language: {
    selectorLabel: "Idioma",
    portuguese: "Português",
    spanish: "Español"
  },
  theme: {
    toDark: "Cambiar a tema oscuro",
    toLight: "Cambiar a tema claro"
  },
  start: {
    eyebrow: "RECREATIONAL MODE · BETA BRASIL",
    subtitle: "Planificación con aire · Tabla I/II/III · Detalle del cálculo",
    safetyTitle: "Herramienta de planificación y verificación",
    safetyMessage: "No reemplaza formación, tablas oficiales, ordenador de buceo, supervisión ni criterio profesional. El resultado debe revisarse manualmente.",
    allowsTitle: "Esta versión permite:",
    features: [
      "Gas: aire",
      "Métrico e imperial",
      "Profundidad con redondeo hacia arriba",
      "Tiempo exacto contra límite de Tabla I",
      "Grupo de presión final",
      "Intervalo en superficie según Tabla II",
      "Nitrógeno residual en minutos según Tabla III",
      "Resultado simple + Detalle del cálculo",
      "Checklist de validación manual"
    ],
    startButton: "Nueva planificación recreativa",
    demoButton: "Ver ejemplo repetitivo"
  },
  plan: {
    title: "Plan recreativo con aire",
    subtitle: "Ingresá profundidad, tiempo de fondo y, si corresponde, datos de buceo repetitivo.",
    unitsTitle: "Sistema de unidades",
    metricDescription: "Profundidad en metros",
    metricExample: "Ejemplo: 18 m",
    imperialDescription: "Profundidad en pies",
    imperialExample: "Ejemplo: 60 ft",
    firstDive: "Primera inmersión",
    firstBottomTime: "Tiempo de fondo — primera inmersión",
    bottomTimeHelper: "Duración utilizada para el cálculo tabular.",
    planningType: "Tipo de planificación",
    simpleDive: "Inmersión simple",
    simpleDiveDescription: "Calcula Tabla I, límite sin descompresión y grupo final.",
    repetitiveDive: "Buceo repetitivo",
    repetitiveDiveDescription: "Agrega intervalo en superficie, segunda inmersión y nitrógeno residual en minutos.",
    newDataTitle: "Dato nuevo requerido",
    newDataMessage: "Ingresá cuánto tiempo permaneció fuera del agua el buzo entre la primera y la segunda inmersión.",
    surfaceInterval: "Tiempo fuera del agua",
    surfaceIntervalHelper: "Intervalo en superficie entre la primera y la segunda inmersión.",
    secondDive: "Segunda inmersión",
    secondDepth: "Profundidad planificada de la segunda inmersión",
    secondBottomTime: "Tiempo de fondo — segunda inmersión",
    secondBottomTimeHelper: "Duración planificada para la segunda inmersión.",
    gasScope: "Otros gases quedan fuera del alcance de esta versión.",
    safetyTitle: "Planificación asistida",
    safetyMessage: "Este resultado no autoriza una inmersión. Debe compararse manualmente con criterio profesional, tablas oficiales y procedimientos aplicables."
  },
  duration: {
    invalidFormat: "Ingresá HH:MM o escribí los números seguidos. Ejemplo: 145 = 01:45.",
    range: "La duración debe estar entre {min} y {max}.",
    emptyHint: "Podés escribir 145 → 01:45 (1 h 45 min).",
    currentHint: "Podés escribir 145 → 01:45 · Valor actual: {value}",
    quickValues: "Valores rápidos para {label}"
  },
  depth: {
    selector: "Selector de profundidad",
    decrease: "Disminuir profundidad",
    increase: "Aumentar profundidad"
  },
  result: {
    title: "Resultado recreativo",
    subtitle: "Resumen simple. El procedimiento completo está en Detalle del cálculo.",
    reviewMessage: "Resultado generado para revisión manual. No reemplaza formación, tablas oficiales, ordenador de buceo ni criterio profesional.",
    planType: "Tipo de plan",
    repetitive: "Repetitivo",
    simple: "Simple",
    depth1: "Profundidad 1",
    bottomTime1: "Tiempo fondo 1",
    effectiveDepth1: "Profundidad efectiva 1",
    roundedUp: "Redondeada hacia arriba",
    noDepthRounding: "Sin redondeo de profundidad",
    tableILimit: "Límite Tabla I",
    remainingTime1: "Tiempo restante 1",
    exceedsLimit: "Excede el límite",
    finalPressureGroup: "Grupo presión final",
    assignedByTableI: "Asignado por Tabla I",
    structureReady: "Estructura preparada para repetitivas",
    noGroupCalculation: "Sin cálculo de grupo",
    repetitiveDive: "Buceo repetitivo",
    surfaceInterval: "Intervalo superficie",
    timeOutOfWater: "Tiempo fuera del agua",
    newGroup: "Nuevo grupo",
    calculatedByTableII: "Calculado por Tabla II",
    effectiveDepth2: "Profundidad efectiva 2",
    accordingInputDepth: "Según profundidad ingresada",
    bottomTime2: "Tiempo fondo 2",
    residualNitrogen: "Nitrógeno residual",
    residualDetail: "Tiempo equivalente según Tabla III; no medición directa en sangre",
    adjustedLimit: "Límite ajustado",
    totalEquivalentTime: "Tiempo equivalente total",
    repetitiveStatus: "Estado repetitiva",
    noRequested: "No solicitado",
    withinAdjustedLimit: "Dentro del límite ajustado",
    exceedsAdjustedLimit: "Excede límite ajustado",
    surfaceOutOfTable: "Intervalo fuera de tabla",
    unsupportedSecondDepth: "Segunda profundidad no soportada",
    unsupportedCell: "Celda no soportada",
    blockedByFirstDive: "Bloqueado por primera inmersión",
    invalidRepetitiveData: "Datos repetitivos inválidos",
    requiresReview: "Requiere revisión",
    detailButton: "Ver Detalle del cálculo"
  },
  detail: {
    title: "Detalle del cálculo",
    subtitle: "Procedimiento auditable generado por el motor. Esta vista debe ser revisada manualmente antes de cualquier decisión operativa.",
    traceTitle: "Trazabilidad",
    traceMessage: "La UI no reconstruye la explicación: muestra los pasos devueltos por el motor de cálculo.",
    categories: {
      input: ["Datos ingresados", "Valores originales recibidos por el motor antes de aplicar validaciones, conversiones o reglas."],
      conversion: ["Conversión y normalización", "Cómo se interpretó la profundidad según el sistema de unidades seleccionado."],
      validation: ["Validaciones", "Controles previos que determinan si el caso puede evaluarse con la tabla activa."],
      rounding: ["Redondeos aplicados", "Reglas conservadoras usadas para elegir la profundidad efectiva de tabla."],
      lookup: ["Búsqueda en tabla", "Fila/columna utilizada por el motor para recuperar el límite correspondiente."],
      pressureGroup: ["Grupo de presión final", "Letra de clasificación al final de la inmersión simple, calculada desde Tabla I."],
      surfaceInterval: ["Intervalo en superficie", "Consulta de Tabla II para transformar el grupo final de la primera inmersión en nuevo grupo de presión."],
      residualNitrogen: ["Nitrógeno residual", "Consulta de Tabla III para expresar el nitrógeno residual como tiempo equivalente en minutos."],
      repetitiveDive: ["Buceo repetitivo", "Evaluación de segunda inmersión con nitrógeno residual, tiempo equivalente total y límite ajustado."],
      comparison: ["Cálculo", "Comparación exacta entre tiempo de fondo ingresado y límite tabular encontrado."],
      result: ["Resultado", "Estado final producido por el motor y advertencias asociadas."]
    },
    technicalSource: "Fuente técnica",
    technicalSourceDescription: "Referencia conservada para auditoría del cálculo y revisión manual.",
    tableUsed: "Tabla utilizada",
    versionBasis: "Versión / base"
  },
  validation: {
    title: "Validación manual",
    subtitle: "Checklist de revisión. No equivale a autorización automática de inmersión.",
    complete: "Checklist completo",
    pending: "Checklist pendiente",
    completeMessage: "La revisión manual fue marcada como completa, pero la decisión operacional sigue fuera de la app.",
    pendingMessage: "El responsable debe revisar todos los puntos antes de considerar el resultado como verificado.",
    technicalStatus: "Estado técnico",
    items: [
      ["inputReviewed", "Datos revisados", "Profundidad, tiempo, gas y sistema de unidades fueron comparados con el plan real."],
      ["conversionsReviewed", "Conversiones y redondeos revisados", "La profundidad efectiva y el redondeo hacia arriba fueron revisados manualmente."],
      ["rulesReviewed", "Reglas revisadas", "Se confirmó el uso de aire, Tabla I/II/III según corresponda y tiempo exacto contra límite."],
      ["pressureGroupReviewed", "Grupo de presión revisado", "Se revisó la letra final de Tabla I antes de usarla como entrada de repetitivas."],
      ["surfaceIntervalReviewed", "Intervalo en superficie revisado", "Se revisó el tiempo fuera del agua y el nuevo grupo calculado por Tabla II."],
      ["residualNitrogenReviewed", "Nitrógeno residual revisado", "Se revisó el tiempo de nitrógeno residual en minutos según Tabla III. No se interpreta como medición médica directa."],
      ["secondDiveReviewed", "Segunda inmersión revisada", "Se revisó profundidad efectiva, tiempo de fondo, límite ajustado y tiempo equivalente total."],
      ["resultReviewed", "Resultado revisado", "El límite, tiempo usado, tiempo restante y estado final fueron comparados con criterio profesional."],
      ["warningsReviewed", "Advertencias revisadas", "Se revisaron bloqueos, excesos, margen bajo o fuera de alcance."],
      ["notAuthorizationAccepted", "No representa autorización automática", "La validación de esta pantalla no autoriza por sí sola una inmersión."]
    ]
  }
} as const;

type DeepStrings<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly (infer U)[]
      ? readonly (U extends readonly unknown[] ? readonly string[] : string)[]
      : T[K] extends object
        ? DeepStrings<T[K]>
        : T[K];
};

export type AppCopy = DeepStrings<typeof esAR>;

export const ptBR: AppCopy = {
  localeName: "Português (Brasil)",
  common: {
    back: "Voltar",
    home: "Início",
    calculate: "Calcular",
    result: "Resultado",
    newPlan: "Novo plano",
    editData: "Editar dados",
    manualValidation: "Validação manual",
    calculationDetail: "Detalhes do cálculo",
    notApplicable: "Não se aplica",
    pending: "Pendente",
    air: "Ar",
    metric: "Métrico",
    imperial: "Imperial",
    step: "Etapa",
    source: "Fonte",
    dataset: "Dataset",
    engine: "Motor",
    validation: "Validação",
    warnings: "Avisos"
  },
  language: {
    selectorLabel: "Idioma",
    portuguese: "Português",
    spanish: "Español"
  },
  theme: {
    toDark: "Mudar para tema escuro",
    toLight: "Mudar para tema claro"
  },
  start: {
    eyebrow: "RECREATIONAL MODE · BETA BRASIL",
    subtitle: "Planejamento com ar · Tabelas I/II/III · Detalhes do cálculo",
    safetyTitle: "Ferramenta de planejamento e verificação",
    safetyMessage: "Não substitui treinamento, tabelas oficiais, computador de mergulho, supervisão nem critério profissional. O resultado deve ser revisado manualmente.",
    allowsTitle: "Esta versão permite:",
    features: [
      "Gás: ar",
      "Métrico e imperial",
      "Profundidade com arredondamento para cima",
      "Tempo exato comparado ao limite da Tabela I",
      "Grupo de pressão final",
      "Intervalo de superfície conforme a Tabela II",
      "Nitrogênio residual em minutos conforme a Tabela III",
      "Resultado simples + Detalhes do cálculo",
      "Checklist de validação manual"
    ],
    startButton: "Novo planejamento recreativo",
    demoButton: "Ver exemplo de mergulho repetitivo"
  },
  plan: {
    title: "Planejamento recreativo com ar",
    subtitle: "Informe a profundidade, o tempo de fundo e, quando aplicável, os dados do mergulho repetitivo.",
    unitsTitle: "Sistema de unidades",
    metricDescription: "Profundidade em metros",
    metricExample: "Exemplo: 18 m",
    imperialDescription: "Profundidade em pés",
    imperialExample: "Exemplo: 60 ft",
    firstDive: "Primeiro mergulho",
    firstBottomTime: "Tempo de fundo — primeiro mergulho",
    bottomTimeHelper: "Duração utilizada para o cálculo tabular.",
    planningType: "Tipo de planejamento",
    simpleDive: "Mergulho simples",
    simpleDiveDescription: "Calcula a Tabela I, o limite sem descompressão e o grupo final.",
    repetitiveDive: "Mergulho repetitivo",
    repetitiveDiveDescription: "Adiciona intervalo de superfície, segundo mergulho e nitrogênio residual em minutos.",
    newDataTitle: "Novo dado necessário",
    newDataMessage: "Informe quanto tempo o mergulhador permaneceu fora da água entre o primeiro e o segundo mergulho.",
    surfaceInterval: "Tempo fora da água",
    surfaceIntervalHelper: "Intervalo de superfície entre o primeiro e o segundo mergulho.",
    secondDive: "Segundo mergulho",
    secondDepth: "Profundidade planejada do segundo mergulho",
    secondBottomTime: "Tempo de fundo — segundo mergulho",
    secondBottomTimeHelper: "Duração planejada para o segundo mergulho.",
    gasScope: "Outros gases estão fora do escopo desta versão.",
    safetyTitle: "Planejamento assistido",
    safetyMessage: "Este resultado não autoriza um mergulho. Deve ser comparado manualmente com critério profissional, tabelas oficiais e procedimentos aplicáveis."
  },
  duration: {
    invalidFormat: "Informe HH:MM ou digite os números em sequência. Exemplo: 145 = 01:45.",
    range: "A duração deve estar entre {min} e {max}.",
    emptyHint: "Você pode digitar 145 → 01:45 (1 h 45 min).",
    currentHint: "Você pode digitar 145 → 01:45 · Valor atual: {value}",
    quickValues: "Valores rápidos para {label}"
  },
  depth: {
    selector: "Seletor de profundidade",
    decrease: "Diminuir profundidade",
    increase: "Aumentar profundidade"
  },
  result: {
    title: "Resultado recreativo",
    subtitle: "Resumo simples. O procedimento completo está em Detalhes do cálculo.",
    reviewMessage: "Resultado gerado para revisão manual. Não substitui treinamento, tabelas oficiais, computador de mergulho nem critério profissional.",
    planType: "Tipo de plano",
    repetitive: "Repetitivo",
    simple: "Simples",
    depth1: "Profundidade 1",
    bottomTime1: "Tempo de fundo 1",
    effectiveDepth1: "Profundidade efetiva 1",
    roundedUp: "Arredondada para cima",
    noDepthRounding: "Sem arredondamento de profundidade",
    tableILimit: "Limite Tabela I",
    remainingTime1: "Tempo restante 1",
    exceedsLimit: "Excede o limite",
    finalPressureGroup: "Grupo de pressão final",
    assignedByTableI: "Atribuído pela Tabela I",
    structureReady: "Estrutura preparada para repetitivos",
    noGroupCalculation: "Sem cálculo de grupo",
    repetitiveDive: "Mergulho repetitivo",
    surfaceInterval: "Intervalo de superfície",
    timeOutOfWater: "Tempo fora da água",
    newGroup: "Novo grupo",
    calculatedByTableII: "Calculado pela Tabela II",
    effectiveDepth2: "Profundidade efetiva 2",
    accordingInputDepth: "Conforme profundidade informada",
    bottomTime2: "Tempo de fundo 2",
    residualNitrogen: "Nitrogênio residual",
    residualDetail: "Tempo equivalente conforme a Tabela III; não é medição direta no sangue",
    adjustedLimit: "Limite ajustado",
    totalEquivalentTime: "Tempo equivalente total",
    repetitiveStatus: "Status do repetitivo",
    noRequested: "Não solicitado",
    withinAdjustedLimit: "Dentro do limite ajustado",
    exceedsAdjustedLimit: "Excede o limite ajustado",
    surfaceOutOfTable: "Intervalo fora da tabela",
    unsupportedSecondDepth: "Segunda profundidade não suportada",
    unsupportedCell: "Célula não suportada",
    blockedByFirstDive: "Bloqueado pelo primeiro mergulho",
    invalidRepetitiveData: "Dados repetitivos inválidos",
    requiresReview: "Requer revisão",
    detailButton: "Ver Detalhes do cálculo"
  },
  detail: {
    title: "Detalhes do cálculo",
    subtitle: "Procedimento auditável gerado pelo motor. Esta tela deve ser revisada manualmente antes de qualquer decisão operacional.",
    traceTitle: "Rastreabilidade",
    traceMessage: "A interface não reconstrói a explicação: ela mostra as etapas devolvidas pelo motor de cálculo.",
    categories: {
      input: ["Dados informados", "Valores originais recebidos pelo motor antes da aplicação de validações, conversões ou regras."],
      conversion: ["Conversão e normalização", "Como a profundidade foi interpretada conforme o sistema de unidades selecionado."],
      validation: ["Validações", "Verificações prévias que determinam se o caso pode ser avaliado com a tabela ativa."],
      rounding: ["Arredondamentos aplicados", "Regras conservadoras utilizadas para escolher a profundidade efetiva da tabela."],
      lookup: ["Consulta à tabela", "Linha/coluna utilizada pelo motor para recuperar o limite correspondente."],
      pressureGroup: ["Grupo de pressão final", "Letra de classificação ao final do mergulho simples, calculada a partir da Tabela I."],
      surfaceInterval: ["Intervalo de superfície", "Consulta à Tabela II para transformar o grupo final do primeiro mergulho em um novo grupo de pressão."],
      residualNitrogen: ["Nitrogênio residual", "Consulta à Tabela III para expressar o nitrogênio residual como tempo equivalente em minutos."],
      repetitiveDive: ["Mergulho repetitivo", "Avaliação do segundo mergulho com nitrogênio residual, tempo equivalente total e limite ajustado."],
      comparison: ["Cálculo", "Comparação exata entre o tempo de fundo informado e o limite tabular encontrado."],
      result: ["Resultado", "Status final produzido pelo motor e avisos associados."]
    },
    technicalSource: "Fonte técnica",
    technicalSourceDescription: "Referência preservada para auditoria do cálculo e revisão manual.",
    tableUsed: "Tabela utilizada",
    versionBasis: "Versão / base"
  },
  validation: {
    title: "Validação manual",
    subtitle: "Checklist de revisão. Não equivale à autorização automática de um mergulho.",
    complete: "Checklist concluído",
    pending: "Checklist pendente",
    completeMessage: "A revisão manual foi marcada como concluída, mas a decisão operacional continua fora do aplicativo.",
    pendingMessage: "O responsável deve revisar todos os itens antes de considerar o resultado verificado.",
    technicalStatus: "Status técnico",
    items: [
      ["inputReviewed", "Dados revisados", "Profundidade, tempo, gás e sistema de unidades foram comparados com o plano real."],
      ["conversionsReviewed", "Conversões e arredondamentos revisados", "A profundidade efetiva e o arredondamento para cima foram revisados manualmente."],
      ["rulesReviewed", "Regras revisadas", "Foi confirmado o uso de ar, Tabelas I/II/III conforme aplicável e tempo exato comparado ao limite."],
      ["pressureGroupReviewed", "Grupo de pressão revisado", "A letra final da Tabela I foi revisada antes de ser usada como entrada para repetitivos."],
      ["surfaceIntervalReviewed", "Intervalo de superfície revisado", "O tempo fora da água e o novo grupo calculado pela Tabela II foram revisados."],
      ["residualNitrogenReviewed", "Nitrogênio residual revisado", "O tempo de nitrogênio residual em minutos conforme a Tabela III foi revisado. Não é interpretado como medição médica direta."],
      ["secondDiveReviewed", "Segundo mergulho revisado", "Foram revisados profundidade efetiva, tempo de fundo, limite ajustado e tempo equivalente total."],
      ["resultReviewed", "Resultado revisado", "Limite, tempo utilizado, tempo restante e status final foram comparados com critério profissional."],
      ["warningsReviewed", "Avisos revisados", "Foram revisados bloqueios, excessos, margem baixa ou casos fora do escopo."],
      ["notAuthorizationAccepted", "Não representa autorização automática", "A validação desta tela, por si só, não autoriza um mergulho."]
    ]
  }
};

export const copies = {
  "es-AR": esAR,
  "pt-BR": ptBR
} as const;

export type AppLocale = keyof typeof copies;
