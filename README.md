# Mis Eventos — Frontend

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Tablero.jpg" alt="Vista del tablero de eventos" width="720" />
</p>

<p align="center">
  <strong>Plataforma SaaS enterprise para crear, publicar y gestionar eventos con inscripciones, agenda de sesiones e IA integrada.</strong>
</p>

<p align="center">
  <a href="https://mis-eventos-web.vercel.app/"><img src="https://img.shields.io/badge/Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Demo en Vercel" /></a>
  <a href="https://mis-eventos-api-3625.onrender.com/docs"><img src="https://img.shields.io/badge/API-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger API" /></a>
  <a href="https://github.com/Dariorojaslopez/mis-eventos-web"><img src="https://img.shields.io/github/stars/Dariorojaslopez/mis-eventos-web?style=for-the-badge&logo=github&color=181717" alt="GitHub Stars" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-5-443B36?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/github/last-commit/Dariorojaslopez/mis-eventos-web?style=flat-square&logo=github" alt="Último commit" />
  <img src="https://img.shields.io/github/issues/Dariorojaslopez/mis-eventos-web?style=flat-square&logo=github" alt="Issues" />
</p>

---

## Tabla de contenidos

- [Descripción](#descripción)
- [🌐 Deploy](#-deploy)
- [Features](#features)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura frontend](#arquitectura-frontend)
- [Manejo de estado](#manejo-de-estado)
- [Seguridad](#seguridad)
- [Integración con backend](#integración-con-backend)
- [Experiencia del producto](#experiencia-del-producto)
- [Capturas del sistema](#capturas-del-sistema)
- [Inicio rápido](#inicio-rápido)
- [Scripts](#scripts)
- [Deploy en Vercel](#deploy-en-vercel)
- [Documentación adicional](#documentación-adicional)
- [Licencia](#licencia)

---

## Descripción

**Mis Eventos Web** es el frontend de una plataforma de gestión de eventos orientada a equipos y organizadores. Permite autenticarse con JWT, explorar un tablero de eventos, crear publicaciones con asistencia de IA, gestionar inscripciones, administrar sesiones en una agenda visual y operar en modo claro u oscuro con una experiencia tipo Linear / Vercel.

La aplicación consume una **API FastAPI real** desplegada en Render — sin mocks — y está optimizada para producción en **Vercel** con routing SPA, lazy loading y manejo robusto de errores en español.

---

## 🌐 Deploy

| Entorno | URL | Descripción |
|---------|-----|-------------|
| **Frontend** | [https://mis-eventos-web.vercel.app/](https://mis-eventos-web.vercel.app/) | Aplicación React en producción |                         
| **Backend Swagger** | [https://mis-eventos-api-3625.onrender.com/docs](https://mis-eventos-api-3625.onrender.com/docs) | Documentación interactiva OpenAPI |
| **API base** | `https://mis-eventos-api-3625.onrender.com` | REST API FastAPI + JWT |

> **Repositorio:** [github.com/Dariorojaslopez/mis-eventos-web](https://github.com/Dariorojaslopez/mis-eventos-web)

---

## Features

| Módulo | Capacidades |
|--------|-------------|
| **Autenticación** | Login, registro, JWT persistido, rutas protegidas, logout seguro |
| **Eventos** | Dashboard con búsqueda y filtros, creación, detalle con hero y métricas |
| **IA** | Generación de descripciones con efecto typing y validación Zod |
| **Ubicación** | Buscador + mapa Leaflet con geocoding Nominatim |
| **Inscripciones** | Registro, cancelación, vista “Mis inscripciones”, manejo de cupos |
| **Sesiones** | CRUD completo, timeline por fecha, validación de horarios y solapamientos |
| **UX enterprise** | Dark/light mode, skeletons, empty states, toasts Sonner, responsive |
| **i18n UX** | Mensajes de error, validaciones y estados en español |

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| **Core** | React 19, TypeScript, Vite 8 |
| **Estilos** | Tailwind CSS v4, shadcn/ui, Lucide React |
| **Estado global** | Zustand (auth, tema) |
| **Datos async** | TanStack Query v5, Axios |
| **Formularios** | React Hook Form + Zod |
| **Routing** | React Router DOM 7 (lazy + Suspense) |
| **Mapas** | Leaflet, react-leaflet, Nominatim |
| **Feedback** | Sonner |
| **Backend** | FastAPI (Render) — JWT, OpenAPI |

---

## Arquitectura frontend

Diseño modular por capas, separando UI, dominio, servicios y estado:

```
src/
├── app/              # Providers (Query, tema, auth), ErrorBoundary, Toaster
├── components/       # UI reutilizable (auth, events, sessions, forms, ai)
├── modules/          # Schemas Zod y reglas de dominio por feature
├── services/         # Cliente Axios + endpoints REST
├── hooks/            # Lógica de datos (eventos, sesiones, IA, auth)
├── store/            # Zustand — auth + theme
├── layouts/          # AuthLayout, DashboardLayout
├── routes/           # Rutas lazy con ProtectedRoute
├── pages/            # Vistas de alto nivel
├── lib/              # Utils, errores, query-client, status-labels, security
└── types/            # Contratos TypeScript alineados con la API
```

**Principios aplicados**

- Lazy loading de páginas para mejor TTI
- Servicios tipados como única puerta hacia la API
- Validación en cliente con Zod antes de enviar payloads
- Invalidación de cache con TanStack Query tras mutaciones
- Mensajes de usuario centralizados y traducidos al español

---

## Manejo de estado

| Tipo | Herramienta | Uso |
|------|-------------|-----|
| **Auth + sesión** | Zustand + persist | JWT, usuario, hidratación al recargar |
| **Tema** | Zustand | Dark / light con persistencia en `localStorage` |
| **Server state** | TanStack Query | Listados, detalle, sesiones por evento, mutaciones CRUD |
| **Form state** | React Hook Form | Login, registro, crear evento, sesiones |
| **UI local** | `useState` | Modales, filtros, búsqueda, loading por acción |

---

## Seguridad

Documentación extendida: [`docs/security/AUTH.md`](docs/security/AUTH.md)

| Área | Implementación |
|------|----------------|
| **Transporte** | HTTPS/TLS en Vercel + Render — sin cifrado manual en browser |
| **Credenciales** | Contraseñas solo en memoria durante el submit; nunca en storage ni logs |
| **Anti-enumeración** | Mensajes genéricos en login/registro |
| **Errores API** | Sanitización + traducción al español antes de mostrar en UI |
| **JWT** | Interceptor Axios con Bearer; logout limpia store y `localStorage` |
| **401** | Redirección a login sin loops en rutas públicas de auth |
| **Contraseñas** | Reglas de fortaleza, checklist, toggle mostrar/ocultar |

---

## Integración con backend

La SPA se conecta a la API FastAPI mediante `VITE_API_URL`:

```env
VITE_API_URL=https://mis-eventos-api-3625.onrender.com
```

**Endpoints principales consumidos**

| Dominio | Operaciones |
|---------|-------------|
| Auth | `POST /api/v1/auth/login`, `POST /api/v1/auth/register` |
| Eventos | CRUD, listado paginado con filtros |
| Inscripciones | Registrar, cancelar, listar mis eventos y asistentes |
| Sesiones | CRUD por evento, agenda en detalle |
| IA | `POST /api/v1/ai/generate-event-description` |

Todos los servicios viven en `src/services/` y comparten el cliente Axios con interceptores de auth y manejo de 401.

---

## Experiencia del producto

Flujo completo de la plataforma SaaS:

### Login JWT

Autenticación con email y contraseña. El token se almacena de forma segura vía Zustand persist y se adjunta automáticamente en cada petición.

### Registro

Formulario con validación de contraseña en tiempo real, checklist de requisitos y mensajes de error seguros en español.

### Dashboard

Tablero de eventos con búsqueda, filtros por estado, cards con ocupación y acceso rápido al detalle.

### Crear eventos

Formulario guiado con widgets de fecha/hora, capacidad, selector de ubicación en mapa y **generación de descripción con IA**.

### Inscripciones

Los asistentes se inscriben desde el detalle del evento; los organizadores gestionan cupos y ven asistentes. Vista dedicada **Mis inscripciones**.

### Agenda de sesiones

Timeline visual agrupado por fecha, badges de capacidad, CRUD para organizadores con validación de rango del evento y detección de solapamientos.

### Tema dark / light

Toggle global con persistencia. Paleta oscura premium con acentos azul/violeta, glassmorphism y animaciones sutiles.

### IA para descripciones

Botón “Generar con IA” que produce texto profesional con efecto typing, editable antes de publicar.

---

## Capturas del sistema

Galería con capturas reales del producto en producción/desarrollo.

### Inicio de sesión

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Logeo.jpg" alt="Pantalla de inicio de sesión" width="720" />
</p>

<p align="center"><em>Login con validación, contraseña segura y diseño dark enterprise.</em></p>

---

### Registro de usuario

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Registro.jpg" alt="Pantalla de registro" width="720" />
</p>

<p align="center"><em>Registro con checklist de fortaleza de contraseña y mensajes en español.</em></p>

---

### Tablero de eventos

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Tablero.jpg" alt="Dashboard de eventos" width="720" />
</p>

<p align="center"><em>Dashboard con búsqueda, filtros, cards y métricas de ocupación.</em></p>

---

### Creación de evento

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Creacion_de_evento.jpg" alt="Formulario de creación de evento" width="720" />
</p>

<p align="center"><em>Crear evento con widgets móviles, mapa de ubicación e IA integrada.</em></p>

---

### Mis inscripciones

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Inscripciones.jpg" alt="Pantalla de inscripciones" width="720" />
</p>

<p align="center"><em>Gestión de inscripciones activas con cancelación y acceso al detalle.</em></p>

---

### Agenda de sesiones

<p align="center">
  <img src="https://mis-eventos-web.vercel.app/screenshots/Agenda.jpg" alt="Agenda y timeline de sesiones" width="720" />
</p>

<p align="center"><em>Timeline de sesiones con agrupación por fecha, capacidad y acciones del organizador.</em></p>

---

## Inicio rápido

### Requisitos

- Node.js 20+
- npm 10+

### Instalación

```bash
git clone https://github.com/Dariorojaslopez/mis-eventos-web.git
cd mis-eventos-web
npm install
cp .env.example .env
npm run dev
```

La app estará disponible en `http://localhost:5173`.

### Variables de entorno

```env
VITE_API_URL=https://mis-eventos-api-3625.onrender.com
```

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Type-check + build de producción |
| `npm run preview` | Preview local del build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier sobre `src/` |

---

## Deploy en Vercel

1. Importa el repositorio [Dariorojaslopez/mis-eventos-web](https://github.com/Dariorojaslopez/mis-eventos-web) en [vercel.com](https://vercel.com)
2. **Framework preset:** Vite
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. **Environment variable:**

   ```
   VITE_API_URL=https://mis-eventos-api-3625.onrender.com
   ```

6. Deploy — el archivo `vercel.json` ya incluye rewrites SPA

**URL de producción:** [https://mis-eventos-web.vercel.app/](https://mis-eventos-web.vercel.app/)

---

## Documentación adicional

| Recurso | Enlace |
|---------|--------|
| Seguridad auth frontend | [`docs/security/AUTH.md`](docs/security/AUTH.md) |
| Capturas del sistema | [`docs/screenshots/`](docs/screenshots/) |
| API Swagger | [mis-eventos-api-3625.onrender.com/docs](https://mis-eventos-api-3625.onrender.com/docs) |

---

## Licencia

Proyecto de demostración — **Servinformación**.
