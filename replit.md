# ThinkLight - Reflection and Learning Application

## Overview

ThinkLight is a web application designed to help users capture and reflect on their experiences through guided sessions. Users can choose between documenting lessons learned or working through problems they're facing. The application supports both text input and voice recording to capture thoughts and ideas.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: React Query for server state, local React state for UI
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: REST API with JSON responses
- **File Uploads**: Multer for handling audio file uploads

## Key Components

### Database Schema
The application uses a single `sessions` table to store reflection sessions:
- **Type**: Either "lesson" or "problem" sessions
- **Content Fields**: Scenario description, lesson value, problem type
- **Ideas**: Boolean flag for having ideas and description
- **Audio Support**: JSON array for storing audio file paths
- **Timestamps**: Created date tracking

### Session Types
1. **Lesson Sessions**: For capturing positive experiences and learnings
2. **Problem Sessions**: For working through challenges with categorization (time, money, resources, etc.)

### Voice-to-Text Integration
- Browser-based speech recognition using Web Speech API
- Real-time transcription with continuous listening mode
- Text and voice input modes with seamless switching
- Automatic text insertion from speech recognition
- Cross-browser compatibility with WebKit support
- Custom hooks for speech recognition state management

### UI Components
- Step-by-step wizard interface with progress tracking
- Voice-to-text input components with mode switching (text/voice)
- Real-time speech transcription display
- History sidebar for browsing past sessions
- Completion flow with export capabilities

## Data Flow

1. **Session Creation**: User selects session type (lesson/problem)
2. **Content Input**: User fills out scenario details via text or voice
3. **Idea Capture**: Optional idea documentation with voice support
4. **Persistence**: Session data saved to database with audio file references
5. **History Access**: Users can browse and review past sessions

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18+ with TypeScript
- **Component Library**: Radix UI primitives via shadcn/ui
- **Styling**: TailwindCSS with CSS variables for theming
- **Data Fetching**: TanStack Query for API state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Configured for PostgreSQL via Drizzle ORM
- **Database Client**: Neon serverless driver for PostgreSQL
- **File Upload**: Multer for multipart form handling
- **Session Storage**: In-memory storage with interface for future database integration

### Development Tools
- **Build System**: Vite with React plugin
- **Database Migrations**: Drizzle Kit for schema management
- **Development**: TSX for TypeScript execution
- **Linting**: TypeScript compiler for type checking

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` using Vite
- Backend bundles to `dist/index.js` using esbuild
- Static assets served by Express in production

### Environment Configuration
- Development: Vite dev server with Express API
- Production: Single Express server serving built frontend and API
- Database: PostgreSQL connection via environment variable

### File Storage
- Audio files stored in local `uploads/audio` directory
- Unique filename generation with timestamp and random suffix
- Organized by upload type for future expansion

The application is designed for easy deployment to platforms supporting Node.js with file system access for audio storage. The database layer is abstracted to allow switching from in-memory to PostgreSQL without code changes.