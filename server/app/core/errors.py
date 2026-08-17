from fastapi import HTTPException
from postgrest.exceptions import APIError


def handle_supabase_error(error: APIError):
    code = getattr(error, "code", None)

    if code == "23505":
        raise HTTPException(
            status_code=409,
            detail="Já existe um registro com esses dados."
        )

    if code == "23503":
        raise HTTPException(
            status_code=400,
            detail="O registro possui uma referência inválida."
        )

    if code == "42501":
        raise HTTPException(
            status_code=403,
            detail="Você não possui permissão para realizar esta operação."
        )

    raise HTTPException(
        status_code=500,
        detail="Erro ao processar a operação no banco de dados."
    )