from fastapi import APIRouter, HTTPException

from app.database.supabase import supabase
from app.schemas.auth import SignupRequest, LoginRequest


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(data: SignupRequest):

    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })

        if response.user is None:
            raise HTTPException(
                status_code=400,
                detail="Não foi possível cadastrar o usuário."
            )

        return {
            "message": "Usuário cadastrado com sucesso",
            "user": response.user
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"Erro no signup: {e}")

        raise HTTPException(
            status_code=500,
            detail="Erro interno ao cadastrar usuário."
        )


@router.post("/login")
def login(data: LoginRequest):

    response = supabase.auth.sign_in_with_password({
        "email": data.email,
        "password": data.password
    })

    return {
        "access_token": response.session.access_token,
        "token_type": "bearer"
    }