# Stockly — Arquitectura Técnica

## Stack Técnico
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS v3
- **UI Components**: shadcn/ui (customizados con design system Stockly)
- **State**: Zustand (UI) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- **Tablas**: TanStack Table v8

## Multi-tenancy
- Modelo: **Row Level Security (RLS)** con `tenant_id` en cada tabla
- Función helper: `get_current_tenant_id()` obtiene tenant del usuario logueado
- Cada policy de RLS usa esta función para aislar datos entre tenants

## Estructura de la App
```
src/app/
├── (auth)/           → Login, Signup (sin sidebar)
├── (dashboard)/      → Shell con sidebar + bottom tabs
│   ├── dashboard/    → Dashboard principal
│   ├── productos/    → CRUD productos
│   ├── inventario/   → Vista de inventario
│   ├── ventas/       → POS
│   ├── clientes/     → CRUD clientes
│   ├── compras/      → Registro de compras
│   ├── proveedores/  → CRUD proveedores
│   ├── reportes/     → Reportes y analytics
│   └── configuracion/→ Settings del tenant
├── onboarding/       → Wizard post-signup
└── page.tsx          → Landing pública
```

## Design System
- **Tema**: Light mode (fondo blanco) — adaptado del prototipo Ukiyo Garage
- **Fuentes**: Bebas Neue (display), DM Sans (body), JetBrains Mono (números)
- **Colores**: Azul primario, Rojo peligro, Verde éxito, Amber warning, Púrpura acento
- **Componentes**: Cards con borde superior de color, labels uppercase, badges pill

## Base de Datos (16 tablas)
tenants → users → locations → categories → suppliers → products → product_variants
→ inventory → inventory_movements → customers → sales → sale_items
→ purchases → purchase_items → payments → audit_log

## Seguridad
- RLS obligatoria en todas las tablas
- Audit triggers automáticos
- Middleware de Next.js para protección de rutas
- Variables de entorno para credenciales (nunca hardcodeadas)
