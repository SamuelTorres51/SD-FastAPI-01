from datetime import date, timedelta
from conftest import USER_ID

AMANHA = (date.today() + timedelta(days=1)).isoformat()
TAREFA_ID = '39389842-5ab6-402c-86cc-ed747a66d30a'

TAREFA = {
  "id": TAREFA_ID,
  "user_id": USER_ID,
  "title": "Tarefa de mentirinha",
  "description": 'Essa tarefa é uma mentirinha',
  "due_date": AMANHA,
  "priority": "alta",
  "status": "pendente",
  "created_at": date.today().isoformat()
}

FORM = {
  "title": TAREFA["title"],
  "description": TAREFA['description'],
  "due_date": AMANHA,
  "priority": "alta",
  "status": "pendente"
}

def test_criar_tarefa(client, autenticado, banco):
    query = banco([TAREFA])

    response = client.post('/tasks/', json=FORM)

    assert response.status_code == 201
    assert response.json() == TAREFA
    assert query.payload["user_id"] == USER_ID

def test_listar_tarefas(client, autenticado, banco):
  banco([TAREFA])

  response = client.get("/tasks/")

  assert response.status_code == 200
  assert response.json() == [TAREFA]

def test_atualizar_tarefa(client, autenticado, banco):
  query = banco([{**TAREFA, "status": "concluida"}])

  response = client.put("/tasks/" + TAREFA_ID, json={"status": "concluida"})

  assert response.status_code == 200
  assert response.json()["status"] == "concluida"
  assert query.payload == {"status": "concluida"}

def test_excluir_tarefa(client, autenticado, banco):
  query = banco([TAREFA])

  response = client.delete("/tasks/" + TAREFA_ID)

  assert response.status_code == 200
  assert response.json() == {"message": "Tarefa excluída com sucesso"}
  assert query.filtros["id"] == TAREFA_ID