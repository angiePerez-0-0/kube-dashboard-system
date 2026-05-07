# Kube Dashboard System

Este proyecto es un sistema de dashboard para gestión de clientes y costos, desarrollado con una arquitectura de microservicios. Incluye un backend en Python con FastAPI y un frontend en React con Vite.

## Tecnologías Principales
- **Backend**: Python, FastAPI, SQLAlchemy, SQL Server
- **Frontend**: React, Vite, Tailwind CSS
- **Base de Datos**: SQL Server (via pyodbc)

## Estructura del Proyecto
- `backend/`: API REST con FastAPI
- `frontend/`: Aplicación web en React

## Instalación y Ejecución
1. Clona el repositorio.
2. Para el backend: Instala dependencias con `pip install -r backend/requirements.txt` y ejecuta con `uvicorn app.main:app --reload`.
3. Para el frontend: Instala dependencias con `npm install` y ejecuta con `npm run dev`.

---
# CONTENEDORIZACIÓN DEL PROYECTO

Este proyecto está compuesto por dos servicios principales:

* 🔵 Backend (FastAPI + Azure SQL)
* 🟢 Frontend (React + Vite + Nginx)

Ambos se ejecutan en contenedores Docker independientes para facilitar despliegue en Kubernetes.

---

## Contribución
Consulta los READMEs individuales en cada módulo para más detalles.