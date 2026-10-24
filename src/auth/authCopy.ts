import type { AppLocale } from "../i18n/copy";

export const AUTH_COPY: Record<AppLocale, {
  eyebrow: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendCode: string;
  sendingCode: string;
  codeLabel: string;
  codePlaceholder: string;
  verifyCode: string;
  verifyingCode: string;
  changeEmail: string;
  codeSent: string;
  genericError: string;
  invalidCode: string;
  notConfiguredTitle: string;
  notConfiguredMessage: string;
  profileErrorTitle: string;
  profileErrorMessage: string;
  suspendedTitle: string;
  suspendedMessage: string;
  signOut: string;
  closedBeta: string;
}> = {
  "pt-BR": {
    eyebrow: "BETA FECHADA · BRASIL",
    title: "Acesso de testador",
    subtitle: "Informe o e-mail convidado para receber um código de acesso de 6 dígitos.",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    sendCode: "Enviar código",
    sendingCode: "Enviando…",
    codeLabel: "Código de acesso",
    codePlaceholder: "000000",
    verifyCode: "Entrar",
    verifyingCode: "Verificando…",
    changeEmail: "Usar outro e-mail",
    codeSent: "Código enviado. Verifique sua caixa de entrada e o spam.",
    genericError: "Não foi possível iniciar o acesso. Verifique o e-mail e tente novamente.",
    invalidCode: "Código inválido ou expirado. Solicite um novo código e tente novamente.",
    notConfiguredTitle: "Autenticação ainda não configurada",
    notConfiguredMessage: "Faltam as variáveis públicas do Supabase neste ambiente.",
    profileErrorTitle: "Perfil de beta não encontrado",
    profileErrorMessage: "Sua conta existe, mas não há um perfil de testador válido associado.",
    suspendedTitle: "Acesso suspenso",
    suspendedMessage: "Este acesso à beta foi suspenso. Entre em contato com o responsável pelo teste.",
    signOut: "Sair",
    closedBeta: "Somente usuários convidados podem acessar esta versão."
  },
  "es-AR": {
    eyebrow: "BETA CERRADA · BRASIL",
    title: "Acceso de tester",
    subtitle: "Ingresá el correo invitado para recibir un código de acceso de 6 dígitos.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "vos@ejemplo.com",
    sendCode: "Enviar código",
    sendingCode: "Enviando…",
    codeLabel: "Código de acceso",
    codePlaceholder: "000000",
    verifyCode: "Ingresar",
    verifyingCode: "Verificando…",
    changeEmail: "Usar otro correo",
    codeSent: "Código enviado. Revisá tu bandeja de entrada y spam.",
    genericError: "No se pudo iniciar el acceso. Verificá el correo e intentá nuevamente.",
    invalidCode: "Código inválido o vencido. Solicitá uno nuevo e intentá nuevamente.",
    notConfiguredTitle: "Autenticación todavía no configurada",
    notConfiguredMessage: "Faltan las variables públicas de Supabase en este entorno.",
    profileErrorTitle: "Perfil de beta no encontrado",
    profileErrorMessage: "La cuenta existe, pero no tiene un perfil válido de tester asociado.",
    suspendedTitle: "Acceso suspendido",
    suspendedMessage: "Este acceso a la beta fue suspendido. Contactá al responsable de la prueba.",
    signOut: "Salir",
    closedBeta: "Solo los usuarios invitados pueden acceder a esta versión."
  }
};
