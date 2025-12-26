# Project Management Dashboard

## Overview

A full-stack project management dashboard built with React (Vite) and Express. The application provides interactive project visualization through Syncfusion components including Gantt charts, Kanban boards, and a dashboard with metrics. Currently uses in-memory mock data storage with PostgreSQL schema definitions ready for future database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **UI Components**: 
  - Syncfusion EJ2 React components for Gantt, Kanban, and Splitter layouts
  - Radix UI primitives via shadcn/ui for standard UI elements
  - Recharts for dashboard metrics visualization
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: HTTP server on port 5000, serves both API and static files
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Static files served from `dist/public`

### Data Layer
- **Current Storage**: In-memory `MemStorage` class with mock task data
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect (schema in `shared/schema.ts`)
- **Database Ready**: PostgreSQL connection configured via `DATABASE_URL` environment variable
- **Schema Push**: Use `npm run db:push` to sync schema to database when ready

### Build System
- **Development**: `npm run dev` runs tsx to start Express with Vite middleware
- **Production Build**: Custom esbuild script bundles server, Vite builds client
- **Output**: Server bundle at `dist/index.cjs`, client at `dist/public`

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` directory used by both frontend and backend
- **Type-Safe API**: Zod schemas validate API responses on the client
- **Date Handling**: API returns ISO strings, client converts to Date objects for Syncfusion components

## External Dependencies

### Syncfusion Components (License Required for Commercial Use)
- `@syncfusion/ej2-react-gantt` - Interactive Gantt chart for task scheduling
- `@syncfusion/ej2-react-kanban` - Kanban board for workflow management  
- `@syncfusion/ej2-react-layouts` - Splitter component for dashboard layout
- License key registered in `client/src/main.tsx`

### Database
- **PostgreSQL**: Configured via Drizzle ORM, requires `DATABASE_URL` environment variable
- **Drizzle Kit**: For schema migrations (`drizzle.config.ts`)

### UI Libraries
- **shadcn/ui**: Pre-built accessible components using Radix UI primitives
- **Recharts**: Dashboard chart visualizations
- **Lucide React**: Icon library

### API Endpoints
- `GET /api/tasks` - Returns task list for Gantt and Kanban views
- `GET /api/metrics` - Returns dashboard metrics (total projects, task counts by status)