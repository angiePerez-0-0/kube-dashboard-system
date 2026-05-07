from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.interfaces.api.auth_controller import router as auth_router
from app.interfaces.api.client_controller import router as client_router
from app.interfaces.api.cost_controller import router as cost_router
from app.infrastructure.db.session import engine
from app.infrastructure.db.models import Base

Base.metadata.create_all(bind=engine) #SQLAlchemy crea las tablas automáticamente en Azure SQL

app = FastAPI(title="Gestión de Clientes y Costos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a la URL del frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(client_router, prefix="/clients", tags=["Clients"])
app.include_router(cost_router, prefix="/costs", tags=["Costs"])