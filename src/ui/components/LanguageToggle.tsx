import { useI18n } from "../../i18n/I18nProvider";

export function LanguageToggle() {
  const { locale, setLocale, copy } = useI18n();
  return (
    <div className="language-toggle" role="group" aria-label={copy.language.selectorLabel}>
      <button
        type="button"
        className={locale === "pt-BR" ? "language-toggle__button language-toggle__button--active" : "language-toggle__button"}
        aria-pressed={locale === "pt-BR"}
        title={copy.language.portuguese}
        onClick={() => setLocale("pt-BR")}
      >
        PT
      </button>
      <button
        type="button"
        className={locale === "es-AR" ? "language-toggle__button language-toggle__button--active" : "language-toggle__button"}
        aria-pressed={locale === "es-AR"}
        title={copy.language.spanish}
        onClick={() => setLocale("es-AR")}
      >
        ES
      </button>
    </div>
  );
}
