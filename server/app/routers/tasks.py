from fastapi import APIRouter, Depends, HTTPException

from app.database.supabase import get_supabase_client
from app.dependencies.auth import get_current_user
from app.schemas.task import TaskCreate, TaskUpdate


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



# Endpoint Update Task

@router.put("/{task_id}")
def update_task(
    task_id: str,
    data: TaskUpdate,
    auth=Depends(get_current_user)
):
    token = auth["token"]

    supabase = get_supabase_client(token)

    update_data = data.model_dump(
        exclude_none=True,
        by_alias=True
    )

    if "dueDate" in update_data:
        update_data["due_date"] = update_data["dueDate"].isoformat()
        del update_data["dueDate"]

    try:
        response = (
            supabase
            .table("tasks")
            .update(update_data)
            .eq("id", task_id)
            .select("*")
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Tarefa não encontrada"
            )

        return response.data[0]

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao atualizar tarefa: {str(e)}"
        )


#Endpoint Delete Task

@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    auth=Depends(get_current_user)
):
    token = auth["token"]

    supabase = get_supabase_client(token)

    try:
        response = (
            supabase
            .table("tasks")
            .delete()
            .eq("id", task_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Tarefa não encontrada"
            )

        return {
            "message": "Tarefa excluída com sucesso"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao excluir tarefa: {str(e)}"
        )