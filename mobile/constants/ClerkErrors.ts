export const ClerkErrors: Record<string, string> = {
  // Authentication errors
  form_param_nil:
    "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
  form_identifier_not_found:
    "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
  form_password_incorrect:
    "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
  session_exists: "Você já está conectado.",
  identifier_already_signed_in: "Você já está conectado com esta conta.",

  // Account status errors
  user_locked:
    "Sua conta foi bloqueada temporariamente. Tente novamente mais tarde.",
  account_not_found:
    "Conta não encontrada. Verifique seu email ou crie uma nova conta.",
  too_many_requests:
    "Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.",
  form_identifier_exists: "Você já possui uma conta com este email.",

  // Validation errors
  form_param_format_invalid:
    "Formato de email inválido. Digite um email válido.",
  form_password_pwned:
    "Esta senha foi comprometida em vazamentos de dados. Escolha uma senha mais segura.",
  form_password_validation_failed:
    "Senha muito fraca. Use pelo menos 8 caracteres com letras e números.",

  // Network/Server errors
  clerk_key_invalid: "Erro de configuração. Entre em contato com o suporte.",
  authentication_invalid: "Sessão expirada. Faça login novamente.",
  network_error: "Erro de conexão. Verifique sua internet e tente novamente.",

  // Generic fallback
  generic_error: "Ocorreu um erro inesperado. Tente novamente.",
};
