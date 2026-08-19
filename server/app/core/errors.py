from fastapi import HTTPException
from postgrest.exceptions import APIError
from supabase_auth.errors import AuthApiError


AUTH_ERROR_MAP: dict[str, tuple[int, str]] = {
    "user_already_exists": (409, "Este e-mail já está cadastrado."),
    "email_exists": (409, "Este e-mail já está cadastrado."),
    "invalid_credentials": (401, "E-mail ou senha inválidos."),
    "email_not_confirmed": (401, "Confirme seu e-mail antes de entrar."),
    "weak_password": (422, "A senha é muito fraca. Use pelo menos 6 caracteres."),
    "validation_failed": (422, "Os dados informados são inválidos."),
    "email_address_invalid": (422, "Informe um e-mail válido."),
    "signup_disabled": (403, "O cadastro está desabilitado no momento."),
    "over_request_rate_limit": (429, "Muitas tentativas. Aguarde alguns instantes."),
    "over_email_send_rate_limit": (429, "Muitos e-mails enviados. Aguarde alguns instantes."),
}


def handle_auth_error(error: AuthApiError, fallback: str) -> HTTPException:
    code = getattr(error, "code", None)
    status = getattr(error, "status", None)

    if code in AUTH_ERROR_MAP:
        mapped_status, message = AUTH_ERROR_MAP[code]

        return HTTPException(status_code=mapped_status, detail=message)

    if isinstance(status, int) and 400 <= status < 500:
        return HTTPException(status_code=status, detail=fallback)

    return HTTPException(
        status_code=502,
        detail="Serviço de autenticação indisponível no momento."
    )


SUPABASE_ERROR_MAP: dict[str, tuple[int, str]] = {
    "23505": (409, "Já existe um registro com esses dados."),
    "23503": (400, "O registro possui uma referência inválida."),
    "23502": (400, "Há campos obrigatórios sem preenchimento."),
    "23514": (400, "Algum campo tem valor fora do permitido."),
    "22P02": (400, "Identificador inválido."),
    "42501": (403, "Você não possui permissão para realizar esta operação."),
    "PGRST116": (404, "Registro não encontrado."),
    "PGRST204": (400, "Algum campo enviado não existe na tabela."),
    "PGRST301": (401, "Sessão expirada. Entre novamente."),
    "PGRST302": (401, "Autenticação necessária."),
}


def handle_supabase_error(error: APIError) -> HTTPException:
    code = getattr(error, "code", None) or ""

    if code in SUPABASE_ERROR_MAP:
        status, message = SUPABASE_ERROR_MAP[code]

        return HTTPException(status_code=status, detail=message)

    if code.startswith("22") or code.startswith("23"):
        return HTTPException(
            status_code=400,
            detail="Os dados enviados são inválidos."
        )

    if code.startswith("PGRST1"):
        return HTTPException(
            status_code=400,
            detail="A requisição é inválida."
        )

    return HTTPException(
        status_code=500,
        detail="Erro ao processar a operação no banco de dados."
    )
