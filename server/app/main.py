from fastapi import FastAPI

app = FastAPI(
    title="Task Manager API",
    description="API para gerenciamento de tarefas",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "API funcionando!"}