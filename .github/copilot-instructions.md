# GitHub Copilot Instructions for Graph Browser

## Project Overview

Graph Browser is a web application for browsing graph data, built with Vue 3 and a Node.js backend.

## Architecture

- **Frontend**: Vue 3 single-page application built with Vite (located in `src/` directory)
- **Backend**: Node.js Express server providing RESTful API for graph data from SQLite (located in `api/` directory)

## Technology Stack

- **Frontend**: Vue 3, Vite, Axios
- **Backend**: Express.js, SQLite3
- **Testing**: Vitest, @vue/test-utils
- **Linting**: ESLint with Vue 3 plugin, Prettier

## Coding Standards

### General

- Use ES modules (`import`/`export`) - the project is configured with `"type": "module"`
- Use modern JavaScript (ECMAScript latest)
- Follow existing code style and formatting
- Use Prettier for code formatting
- Use ESLint for code linting

### Vue Components

- Use Composition API or Options API consistently with existing components
- Follow Vue 3 best practices
- Use single-file components (`.vue` files)
- Keep components focused and reusable

### Testing

- Write unit tests for new components and functions using Vitest
- Place tests in `__tests__` directories adjacent to the code
- Use descriptive test names that explain what is being tested
- Mock external dependencies using `vi.mock()`
- Follow existing test patterns (see `src/components/__tests__/` for examples)

### File Organization

- Frontend source code: `src/`
- Backend API code: `api/`
- Tests: `__tests__/` directories adjacent to code
- Configuration files in project root

## Build and Development

### Available Scripts

- `npm run dev` - Start frontend development server (localhost:5173)
- `npm run build` - Build production bundle to `docs/` directory
- `npm test` - Run all tests with Vitest
- `npm run coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Backend Server

- Start with `node api/graph.js` (runs on port 3000)
- Database: SQLite database (`trains.db`)

## Dependencies

- Only add dependencies when absolutely necessary
- Prefer using existing libraries already in the project
- Check for security vulnerabilities before adding new packages

## Best Practices

- Make minimal, focused changes
- Ensure code passes linting before committing
- Write tests for new functionality
- Update documentation when changing APIs or adding features
- Follow the existing project structure and conventions
