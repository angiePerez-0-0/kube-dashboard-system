## README para `k8s/`

**Ruta:** `k8s/README.md`
**Tipo:** Crear nuevo

# ☸️ Kubernetes - Kube Dashboard System

Manifiestos de Kubernetes para el despliegue del sistema en Azure Kubernetes Service (AKS).

---

## 📁 Estructura

```
k8s/
├── secret.yaml               # Credenciales del backend (base64)
├── backend-deployment.yaml   # Deployment + Service ClusterIP del backend
└── frontend-deployment.yaml  # Deployment + Service LoadBalancer del frontend
```

---

## 📄 Descripción de cada archivo

### `secret.yaml`
Almacena las variables de entorno sensibles del backend codificadas en base64.

| Variable | Descripción |
|---|---|
| `DB_SERVER` | URL del servidor Azure SQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario SQL Server |
| `DB_PASSWORD` | Contraseña del usuario SQL |
| `SECRET_KEY` | Llave para firma JWT |

Para codificar un valor en base64 (PowerShell):
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("tu-valor"))

Ejemplo:
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("claveSuperSecreta"))
```

---

### `backend-deployment.yaml`
Contiene dos recursos:

- **Deployment:** 1 réplica del backend usando la imagen del ACR. Las variables de entorno se inyectan desde `backend-secret`.
- **Service (ClusterIP):** Expone el backend internamente dentro del clúster bajo el nombre `backend-service` en el puerto `8000`. Este nombre es el que usa nginx del frontend para hacer proxy.

---

### `frontend-deployment.yaml`
Contiene dos recursos:

- **Deployment:** 1 réplica del frontend usando la imagen del ACR.
- **Service (LoadBalancer):** Expone el frontend al exterior con una IP pública asignada por Azure.

---

## 🚀 Aplicar manifiestos

```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

---

## 🔍 Comandos útiles

```bash
# Ver estado de los pods
kubectl get pods

# Ver servicios e IP pública
kubectl get services

# Ver logs del backend
kubectl logs deployment/backend

# Ver logs del frontend
kubectl logs deployment/frontend

# Reiniciar un deployment (para forzar pull de imagen nueva)
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

# Verificar que el backend responde desde dentro del clúster
kubectl exec -it deployment/frontend -- wget -qO- http://backend-service:8000/clients/
```

---

## 🌐 Arquitectura de red en el clúster

```
[IP Pública - LoadBalancer]
        ↓
[frontend-service :80]
        ↓
[Pod Frontend - Nginx]
        ↓ proxy /api/ → backend-service:8000
[backend-service :8000 - ClusterIP]
        ↓
[Pod Backend - FastAPI]
        ↓
[Azure SQL Database]
```

---

## ⚠️ Notas importantes

- El `secret.yaml` **no debe commitearse con valores reales**. Usa placeholders y gestiona los valores reales fuera del repositorio o mediante Azure Key Vault en producción.
- El nombre `backend-service` en el `Service` del backend debe coincidir exactamente con el nombre usado en `nginx.conf` del frontend.
- Si el pipeline actualiza la imagen pero el pod no cambia, forzar con `kubectl rollout restart deployment/<nombre>`.
```

---

## 🔴 Cómo apagar todo

Para no incurrir en costos innecesarios, esto es lo que debes hacer:

### Opción A — Apagar solo los pods (AKS sigue corriendo, costo reducido)
```bash
kubectl scale deployment/backend --replicas=0
kubectl scale deployment/frontend --replicas=0
```
Para volver a encender:
```bash
kubectl scale deployment/backend --replicas=1
kubectl scale deployment/frontend --replicas=1
```

### Opción B — Apagar el clúster AKS completo (recomendada para ahorrar más)
En Azure Portal → tu clúster AKS → **"Stop"**. Esto detiene los nodos y reduce el costo al mínimo. Para retomar → **"Start"**.

### Opción C — Eliminar todo (si ya no lo necesitas)
En Azure Portal → tu Resource Group → **"Delete resource group"**. Esto elimina AKS, ACR, y Azure SQL de una sola vez o eliminar unicamente los servicios creados.

> Para el proyecto académico lo más cómodo es la **Opción B** — apagas el clúster cuando no lo usas y lo enciendes cuando lo necesitas, sin perder la configuración.