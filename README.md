# Graph Browser

A web application to browse graph data, built with Vue 3 and a Node.js backend.

## Architecture

The application is composed of two main parts:

-   **Frontend**: A Vue 3 single-page application built with Vite. The frontend code is located in the `src` directory.
-   **Backend**: A Node.js server built with Express that provides a RESTful API to access the graph data from a SQLite database. The backend code is located in the `api` directory.

For a comprehensive architecture overview and improvement recommendations, see [ARCHITECTURE.md](ARCHITECTURE.md).

### Architecture Documentation

- [Architecture Assessment & Recommendations](ARCHITECTURE.md) - Comprehensive analysis and improvement suggestions
- [Architecture Decision Records (ADRs)](documentation/architecture/decisions/) - Historical architectural decisions
  - [ADR-0001: Use Vue 3 for Frontend](documentation/architecture/decisions/0001-use-vue3-for-frontend.md)
  - [ADR-0002: Use SQLite for Data Storage](documentation/architecture/decisions/0002-use-sqlite-for-data-storage.md)
  - [ADR-0003: Use Vitest for Testing](documentation/architecture/decisions/0003-use-vitest-for-testing.md)

## Project Setup

### Prerequisites

-   Node.js (v16 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/bmordue/graph-browser.git
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```

### Database Setup

The application uses a SQLite database to store the graph data. A sample database `trains.db` is included in the `api` directory.

To create the database from scratch, you can use the `trains.sql` file:
```sh
sqlite3 api/trains.db < api/trains.sql
```

## Development

### Running the Backend Server

To start the backend server, run the following command:
```sh
node api/graph.js
```
The server will start on port 3000.

### Running the Frontend Development Server

To start the frontend development server with hot-reload, run:
```sh
npm run dev
```
The application will be available at `http://localhost:5173`.

## Testing

### Running Unit Tests

To run the unit tests for both the frontend and the backend, run:
```sh
npm test
```

To run only the frontend tests:
```sh
npm run test:unit
```

To run only the backend tests:
```sh
npm test -- api/__tests__/graph.spec.js
```

### Linting

To lint the code, run:
```sh
npm run lint
```

## Contributing

We welcome contributions! Please see our architecture documentation for guidelines:

- [Architecture Assessment](ARCHITECTURE.md) - Review recommendations for areas to contribute
- [Architecture Decision Records](docs/architecture/decisions/) - Understand architectural decisions

When contributing:
1. Follow the existing code style and conventions
2. Write tests for new functionality
3. Update documentation as needed
4. Consider creating an ADR for significant architectural decisions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
