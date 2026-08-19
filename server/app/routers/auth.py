from fastapi import APIRouter, HTTPException, status

from app.core.errors import AuthApiError, handle_auth_error
from app.database.supabase import supabase
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def build_user(user) -> dict:
    metadata = user.user_metadata or {}

    return {
        "id": str(user.id),
        "email": user.email or "",
        "name": metadata.get("name") or ""
    }


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    response_model=AuthResponse
)
def signup(data: SignupRequest):

    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {"name": data.name}
            }
        })

    except AuthApiError as error:
        raise handle_auth_error(error, "Não foi possível cadastrar o usuário.")

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao cadastrar usuário."
        )

    if response.user is None:
        raise HTTPException(
            status_code=400,
            detail="Não foi possível cadastrar o usuário."
        )

    identities = getattr(response.user, "identities", None)

    if identities is not None and len(identities) == 0:
        raise HTTPException(
            status_code=409,
            detail="Este e-mail já está cadastrado."
        )

    if response.session is None:
        raise HTTPException(
            status_code=400,
            detail="Não foi possível cadastrar o usuário."
        )

    return {
        "access_token": response.session.access_token,
        "token_type": "bearer",
        "user": build_user(response.user)
    }


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest):

    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

    except AuthApiError as error:
        raise handle_auth_error(error, "E-mail ou senha inválidos.")

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao efetuar login."
        )

    if response.session is None or response.user is None:
        raise HTTPException(
            status_code=401,
            detail="Não foi possível iniciar a sessão."
        )

    return {
        "access_token": response.session.access_token,
        "token_type": "bearer",
        "user": build_user(response.user)
    }
