import os

os.environ.setdefault("SUPABASE_URL", "https://projeto-para-testagem.supabase.invalid")
os.environ.setdefault("SUPABASE_KEY", "chave-de-testagem")

import socket
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app

USER_ID = "11111111-1111-1111-1111-111111111111"
EMAIL = "fulano@distribuido.com"
NOME = "Fulano Teste Distribuido"
TOKEN = "token-de-testagem-e-de-mentira-kkkkk"
LOOPBACK = {"127.0.0.1", "::1", "localhost"}

@pytest.fixture(autouse=True)
def sem_rede(monkeypatch):
    conectar_original = socket.socket.connect

    def guardado(self, address, *args, **kwargs):
        host = address[0] if isinstance(address, tuple) else address
        if host not in LOOPBACK:
            raise AssertionError(f"A suíte tentou conectar em {host}")
        return conectar_original(self, address, *args, **kwargs)

    monkeypatch.setattr(socket.socket, "connect", guardado)

class FakeQuery:
    def __init__(self, resultado):
        self._resultado = resultado
        self.payload = None
        self.filtros = {}
        self.ordenacao = None

    def insert(self, data):
        self.payload = data
        return self

    def update(self, data):
        self.payload = data
        return self

    def delete(self):
        return self

    def select(self, *_args):
        return self

    def order(self, coluna, **kwargs):
        self.ordenacao = (coluna, kwargs)
        return self

    def eq(self, coluna, valor):
        self.filtros[coluna] = valor
        return self

    def execute(self):
        if isinstance(self._resultado, Exception):
            raise self._resultado
        return SimpleNamespace(data=self._resultado)


class FakeSupabase:
    def __init__(self, query):
        self.query = query
        self.tabela = None

    def table(self, nome):
        self.tabela = nome
        return self.query


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def autenticado():
    def fake_user():
        return {"user": SimpleNamespace(id=USER_ID), "token": TOKEN}

    app.dependency_overrides[get_current_user] = fake_user
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def banco(monkeypatch):
    registro = {}

    def configurar(resultado):
        query = FakeQuery(resultado)
        registro["query"] = query

        def fake_client(token):
            registro["token"] = token
            return FakeSupabase(query)

        monkeypatch.setattr("app.routers.tasks.get_supabase_client", fake_client)
        return query

    configurar.registro = registro
    return configurar


@pytest.fixture
def auth_supabase(monkeypatch):
    falso = MagicMock()
    monkeypatch.setattr("app.routers.auth.supabase", falso)
    return falso


@pytest.fixture
def auth_dependencia(monkeypatch):
    falso = MagicMock()
    monkeypatch.setattr("app.dependencies.auth.supabase", falso)
    return falso


def fazer_usuario(**kwargs):
    padrao = {
        "id": USER_ID,
        "email": EMAIL,
        "user_metadata": {"name": NOME},
        "identities": [SimpleNamespace(provider="email")],
    }
    padrao.update(kwargs)
    return SimpleNamespace(**padrao)


def fazer_sessao(access_token="jwt-de-teste"):
    return SimpleNamespace(access_token=access_token)
