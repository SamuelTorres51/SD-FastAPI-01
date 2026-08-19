from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import tasks
from app.routers.auth import router as auth_router


app = FastAPI(
    title="Task Manager API",
    description="API para gerenciamento de tarefas",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(tasks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
def handle_validation_error(request: Request, exc: RequestValidationError):
    erros = exc.errors()

    for erro in erros:
        if erro["msg"].startswith("Value error, "):
            return JSONResponse(
                status_code=422,
                content={"detail": erro["msg"].removeprefix("Value error, ")},
            )

    campos = ", ".join(
        str(erro["loc"][-1]) for erro in erros if erro.get("loc")
    )

    return JSONResponse(
        status_code=422,
        content={
            "detail": (
                f"Dados inválidos nos campos: {campos}."
                if campos
                else "Dados inválidos."
            )
        },
    )


@app.get("/")
def root():
    return {"message": "API funcionando!"}
