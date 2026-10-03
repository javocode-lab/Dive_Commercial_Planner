import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { copies, type AppLocale } from "./copy";

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  copy: (typeof copies)[AppLocale];
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "dive-ui-locale";

function getInitialLocale(): AppLocale {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "es-AR" || saved === "pt-BR") return saved;
  return "pt-BR";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, copy: copies[locale] }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

export function interpolate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}
