from fastapi import APIRouter, Depends, HTTPException

from app.database.supabase import get_supabase_client
from app.dependencies.auth import get_current_user
from app.schemas.task import TaskCreate


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post("/")
def create_task(
    data: TaskCreate,
    auth=Depends(get_current_user)
):
    user = auth["user"]
    token = auth["token"]

    supabase = get_supabase_client(token)

    task_data = {
        "user_id": user.id,
        "title": data.title,
        "description": data.description,
        "due_date": data.dueDate.isoformat(),
        "priority": data.priority.value,
        "status": data.status.value
    }


    try:
        response = (
            supabase
            .table("tasks")
            .insert(task_data)
            .select("*")
            .execute()
)

        return response.data[0]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao criar tarefa: {str(e)}"
        )

@router.get("/")
def get_tasks(
    auth=Depends(get_current_user)
):
    token = auth["token"]

    supabase = get_supabase_client(token)

    try:
        response = (
            supabase
            .table("tasks")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar tarefas: {str(e)}"
        )