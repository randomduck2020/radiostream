# Overview

This is a full-stack radio streaming application built with React, Express, and in-memory storage. The application allows users to manage and listen to internet radio stations through a modern web interface. It features a clean, mobile-responsive design using shadcn/ui components and provides real-time audio streaming capabilities with full car audio system integration.

## Recent Changes (January 2025)
- Successfully implemented web-based radio player with car audio compatibility
- Added Media Session API integration for Android Auto and CarPlay support
- Implemented station management (add/delete stations)
- Added mobile-optimized touch controls and responsive design
- Integrated next/previous station navigation with car audio controls
- Application confirmed working by user

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Single-page application using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **UI Framework**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for form management

## Backend Architecture
- **Express.js Server**: Node.js REST API server with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **API Design**: RESTful API endpoints for CRUD operations on radio stations
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development Tools**: Hot module replacement with Vite integration for seamless development

## Data Layer
- **PostgreSQL Database**: Primary data store using Neon serverless PostgreSQL
- **Schema Management**: Drizzle migrations for database schema versioning
- **Type Safety**: Shared TypeScript types between client and server using Zod schemas
- **In-Memory Storage**: Fallback memory storage implementation for development/testing

## Audio System
- **Custom Audio Hook**: React hook managing HTML5 Audio API for streaming radio stations
- **Real-time Controls**: Play/pause, volume control, and station switching capabilities
- **Error Handling**: Graceful handling of network issues and invalid stream URLs
- **Loading States**: User feedback during audio loading and buffering

## Component Architecture
- **Modular Design**: Reusable UI components organized by feature (radio player, stations list, controls)
- **Responsive Layout**: Mobile-first design with adaptive layouts for different screen sizes
- **Accessibility**: ARIA labels and keyboard navigation support through Radix UI primitives
- **Theme Support**: CSS custom properties for consistent theming and dark mode support

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations and query building
- **@tanstack/react-query**: Server state management, caching, and data synchronization

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework for responsive design
- **class-variance-authority**: Utility for managing component variants and styling
- **lucide-react**: Modern icon library with consistent design

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment
- **@replit/vite-plugin-cartographer**: Code navigation and exploration tools
- **tsx**: TypeScript execution environment for Node.js development server

## Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration layer for external validation libraries
- **zod**: Schema validation library for runtime type checking
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation

## Routing and Navigation
- **wouter**: Minimalist routing library for React applications with hooks-based API