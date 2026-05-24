# Seguridad — Autenticación Frontend

## Transporte (HTTPS / TLS)

| Entorno | URL | Cifrado |
|---------|-----|---------|
| Frontend | Vercel | HTTPS (TLS automático) |
| Backend | Render | HTTPS (TLS automático) |

- **No se requiere cifrado manual** (AES/RSA) en el frontend.
- Las contraseñas y JWT viajan cifrados por TLS en tránsito.
- El backend almacena **hashes** de contraseña, nunca plaintext.

Documentación en código: `src/lib/security/transport.ts`

## Qué NO hace el frontend

- No persiste contraseñas (localStorage, sessionStorage, Zustand).
- No hace `console.log` de credenciales.
- No muestra contraseñas en toasts ni errores UI.
- No revela si un email existe o si la contraseña es incorrecta.

## Mensajes de auth seguros

| Contexto | Mensaje |
|----------|---------|
| Login fallido | "Credenciales inválidas. Verifica tu email y contraseña." |
| Registro fallido | "No se pudo crear la cuenta. Verifica tus datos e inténtalo de nuevo." |

Implementación: `src/lib/security/auth-messages.ts`

## Sanitización de errores

El backend puede devolver detalles internos. El frontend los filtra en:

- `src/lib/security/sanitize.ts`
- `src/lib/errors.ts`

## JWT

- Token en `localStorage` vía Zustand persist (tradeoff XSS).
- Logout limpia store + `localStorage`.
- Interceptor 401 evita loops en `/login` y `/register`.

## Contraseñas — reglas frontend

- Mínimo 8 caracteres
- Mayúscula, minúscula, número
- Carácter especial: `! @ # $ % ^ & * . _ -`
- Toggle mostrar/ocultar
- Checklist en tiempo real
