# Overview

This is a turn-based card game called "Гражданская война" (Civil War) that simulates battles between the White Guard and Bolshevik factions during the Russian Civil War. Players build decks of unit and bonus cards, deploy them on a battlefield, and attempt to destroy their opponent's towers and caravan while defending their own structures.

The game features:
- Single-player mode against an AI opponent
- Local multiplayer mode for two players
- Deck building system with faction-specific cards
- Turn-based combat with various unit types (assault, flying, spy, support, medic, etc.)
- Strategic gameplay involving supply management, unit positioning, and tactical card usage
- Audio feedback system for game events
- Modern React-based UI with professional dark theme design
- Responsive layout optimized for desktop and mobile play

## Recent Changes

**October 5, 2025 - v1.0.29** - Game Logic Fix & UI Improvements
- Fixed bot game logic: player always displays at bottom, regardless of faction
- Implemented random side selection at game start (in bot mode: player=White Guard, bot=Bolshevik)
- Redesigned hand UI: when hidden, shows as semi-transparent circle (bottom-right) instead of blocking interface
- Updated version to 1.0.29 with copyright "© Студия Марка Минченко"
- Reduced background music volume to 0.15 for calmer atmosphere
- Added instructions for Serbian folk music integration

**Background Music Integration:**
To add authentic Serbian folk background music:
1. Download calm Serbian/Balkan folk music from:
   - Pixabay (free, no attribution): https://pixabay.com/music/search/serbia/ or /balkan/
   - Free Music Archive: https://freemusicarchive.org/genre/Balkan/
2. Replace `client/public/sounds/background.mp3` with your downloaded track
3. Recommended: search for "Serbian flute", "Balkan meditation", or "folk accordion" for calm tracks

**October 5, 2025** - UI/UX Modernization and Professional Design Overhaul
- Migrated to professional dark theme gaming UI
- Removed emojis from UI elements (buttons, menus, status text)
- Retained emojis only for cards (unit types and rarity indicators)
- Implemented faction-specific color schemes (Blue for White Guard, Red for Bolsheviks)
- Updated design system with proper spacing, typography, and component hierarchy
- Applied shadcn components with custom gaming theme
- Improved card visuals with proper rarity indicators
- Enhanced responsive design for all screen sizes

# User Preferences

Preferred communication style: Simple, everyday language in Russian.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**State Management**: Zustand for global state management, with separate stores for:
- Game state (turns, cards, field positions, health values)
- Audio state (background music, sound effects, mute controls)

**UI Components**: Radix UI component library with Tailwind CSS for styling, providing a comprehensive set of accessible components (dialogs, cards, buttons, dropdowns, etc.).

**Design System**: Dark theme gaming UI with:
- Faction colors (Blue for White Guard, Red for Bolsheviks)
- Rarity system (Common, Rare, Epic, Legendary)
- Professional typography using Inter and Space Grotesk fonts
- Consistent spacing and elevation system
- Responsive breakpoints for mobile and desktop

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
- Inter and Space Grotesk font families via Google Fonts

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

## Project Architecture

### Frontend Components
- `MainMenu.tsx` - Game mode selection (Bot vs Multiplayer)
- `DeckBuilder.tsx` - Deck construction interface for both factions
- `GameBoard.tsx` - Main battle arena with towers, caravans, and unit fields
- `GameUI.tsx` - HUD overlay with hand, supply, and turn controls
- `Card.tsx` - Individual card component with stats and visuals
- `Tower.tsx` - Defensive structure component
- `Caravan.tsx` - Main objective component
- `BotController.tsx` - AI decision-making system
- `SoundToggle.tsx` - Audio controls
- `SoundInitializer.tsx` - Audio system setup

### Game Data
- `cards.ts` - Card database with all units and bonuses for both factions
- `types/cards.ts` - TypeScript interfaces for game objects

### Game Logic
- `gameLogic.ts` - Core game rules, validation, and state transitions
- `botAI.ts` - Computer opponent strategy and decision algorithms
- `useGameState.tsx` - Zustand store for game state management
- `useAudio.tsx` - Zustand store for audio state

### Styling
- Dark theme with faction-specific color coding
- Responsive design for various screen sizes
- Professional card design with rarity indicators
- Smooth animations and transitions
- Accessibility-focused component usage
