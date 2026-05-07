# 📄 Backend - Kube Dashboard System

Este módulo es la API REST del sistema de gestión de clientes y costos, desarrollado con **FastAPI** bajo arquitectura limpia (Clean Architecture).
Incluye autenticación, gestión de clientes y costos, y persistencia en **Azure SQL Database**.

---

## 🧠 Descripción General

La API permite:

* Autenticación de usuarios (JWT) -> sin implementar por cuestión de tiempo
* Gestión de clientes
* Registro de costos asociados a clientes
* Persistencia en base de datos SQL Server (Azure SQL)

La arquitectura está separada en capas para mantener escalabilidad y claridad del sistema.

---

## 🧱 Tecnologías

* Python 3.x
* FastAPI
* SQLAlchemy
* Azure SQL Database (SQL Server)
* pyodbc (driver de conexión)
* JWT (python-jose)
* Pydantic / Pydantic Settings

---

## 📦 Dependencias

```text
fastapi
uvicorn
sqlalchemy
pyodbc
pydantic
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-jose
python-dotenv
pydantic-settings
```

---

# 🚀 Migración a Azure SQL (Paso a Paso)

Este proyecto inicialmente usaba SQLite para desarrollo local y luego fue migrado a Azure SQL para entorno cloud.

---

## 🟡 1. Creación de Azure SQL Database

En Azure Portal:

### ✔ Crear recurso:

* Azure SQL Database

---

### ✔ Configuración importante:

#### 🔹 Backup redundancy

Se eligió:

* **Almacenamiento de copias de seguridad con redundancia local**

👉 Porque:

* Es más económico
* Suficiente para entornos de desarrollo y proyectos académicos

---

#### 🔹 Método de conectividad

Se eligió:

* **Punto de conexión público**

👉 Porque:

* Permite conexión desde el backend local
* Facilita integración con CI/CD y Kubernetes posteriormente

---

#### 🔹 Firewall (IP Client)

Se debe agregar manualmente la IP del equipo:

* Azure SQL → Networking → Firewall rules
* Agregar:

  * IP pública del desarrollador

👉 Porque Azure bloquea por defecto cualquier conexión externa por seguridad

---

#### 🔹 Directiva de conexión

* Se mantiene en **Default**

👉 Azure decide automáticamente entre Proxy o Redirect según origen de conexión

---

#### 🔹 TLS

* Se utiliza **TLS 1.2**

👉 Porque garantiza conexión segura y es el estándar actual

---

## 🟡 2. Instalación del ODBC Driver

Se instaló:

* **ODBC Driver 18 for SQL Server**

👉 Porque Python no se comunica directamente con SQL Server, necesita un driver que actúe como traductor entre SQLAlchemy y Azure SQL.

---

## 🟡 3. Configuración del `.env`

El archivo `.env` contiene las credenciales de conexión:

```env
DB_SERVER=tu-servidor.database.windows.net
DB_NAME=tu-base-de-datos
DB_USER=tu-usuario
DB_PASSWORD=tu-password

SECRET_KEY=supersecretkey
```

👉 Este archivo permite separar configuración del código y evitar exponer credenciales.

---

## 🟡 4. Archivo `settings.py` (Configuración del sistema)

Ubicación:

```
app/core/config/settings.py
```

### Responsabilidad:

Centraliza la configuración del sistema usando Pydantic Settings.

### Ejemplo actual:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_SERVER: str
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
```

👉 Este archivo:

* Lee variables del `.env`
* Evita hardcodear credenciales
* Permite escalar a múltiples entornos (local/cloud)

---

## 🟡 5. Archivo `session.py` (Conexión a base de datos)

Ubicación:

```
app/infrastructure/db/session.py
```

### Responsabilidad:

Crear la conexión entre FastAPI y Azure SQL usando SQLAlchemy + pyodbc.

### Ejemplo:

```python
import urllib
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

params = urllib.parse.quote_plus(
    f"Driver={{ODBC Driver 18 for SQL Server}};"
    f"Server=tcp:{DB_SERVER},1433;"
    f"Database={DB_NAME};"
    f"Uid={DB_USER};"
    f"Pwd={DB_PASSWORD};"
    f"Encrypt=yes;"
    f"TrustServerCertificate=no;"
)

DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

engine = create_engine(
    DATABASE_URL,
    future=True,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
```

---

## 🟡 6. Creación de tablas

Las tablas se crean automáticamente usando:

```python
Base.metadata.create_all(bind=engine)
```

👉 Este proceso:

* Detecta modelos SQLAlchemy
* Crea tablas en Azure SQL si no existen
* No modifica tablas existentes

---

## 🟡 7. Ejecución del backend

```bash
uvicorn app.main:app --reload
```

API disponible en:

```
http://localhost:8000
```

---

## 🧱 Estructura del proyecto

```
app/
│
├── application/      # Casos de uso
├── core/             # Configuración y seguridad
│   ├── config/
│   │   └── settings.py
│
├── domain/           # Entidades y reglas de negocio
├── infrastructure/   # DB y repositorios
│   ├── db/
│   │   └── session.py
│
├── interfaces/       # API REST (controllers)
├── main.py           # Punto de entrada
```

---

## 📚 Documentación API

Disponible en:

```
http://localhost:8000/docs
```

---

## 🧠 Notas importantes

* SQLite se mantiene solo como entorno de desarrollo local
* Azure SQL es el entorno principal cloud
* La conexión depende de ODBC Driver 18
* El firewall de Azure debe permitir la IP del cliente

---

## 🚀 Estado actual del proyecto

* ✔ Backend funcionando localmente
* ✔ Migración a Azure SQL completada
* ✔ Arquitectura limpia implementada
* ⏳ Pendiente: Dockerización y Kubernetes

## 📚 Fuentes de información y documentación técnica
Este proyecto fue desarrollado utilizando documentación oficial de las tecnologías involucradas y buenas prácticas de arquitectura backend y cloud.


Disponible en:


### 🟦 FastAPI

* [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)

👉 Documentación oficial de FastAPI para la creación de APIs REST, routing, dependencias y documentación automática Swagger.

---

### 🟦 SQLAlchemy

* [https://docs.sqlalchemy.org/](https://docs.sqlalchemy.org/)

👉 Usado para la capa de persistencia y ORM, permitiendo mapear modelos Python a tablas relacionales.

---

### 🟦 Azure SQL Database

* [https://learn.microsoft.com/azure/azure-sql/database/](https://learn.microsoft.com/azure/azure-sql/database/)

👉 Documentación oficial de Microsoft Azure SQL Database utilizada para:

* creación de la base de datos
* configuración de red y firewall
* conexiones desde aplicaciones externas

---

### 🟦 ODBC Driver for SQL Server

* [https://learn.microsoft.com/sql/connect/odbc/download-odbc-driver-for-sql-server/](https://learn.microsoft.com/sql/connect/odbc/download-odbc-driver-for-sql-server/)

👉 Driver utilizado para permitir la conexión entre Python (pyodbc) y Azure SQL Database.

---

### 🟦 pyodbc

* [https://github.com/mkleehammer/pyodbc](https://github.com/mkleehammer/pyodbc)

👉 Librería que actúa como interfaz entre Python y el driver ODBC para ejecutar consultas SQL.

---

### 🟦 Pydantic Settings

* [https://docs.pydantic.dev/latest/concepts/pydantic_settings/](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)

👉 Utilizado para la gestión de variables de entorno (.env) y configuración centralizada del sistema.

---

### 🟦 Python dotenv

* [https://pypi.org/project/python-dotenv/](https://pypi.org/project/python-dotenv/)

👉 Permite cargar variables de entorno desde archivos `.env` para separar configuración del código.

---

### 🟦 Arquitectura limpia (Clean Architecture)

* [https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/](https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/)

👉 Base conceptual utilizada para estructurar el backend en capas:

* domain
* application
* infrastructure
* interfaces

---

### 🟦 JWT Authentication

* [https://jwt.io/introduction/](https://jwt.io/introduction/)

👉 Base teórica para el sistema de autenticación implementado en el backend.



La integración entre estas tecnologías permitió construir un sistema:

* modular
* escalable
* preparado para contenedores y Kubernetes
* compatible con Azure Cloud