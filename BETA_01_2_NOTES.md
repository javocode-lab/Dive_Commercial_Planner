# DCP BETA-01.2 — Portuguese BR Polish

## Objective
Refine Brazilian Portuguese copy for the closed beta without changing the calculation engine, datasets, table values, rounding rules, or result logic.

## Changes
- Replaced mixed-English hero label with `MODO RECREATIVO · BETA BRASIL`.
- Standardized `Tabelas I, II e III` wording.
- Standardized Brazilian diving terminology around `mergulho repetitivo`, `intervalo de superfície`, `grupo repetitivo` and `tempo de nitrogênio residual`.
- Clarified `limite ajustado sem descompressão` where Table III is presented.
- Reworded residual-nitrogen disclaimer to state that the value is tabular/equivalent time and does not represent a direct physiological measurement.
- Improved repetitive-dive messages, validation labels and calculation-trace copy.
- Improved Portuguese localization of the technical-source trace so Spanish table labels do not leak into pt-BR UI.
- Added i18n regression tests for the terminology above.

## Out of scope
- No changes to AirDiveCalculator.
- No changes to Tables I, II or III datasets.
- No changes to NDL values, pressure/repetitive group calculations, residual nitrogen values, rounding, units or validation rules.
- No authentication, telemetry or analytics changes.

## Terminology basis
Brazilian technical references commonly use `mergulho repetitivo`, `intervalo de superfície`, `tempo de nitrogênio residual` and `designação/grupo repetitivo`. BETA-01.2 applies those terms only to presentation text; internal engine identifiers remain unchanged.
