from fastapi import APIRouter

from app.database.supabase import supabase
from app.schemas.auth import SignupRequest, LoginRequest


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(data: SignupRequest):

    response = supabase.auth.sign_up({
        "email": data.email,
        "password": data.password
    })

    return {
        "message": "Usuário cadastrado com sucesso",
        "user": response.user
    }


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