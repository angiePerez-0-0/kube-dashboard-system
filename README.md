# Kube Dashboard System

Este proyecto es un sistema de dashboard para gestión de clientes y costos, desarrollado con una arquitectura de microservicios. Incluye un backend en Python con FastAPI y un frontend en React con Vite.

## Tecnologías Principales
- **Backend**: Python, FastAPI, SQLAlchemy, SQL Server
- **Frontend**: React, Vite, Tailwind CSS
- **Base de Datos**: SQL Server (via pyodbc)

## Estructura del Proyecto
- `backend/`: API REST con FastAPI
- `frontend/`: Aplicación web en React
- `k8s/`: Manifiestos de Kubernetes
- `azure-pipelines.yml`: Pipeline de CI/CD con Azure DevOps

## Instalación y Ejecución Local
1. Clona el repositorio.
2. Para el backend: Instala dependencias con `pip install -r backend/requirements.txt` y ejecuta con `uvicorn app.main:app --reload`.
3. Para el frontend: Instala dependencias con `npm install` y ejecuta con `npm run dev`.

---

# ☁️ INFRAESTRUCTURA EN LA NUBE

## Tecnologías de Nube y DevOps
- **Azure Container Registry (ACR)**: Almacenamiento de imágenes Docker
- **Azure Kubernetes Service (AKS)**: Orquestación de contenedores
- **Azure DevOps Pipelines**: CI/CD automatizado
- **Azure SQL Database**: Base de datos en la nube

---

## 1. Azure Container Registry (ACR)

### Creación en Azure Portal
1. **Create a resource** → buscar **"Container Registry"**
2. Configurar:

| Campo | Valor |
|---|---|
| Resource group | El mismo del proyecto |
| Registry name | `<nombre del ACR>` (sin guiones, único globalmente) |
| Location | La misma región del SQL |
| Pricing plan | Basic |

3. **Review + Create → Create**

### Habilitar Admin User
1. Entrar al recurso → menú lateral → **"Access keys"**
2. Activar el toggle **"Admin user"**
3. Anotar:
   - **Login server:** `<nombre-acr>.azurecr.io`
   - **Username:** `<nombre-acr>`
   - **Password:** (cualquiera de las dos disponibles)

### Push manual de imágenes (verificación inicial)
```bash
docker login <nombre-acr>.azurecr.io

docker tag kube-dashboard-backend <nombre-acr>.azurecr.io/backend:latest
docker push <nombre-acr>.azurecr.io/backend:latest

docker tag kube-dashboard-frontend <nombre-acr>.azurecr.io/frontend:latest
docker push <nombre-acr>.azurecr.io/frontend:latest
```

Verificar en Azure Portal → ACR → **"Repositories"** que aparecen `backend` y `frontend`.

---

## 2. Azure Kubernetes Service (AKS)

### Creación en Azure Portal
1. **Create a resource** → buscar **"Kubernetes Service"**
2. Configurar:

| Campo | Valor |
|---|---|
| Resource group | El mismo del proyecto |
| Cluster name | `<nombre del clúster AKS>` |
| Region | La misma que el ACR y SQL |
| Kubernetes version | La que aparece por defecto |
| Node size | `Standard_D2s_v3` (o similar disponible) |
| Node count | 2 (o 1 si hay restricción de cuota) |

> ⚠️ **Nota sobre cuotas:** La serie B (`Standard_B2s`) puede estar deshabilitada en AKS en algunas regiones. Si aparece el error de cuota o de serie no soportada, usar `Standard_D2s_v3`.

3. En la pestaña **"Integrations"** → **"Container registry"** → seleccionar el ACR creado anteriormente (esto conecta AKS con ACR automáticamente)
4. **Review + Create → Create** (tarda 5–10 minutos)

### Conectar kubectl al clúster
```bash
az login
az aks get-credentials --resource-group <nombre-resource-group> --name <nombre-clúster-AKS>
```

Verificar:
```bash
kubectl get nodes
```
Deben aparecer los nodos en estado `Ready`.

---

## 3. Manifiestos de Kubernetes (`k8s/`)

### `k8s/secret.yaml`
Contiene las credenciales del backend codificadas en base64.

Para codificar cada valor en PowerShell:
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("tu-valor"))
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
type: Opaque
data:
  DB_SERVER: <base64>
  DB_NAME: <base64>
  DB_USER: <base64>
  DB_PASSWORD: <base64>
  SECRET_KEY: <base64>
```

### `k8s/backend-deployment.yaml`
- Deployment del backend usando la imagen del ACR
- Variables de entorno inyectadas desde el Secret
- Service de tipo **ClusterIP** (interno al clúster, nombre: `backend-service`)

### `k8s/frontend-deployment.yaml`
- Deployment del frontend usando la imagen del ACR
- Service de tipo **LoadBalancer** (expone IP pública para acceso externo)

### Aplicar manifiestos
```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Verificar estado
```bash
# Ver pods corriendo
kubectl get pods

# Obtener IP pública del frontend (puede tardar 1-2 min)
kubectl get service frontend-service
```

Cuando `EXTERNAL-IP` muestre una IP, la aplicación está disponible en esa dirección.

---

## 4. Azure DevOps Pipeline

### Service Connections requeridas
Crear en **Project Settings → Service connections**:

| Nombre | Tipo | Método de auth |
|---|---|---|
| `<nombre-service-connection-acr>` | Docker Registry → Others | Login server + credenciales admin del ACR |
| `<nombre-service-connection-aks>` | Kubernetes → KubeConfig | Contenido del archivo kubeconfig |

Para obtener el kubeconfig:
```bash
az aks get-credentials --resource-group <resource-group> --name <nombre-clúster-AKS> --file kubeconfig.txt
cat kubeconfig.txt
```

### Archivo `azure-pipelines.yml`
Ubicado en la raíz del repositorio. Se activa automáticamente ante cualquier push a `main`.

**Stages:**
1. **Build Backend** — construye y sube imagen del backend al ACR
2. **Build Frontend** — construye con `VITE_API_URL=/api` y sube imagen al ACR
3. **Deploy to AKS** — aplica los manifiestos de Kubernetes y actualiza los deployments

> ⚠️ **Importante:** Para pasar `--build-arg` al build del frontend, el comando Docker en el pipeline debe separarse en dos pasos (`build` y `push`). El comando `buildAndPush` no acepta argumentos de build.

### Activar el pipeline
1. Azure DevOps → **Pipelines → New Pipeline**
2. Seleccionar **GitHub** → elegir el repositorio
3. Seleccionar **"Existing Azure Pipelines YAML file"**
4. Branch: `main`, Path: `/azure-pipelines.yml`
5. **Run**

---

## 5. Arquitectura final desplegada

---
# CONTENEDORIZACIÓN DEL PROYECTO
```bash
[Usuario]
↓ IP pública
[LoadBalancer]
↓
[Frontend - Nginx (ClusterIP)]
↓ /api/ → proxy interno
[Backend - FastAPI (ClusterIP: backend-service:8000)]
↓
[Azure SQL Database]
```
---

Este proyecto está compuesto por dos servicios principales:

* 🔵 Backend (FastAPI + Azure SQL)
* 🟢 Frontend (React + Vite + Nginx)

Ambos se ejecutan en contenedores Docker independientes para facilitar despliegue en Kubernetes.

---

## Contribución
Consulta los READMEs individuales en cada módulo para más detalles.