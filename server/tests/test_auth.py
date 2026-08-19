from types import SimpleNamespace
from supabase_auth.errors import AuthApiError
from conftest import EMAIL, NOME, USER_ID, fazer_sessao, fazer_usuario

CADASTRO = {"email": EMAIL, "password": "digitesuasenha", "name": NOME}
ACESSO = {"email": EMAIL, "password": "digitesuasenha"}


def resposta(user=None, session=None):
    return SimpleNamespace(user=user, session=session)


def test_cadastro_valido(client, auth_supabase):
    auth_supabase.auth.sign_up.return_value = resposta(
        fazer_usuario(), fazer_sessao()
    )

    r = client.post("/auth/signup", json=CADASTRO)

    assert r.status_code == 201
    corpo = r.json()
    assert corpo["access_token"] == "jwt-de-teste"
    assert corpo["token_type"] == "bearer"
    assert corpo["user"] == {"id": USER_ID, "email": EMAIL, "name": NOME}


def test_cadastro_com_email_ja_usado(client, auth_supabase):
    auth_supabase.auth.sign_up.side_effect = AuthApiError(
        "User already registered", 422, "user_already_exists"
    )

    r = client.post("/auth/signup", json=CADASTRO)

    assert r.status_code == 409
    assert r.json()["detail"] == "Este e-mail já está cadastrado."


def test_login_valido_devolve_token_e_usuario(client, auth_supabase):
    auth_supabase.auth.sign_in_with_password.return_value = resposta(
        fazer_usuario(), fazer_sessao("jwt-123")
    )

    r = client.post("/auth/login", json=ACESSO)

    assert r.status_code == 200
    corpo = r.json()
    assert corpo["access_token"] == "jwt-123"
    assert corpo["token_type"] == "bearer"
    assert corpo["user"]["name"] == NOME


def test_login_com_senha_errada(client, auth_supabase):
    auth_supabase.auth.sign_in_with_password.side_effect = AuthApiError(
        "Invalid login credentials", 400, "invalid_credentials"
    )

    r = client.post("/auth/login", json=ACESSO)

    assert r.status_code == 401
    assert r.json()["detail"] == "E-mail ou senha inválidos."

def test_autorizacao_sem_token_e_recusada(client):
    r = client.get("/tasks/")

    assert r.status_code in (401, 403)


def test_autorizacao_com_token_invalido(client, auth_dependencia):
    auth_dependencia.auth.get_user.side_effect = Exception("token invalido")

    r = client.get("/tasks/", headers={"Authorization": "Bearer token-falso"})

    assert r.status_code == 401