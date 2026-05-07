# Frontend - Kube Dashboard System

Este módulo es la interfaz web del sistema de gestión de clientes y costos, desarrollado con React y Vite.

## Descripción
Aplicación SPA para dashboard, gestión de clientes y costos. Conecta con la API del backend via Axios.

## Tecnologías
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Heroicons

## Dependencias
### Principales
- @heroicons/react: ^2.2.0
- axios: ^1.16.0
- react: ^19.2.5
- react-dom: ^19.2.5
- react-hot-toast: ^2.6.0
- react-router-dom: ^7.15.0

### Desarrollo
- @eslint/js: ^10.0.1
- @tailwindcss/vite: ^4.2.4
- @types/react: ^19.2.14
- @types/react-dom: ^19.2.3
- @vitejs/plugin-react: ^6.0.1
- autoprefixer: ^10.5.0
- eslint: ^10.2.1
- eslint-plugin-react-hooks: ^7.1.1
- eslint-plugin-react-refresh: ^0.5.2
- globals: ^17.5.0
- postcss: ^8.5.14
- tailwindcss: ^4.2.4
- vite: ^8.0.10

## Instalación
1. Navega a `frontend/`.
2. Instala dependencias: `npm install`.

## Cómo Ejecutar
Ejecuta el servidor de desarrollo con: `npm run dev`.

La aplicación estará disponible en `http://localhost:5173`.

## Scripts Disponibles
- `npm run dev`: Inicia servidor de desarrollo
- `npm run build`: Construye para producción
- `npm run lint`: Ejecuta linter
- `npm run preview`: Vista previa de build

## Estructura
- `src/`: Código fuente
  - `components/`: Componentes UI
  - `hooks/`: Hooks personalizados
  - `pages/`: Páginas
  - `services/`: Servicios API
  - `styles/`: Estilos CSS
- `public/`: Archivos estáticos
- `package.json`: Configuración y dependencias



---

# 🐳 CONTENEDORIZACIÓN DEL PROYECTO (VERSIÓN ACTUALIZADA)

# 🟢 FRONTEND - DOCKERFILE EXPLICADO

## 📄 Dockerfile

### 🏗️ Etapa 1: Build (Node)

```dockerfile
FROM node:22 AS build
```

👉 Usa Node para compilar React.

---

```dockerfile
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
```

👉 Instala dependencias.

---

```dockerfile
COPY . .
```

👉 Copia código fuente.

---

## 🔐 Variable de entorno dinámica

```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```

👉 Permite cambiar backend según entorno:

| Valor                                          | Uso                     |
| ---------------------------------------------- | ----------------------- |
| [http://localhost:8000](http://localhost:8000) | local                   |
| /api                                           | Kubernetes / producción |

---

```dockerfile
RUN npm run build
```

👉 Genera versión optimizada (dist/).

---

# 🌐 Etapa 2: Nginx

```dockerfile
FROM nginx:alpine
```

👉 Servidor web ligero para producción.

---

```dockerfile
COPY --from=build /app/dist /usr/share/nginx/html
```

👉 Copia frontend compilado.

---

## ⚙️ Configuración Nginx

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

👉 Aquí normalmente se configura:

* SPA routing (React Router)
* Reverse proxy si usas `/api`
* fallback a index.html

Ejemplo típico:

```nginx
location / {
  try_files $uri /index.html;
}
```

---

```dockerfile
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

👉 Expone frontend en puerto 80.

---

# 🧪 FRONTEND - EJECUCIÓN LOCAL

## 🔨 Build local

```bash
docker build --no-cache --build-arg VITE_API_URL=http://localhost:8000 -t kube-dashboard-frontend .
```

---

## ▶️ Run local

```bash
docker run -p 3000:80 kube-dashboard-frontend
```

---

## 🌐 Probar frontend

```
http://localhost:3000
```

---

## ☁️ Build producción (Kubernetes)

```bash
docker build --build-arg VITE_API_URL=/api -t kube-dashboard-frontend .
```

👉 Aquí el frontend no apunta a localhost sino a backend dentro del cluster.

---

# 🧠 ARQUITECTURA FINAL (LO QUE ESTÁS CONSTRUYENDO)

```
[ React Frontend (Nginx) ]
            ↓
        /api
            ↓
[ FastAPI Backend ]
            ↓
[ Azure SQL Database ]
```