# Backend - Kube Dashboard System

Este módulo es la API REST del sistema de gestión de clientes y costos, desarrollado con FastAPI y arquitectura limpia.

## Descripción
Proporciona endpoints para autenticación, gestión de clientes y costos. Utiliza SQLAlchemy para persistencia en SQL Server.

## Tecnologías
- Python 3.x
- FastAPI
- SQLAlchemy
- SQL Server (via pyodbc)
- JWT (python-jose)
- Pydantic

## Dependencias
- fastapi
- uvicorn
- sqlalchemy
- pyodbc
- pydantic
- passlib[bcrypt]==1.7.4
- bcrypt==4.0.1
- python-jose
- python-dotenv
- pydantic-settings

## Instalación
1. Navega a `backend/`.
2. Instala dependencias: `pip install -r requirements.txt`.

## Cómo Ejecutar
Ejecuta el servidor con: `uvicorn app.main:app --reload`.

La API estará disponible en `http://localhost:8000`.

## Estructura
- `app/`: Código principal
  - `application/`: Casos de uso
  - `core/`: Configuración y seguridad
  - `domain/`: Entidades y repositorios
  - `infrastructure/`: DB y implementaciones
  - `interfaces/`: API y esquemas
- `requirements.txt`: Dependencias

## Documentación API
Accede a `/docs` para la documentación interactiva de Swagger.