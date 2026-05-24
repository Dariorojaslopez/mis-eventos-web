# Mis Eventos — Frontend

<p align="center">
  <strong>Plataforma SaaS enterprise para gestión de eventos</strong><br />
  React 19 · Vite · TypeScript · Tailwind · shadcn/ui · Zustand · FastAPI
</p>

<p align="center">
  <a href="https://mis-eventos-api-3625.onrender.com/docs">API Docs</a> ·
  Backend en Render · Listo para Vercel
</p>

---

## Vista previa (screenshots para demo)

> Captura estas pantallas tras `npm run dev` y guárdalas en `docs/screenshots/` para tu README o portafolio.

| Pantalla | Archivo sugerido |
|----------|------------------|
| Login | `docs/screenshots/01-login.png` |
| Registro | `docs/screenshots/02-register.png` |
| Dashboard eventos | `docs/screenshots/03-dashboard.png` |
| Crear evento + IA | `docs/screenshots/04-create-ai.png` |
| Detalle + timeline | `docs/screenshots/05-event-detail.png` |
| Mis inscripciones | `docs/screenshots/06-my-events.png` |
| Dark mode | `docs/screenshots/07-dark-mode.png` |

```bash
mkdir -p docs/screenshots
# Luego captura desde el navegador (Win+Shift+S / DevTools)
```

---

## Stack

| Capa | Tecnología |
|------|------------|
| UI | React 19, TailwindCSS v4, shadcn/ui |
| Estado | Zustand (auth, tema) |
| API | Axios → FastAPI en Render |
| Formularios | React Hook Form + Zod |
| Routing | React Router DOM (lazy + Suspense) |
| Feedback | Sonner toasts |

---

## Inicio rápido

```bash
# Clonar e instalar
npm install

# Variables de entorno
cp .env.example .env

# Desarrollo
npm run dev
```

### Variables de entorno

```env
VITE_API_URL=https://mis-eventos-api-3625.onrender.com
```

---

## Funcionalidades

- **Auth completo**: login, registro, JWT persistido, rutas protegidas
- **Eventos**: listado con búsqueda y filtros, crear, detalle
- **IA**: generación de descripción con efecto typing
- **Inscripciones**: registrarse, cancelar, mis eventos
- **Sesiones**: timeline visual en detalle
- **UX**: dark mode, skeletons, empty states, animaciones sutiles

---

## Arquitectura

```
src/
├── app/           # Providers, error boundary, toasts
├── components/    # UI reutilizable (auth, events, ai)
├── modules/       # Schemas Zod por dominio
├── services/      # Cliente Axios + endpoints
├── hooks/         # Lógica de datos
├── store/         # Zustand
├── layouts/       # Auth + Dashboard
├── routes/        # Lazy routes
├── pages/         # Vistas
├── lib/           # Utils, toast, event-status
└── types/         # Tipos API
```

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Deploy en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. **Framework**: Vite
3. **Build**: `npm run build`
4. **Output**: `dist`
5. **Variable de entorno**:

   ```
   VITE_API_URL=https://mis-eventos-api-3625.onrender.com
   ```

6. Deploy — `vercel.json` ya incluye rewrites SPA

### Checklist pre-demo

- [ ] Registro de usuario nuevo
- [ ] Login y persistencia de sesión
- [ ] Listar eventos reales
- [ ] Crear evento con **Generar con IA**
- [ ] Inscribirse y ver en Mis inscripciones
- [ ] Toggle dark mode
- [ ] Screenshots en `docs/screenshots/`

---

## Seguridad (auth)

Documentación completa: [`docs/security/AUTH.md`](docs/security/AUTH.md)

- HTTPS/TLS en Vercel + Render (sin cifrado manual en frontend)
- Contraseñas solo en memoria durante submit — nunca en storage ni logs
- Mensajes genéricos en login/register (anti-enumeración)
- Sanitización de errores backend antes de mostrar en UI
- JWT con logout que limpia `localStorage`
- Interceptor 401 sin loops en rutas de auth
- Password UX: toggle, checklist, caracteres especiales permitidos

---

- **URL**: https://mis-eventos-api-3625.onrender.com
- **Swagger**: https://mis-eventos-api-3625.onrender.com/docs

Sin mocks — todo consume la API real.

---

## Licencia

Proyecto de demostración — Servinformación.
