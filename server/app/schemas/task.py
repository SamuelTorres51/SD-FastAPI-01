from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class TaskPriority(str, Enum):
    BAIXA = "baixa"
    MEDIA = "media"
    ALTA = "alta"


class TaskStatus(str, Enum):
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDA = "concluida"


class TaskCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=120
    )

    description: str = Field(
        max_length=500
    )

    dueDate: date

    priority: TaskPriority

    status: TaskStatus


class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=120
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    dueDate: date | None = None

    priority: TaskPriority | None = None

    status: TaskStatus | None = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    dueDate: date
    priority: TaskPriority
    status: TaskStatus
    createdAt: str