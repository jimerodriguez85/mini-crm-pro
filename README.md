# Mini CRM Pro

CRM completo para gestion de clientes construido con React y Node.js.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

## Screenshots

### Login
![Login](./screenshots/login.png)

### Dashboard
Dashboard con estadisticas, graficos de clientes por mes y por empresa, y actividad reciente.

![Dashboard](./screenshots/dashboard.png)

### Gestion de Clientes
CRUD completo con busqueda en tiempo real, formulario de alta y tabla con estado del pipeline.

![Clientes](./screenshots/clientes.png)

### Pipeline Kanban
Tablero drag & drop con 4 etapas: Prospecto, Contactado, Cliente y Cerrado.

![Pipeline](./screenshots/pipeline.png)

### Recordatorios
Sistema de recordatorios con fechas, filtros por estado (Pendientes/Completados) y asignacion por cliente.

![Recordatorios](./screenshots/recordatorios.png)

## Features

- **Autenticacion JWT** con roles (admin/vendedor)
- **CRUD de clientes** con busqueda en tiempo real
- **Tablero Kanban** drag & drop (prospecto, contactado, cliente, cerrado)
- **Dashboard** con graficos interactivos (Recharts)
- **Recordatorios** con fechas y estados
- **Timeline de actividad** - log completo de acciones por cliente
- **Subida de archivos** - adjuntar documentos a clientes
- **Email** - enviar correos desde el CRM (Nodemailer)
- **WhatsApp** - contactar clientes directo
- **WebSockets** - notificaciones en tiempo real cuando otro usuario edita
- **PWA** - instalable como app en el telefono
- **Responsive** - tabla en desktop, cards en mobile

## Tech Stack

| Capa | Tecnologias |
|------|-------------|
| Frontend | React 18, Tailwind CSS, Vite, Recharts, @hello-pangea/dnd |
| Backend | Node.js, Express, Prisma ORM, Socket.io |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT, bcryptjs |
| Otros | Nodemailer, Multer, PWA Service Worker |

## Instalacion

```bash
git clone https://github.com/jimerodriguez85/mini-crm-pro.git
cd mini-crm-pro
npm run install:all
```

Crear archivo `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
JWT_SECRET=tu_secreto_aqui
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

Inicializar base de datos:

```bash
cd backend
npx prisma db push
npm run db:seed
```

## Uso

```bash
npm run dev
```

Esto levanta backend (`:3001`) y frontend (`:5173`) juntos.

**Credenciales demo:**
- Admin: `admin@minicrm.com` / `admin123`
- Vendedor: `vendedor@minicrm.com` / `vendedor123`

## Estructura del proyecto

```
mini-crm-pro/
├── backend/
│   ├── prisma/              # Schema + seed
│   ├── src/
│   │   ├── controllers/     # 7 controllers (auth, client, reminder, etc.)
│   │   ├── middleware/       # JWT auth, roles, error handler
│   │   ├── routes/          # 7 route files
│   │   ├── services/        # Email service
│   │   ├── socket/          # WebSocket config
│   │   └── app.js           # Entry point
│   └── uploads/             # Archivos subidos
│
└── frontend/
    ├── public/              # PWA manifest + service worker
    └── src/
        ├── components/      # UI, Client, Kanban, Dashboard, Files, etc.
        ├── pages/           # 7 pages con React Router
        ├── context/         # Auth, Socket, Notification
        ├── hooks/           # Custom hooks
        └── services/        # 8 API service modules
```

## API Endpoints

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registro | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/clients` | Listar clientes | Si |
| POST | `/api/clients` | Crear cliente | Si |
| PUT | `/api/clients/:id` | Actualizar | Si |
| PATCH | `/api/clients/:id/pipeline` | Mover en Kanban | Si |
| DELETE | `/api/clients/:id` | Eliminar | Admin |
| GET | `/api/dashboard/stats` | Estadisticas | Si |
| POST | `/api/email/send/:clientId` | Enviar email | Si |
| POST | `/api/files/client/:clientId` | Subir archivo | Si |
| GET/POST/PATCH/DELETE | `/api/reminders` | CRUD recordatorios | Si |
| GET | `/api/activities` | Timeline global | Si |

## Migrar a PostgreSQL

```bash
docker compose up -d db
# Cambiar en backend/.env: DATABASE_URL="postgresql://crm_user:crm_pass@localhost:5432/mini_crm"
# Cambiar en prisma/schema.prisma: provider = "postgresql"
cd backend && npx prisma db push && npm run db:seed
```

## Licencia

MIT
