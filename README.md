# Automata

A full-stack service management system built for a medical equipment servicing company. Designed to replace a legacy desktop application, Automata handles the full operational lifecycle — from device and client management to work orders, spare parts tracking, and service certificates.

Built solo, in active production use.

---

## Features

- **Manufacturers & Models** — manage equipment manufacturers and their device models
- **Clients** — client records with contact management and municipality-aware addressing (all 143 Bosnian municipalities)
- **Devices** — track individual medical devices per client, linked to manufacturer models
- **Work Orders** — multi-device work orders with per-device spare parts tracking for medical traceability
- **Spare Parts** — inventory with substitution relationships and directional named relations
- **Certificates** — service certificates linked to work orders
- **Contacts** — polymorphic contacts across clients and manufacturers
- **Authentication & RBAC** — role-based access control (`ADMINISTRATOR`, `SERVICE_PERSON`)
- **Soft deletes** — data integrity preserved across all entities

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| API | tRPC |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | Clerk |
| UI | shadcn/ui, Tailwind CSS |
| Data fetching | TanStack Query, useSuspenseQuery |
| Forms | React Hook Form, Zod v4 |
| Error tracking | Sentry |
| Language | TypeScript |

---

## Architecture Highlights

- **Feature-based folder structure** — no cross-feature imports; callbacks used to bridge feature boundaries
- **Smart/dumb component separation** — data-fetching logic isolated in smart components, dumb components are purely presentational
- **Context-based ownership patterns** — `ContactOwnerContext`, `ModelOwnerContext` for polymorphic list behaviour
- **Reusable generic hooks** — `useEntityFilter`, `useCreateModelInline` typed with TypeScript generics
- **tRPC query invalidation** — uses base `queryKey()` for fuzzy matching rather than exact `queryOptions({})`
- **Server-side prefetching** — `HydrateClient` + `prefetchQuery` for fast initial loads
- **Generic form field components** — `FormInputField`, `FormSelectField`, `FormTextareaField`, `FormDateField` typed with generics
- **Work order case numbers** — `YYYY-NNN` format with per-year sequence reset via Prisma transactions

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, CLERK keys, SENTRY DSN

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Domain Model (simplified)

```
Manufacturer → Model → Device → Client
                                   ↓
                              WorkOrder → WorkOrderDevice → SparePartInCase
                                   ↓
                              Certificate
```

Contacts are polymorphic across `Client` and `Manufacturer` via `ContactOwnerType` enum.