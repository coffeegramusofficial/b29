# Overview

This is a turn-based card game called "Гражданская война" (Civil War) that simulates battles between the White Guard and Bolshevik factions during the Russian Civil War. Players build decks of unit and bonus cards, deploy them on a battlefield, and attempt to destroy their opponent's towers and caravan while defending their own structures.

The game features:
- Single-player mode against an AI opponent
- Local multiplayer mode for two players
- Deck building system with faction-specific cards
- Turn-based combat with various unit types (assault, flying, spy, support, medic, etc.)
- Strategic gameplay involving supply management, unit positioning, and tactical card usage
- Audio feedback system for game events
- Modern React-based UI with Three.js 3D graphics support

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**State Management**: Zustand for global state management, with separate stores for:
- Game state (turns, cards, field positions, health values)
- Audio state (background music, sound effects, mute controls)

**UI Components**: Radix UI component library with Tailwind CSS for styling, providing a comprehensive set of accessible components (dialogs, cards, buttons, dropdowns, etc.).

**3D Graphics**: React Three Fiber and Drei for potential 3D rendering capabilities, with GLSL shader support via vite-plugin-glsl. The game currently uses 2D UI but has infrastructure for 3D enhancements.

**Routing**: Single-page application with phase-based navigation (menu → deck building → playing → game over) rather than traditional routing.

**Design Pattern**: Component-based architecture with clear separation between:
- UI components (visual presentation)
- Game logic (rules, validation, AI)
- State management (data flow)
- Type definitions (TypeScript interfaces)

## Backend Architecture

**Server Framework**: Express.js running on Node.js with ESM module system.

**Development Setup**: Vite middleware integration for hot module replacement during development, with separate production build process.

**API Structure**: RESTful API pattern with `/api` prefix for all backend routes (currently minimal implementation with placeholder route registration).

**Storage Layer**: Abstract storage interface pattern (`IStorage`) with in-memory implementation (`MemStorage`) for user management. Designed to be swappable with database-backed implementations.

**Build Process**: 
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Separate type checking via TypeScript compiler

## Data Storage

**Database ORM**: Drizzle ORM configured for PostgreSQL with schema defined in `shared/schema.ts`.

**Schema Design**: Currently includes a users table with username/password fields. The schema uses Drizzle's type-safe query builders and Zod for runtime validation.

**Migration Strategy**: Drizzle Kit for schema migrations with `db:push` command to sync schema changes to database.

**Current State**: Database integration is configured but not actively used by the game logic. The game operates entirely in-memory with local state management. User authentication and persistence are planned features.

## External Dependencies

**Database**: Neon serverless PostgreSQL (via `@neondatabase/serverless` driver). Requires `DATABASE_URL` environment variable for connection.

**Session Management**: `connect-pg-simple` for PostgreSQL-backed session storage (configured but not currently active).

**UI Libraries**:
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for icons
- Inter font family via @fontsource

**3D Graphics Stack**:
- Three.js (via React Three Fiber)
- @react-three/drei for helpers and abstractions
- @react-three/postprocessing for visual effects
- GLSL shader support

**State & Data Fetching**:
- Zustand for client-side state management
- TanStack Query for server state management (configured but minimal usage)

**Development Tools**:
- tsx for running TypeScript in development
- esbuild for production bundling
- Replit-specific vite plugin for error overlay

**Audio**: Native HTML5 Audio API for background music and sound effects (no external audio library dependencies).

**Card Game Logic**: Custom implementation with bot AI using strategic evaluation of game state to select optimal moves.