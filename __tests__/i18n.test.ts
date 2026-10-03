import { describe, expect, it } from "vitest";
import { copies } from "../src/i18n/copy";
import { interpolate } from "../src/i18n/I18nProvider";
import { localizedStep } from "../src/i18n/domainPresentation";


describe("BETA-01 i18n", () => {
  it("ships Brazilian Portuguese and Spanish copies", () => {
    expect(copies["pt-BR"].plan.firstBottomTime).toBe("Tempo de fundo — primeiro mergulho");
    expect(copies["es-AR"].plan.firstBottomTime).toBe("Tiempo de fondo — primera inmersión");
  });

  it("interpolates localized duration helpers", () => {
    expect(interpolate(copies["pt-BR"].duration.range, { min: "0 h 01 min", max: "12 h 00 min" }))
      .toContain("12 h 00 min");
  });

  it("localizes calculation trace data without changing engine values", () => {
    const localized = localizedStep({
      id: "lookup-002",
      category: "lookup",
      title: "Límite tabular encontrado",
      detail: "",
      data: { limitMinutes: 55 }
    }, "pt-BR");

    expect(localized.title).toBe("Limite tabular encontrado");
    expect(localized.detail).toContain("55 minutos");
  });
});
