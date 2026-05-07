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
