import { useState, type FormEvent, type ReactNode } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { AUTH_COPY } from "./authCopy";
import { useAuth } from "./AuthProvider";
import "./auth.css";

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="auth-language" aria-label="Language">
      <button type="button" className={locale === "pt-BR" ? "is-active" : ""} onClick={() => setLocale("pt-BR")}>PT</button>
      <button type="button" className={locale === "es-AR" ? "is-active" : ""} onClick={() => setLocale("es-AR")}>ES</button>
    </div>
  );
}

function AuthMessage({ title, message, onSignOut }: { title: string; message: string; onSignOut?: () => void }) {
  const { locale } = useI18n();
  const copy = AUTH_COPY[locale];

  return (
    <main className="auth-shell">
      <LanguageSwitcher />
      <section className="auth-card">
        <span className="auth-eyebrow">DIVE COMMERCIAL PLANNER</span>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{message}</p>
        {onSignOut && <button className="auth-secondary" type="button" onClick={onSignOut}>{copy.signOut}</button>}
      </section>
    </main>
  );
}

function LoginScreen() {
  const { locale } = useI18n();
  const copy = AUTH_COPY[locale];
  const { sendOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await sendOtp(email);
      setPhase("code");
      setMessage(copy.codeSent);
    } catch (requestError) {
      console.error("Unable to send OTP", requestError);
      setError(copy.genericError);
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await verifyOtp(email, token);
    } catch (verificationError) {
      console.error("Unable to verify OTP", verificationError);
      setError(copy.invalidCode);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell">
      <LanguageSwitcher />
      <section className="auth-card">
        <div className="auth-heading">
          <span className="auth-eyebrow">{copy.eyebrow}</span>
          <h1 className="auth-title">{copy.title}</h1>
          <p className="auth-subtitle">{copy.subtitle}</p>
        </div>

        {phase === "email" ? (
          <form className="auth-form" onSubmit={submitEmail}>
            <label className="auth-field">
              <span>{copy.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                required
              />
            </label>
            <button className="auth-primary" type="submit" disabled={busy || !email.trim()}>
              {busy ? copy.sendingCode : copy.sendCode}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitCode}>
            <div className="auth-email-chip">{email}</div>
            <label className="auth-field">
              <span>{copy.codeLabel}</span>
              <input
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={token}
                onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={copy.codePlaceholder}
                required
              />
            </label>
            <button className="auth-primary" type="submit" disabled={busy || token.length !== 6}>
              {busy ? copy.verifyingCode : copy.verifyCode}
            </button>
            <button
              className="auth-secondary"
              type="button"
              disabled={busy}
              onClick={() => {
                setPhase("email");
                setToken("");
                setMessage(null);
                setError(null);
              }}
            >
              {copy.changeEmail}
            </button>
          </form>
        )}

        {message && <p className="auth-feedback auth-feedback--success">{message}</p>}
        {error && <p className="auth-feedback auth-feedback--error">{error}</p>}
        <p className="auth-closed-beta">{copy.closedBeta}</p>
      </section>
    </main>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const copy = AUTH_COPY[locale];
  const { configured, loading, session, profile, profileError, signOut } = useAuth();

  if (!configured) {
    return <AuthMessage title={copy.notConfiguredTitle} message={copy.notConfiguredMessage} />;
  }

  if (loading) {
    return (
      <main className="auth-shell">
        <div className="auth-loader" aria-label="Loading" />
      </main>
    );
  }

  if (!session) return <LoginScreen />;

  if (profileError || !profile) {
    return <AuthMessage title={copy.profileErrorTitle} message={copy.profileErrorMessage} onSignOut={() => void signOut()} />;
  }

  if (profile.status === "SUSPENDED") {
    return <AuthMessage title={copy.suspendedTitle} message={copy.suspendedMessage} onSignOut={() => void signOut()} />;
  }

  return (
    <>
      <button className="auth-session-button" type="button" onClick={() => void signOut()} title={profile.email ?? undefined}>
        {copy.signOut}
      </button>
      {children}
    </>
  );
}
