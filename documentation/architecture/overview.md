# Architecture Overview

This document provides a high-level overview of the Graph Browser application architecture.

## System Architecture

The Graph Browser is a full-stack web application for visualizing and navigating graph data:

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface                         │
│                    (Web Browser)                         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────────┐
│                Frontend (Vue 3 SPA)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │              GraphBrowser (Main Component)        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │  │
│  │  │NodeHistory   │  │ConnectedList │  │NodeDetails│ │
│  │  │(Component)   │  │(Component)   │  │(Component)│ │
│  │  └──────────────┘  └──────────────┘  └─────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │        DataService (API Client - Axios)           │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP REST API
┌──────────────────────▼──────────────────────────────────┐
│                Backend (Express Server)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              API Routes (graph.js)                │  │
│  │  • GET /api/node/:id                              │  │
│  │  • GET /api/node/:id/children                     │  │
│  └──────────────────┬────────────────────────────────┘  │
│  ┌──────────────────▼────────────────────────────────┐  │
│  │         Database Layer (db.js)                    │  │
│  │  • getNode(id)                                    │  │
│  │  • getChildren(id)                                │  │
│  └──────────────────┬────────────────────────────────┘  │
│  ┌──────────────────▼────────────────────────────────┐  │
│  │              SQLite Database                      │  │
│  │          (trains.db - File-based)                 │  │
│  │  ┌─────────────┐      ┌─────────────┐            │  │
│  │  │   nodes     │      │   edges     │            │  │
│  │  │   table     │      │   table     │            │  │
│  │  └─────────────┘      └─────────────┘            │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │    Middleware (rateLimiter.js)                    │  │
│  │  • Rate limiting: 100 requests/hour per IP        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Vue 3**: Progressive JavaScript framework
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API requests
- **Vue Test Utils + Vitest**: Component testing

### Backend
- **Node.js**: JavaScript runtime
- **Express 5**: Web framework
- **SQLite3**: Embedded relational database
- **express-rate-limit**: API rate limiting
- **Vitest + Supertest**: API testing

## Core Components

### Frontend Components

#### GraphBrowser.vue
- **Purpose**: Main container component that orchestrates the graph browsing experience
- **Responsibilities**:
  - Manages global state (selected node, connected lists, history)
  - Coordinates communication between child components
  - Handles node selection and history navigation logic
- **Key Features**:
  - Dynamic number of ConnectedList components (configurable via `containerCount` prop)
  - Navigation history tracking
  - Automatic clearing of downstream lists when selecting nodes

#### ConnectedList.vue
- **Purpose**: Displays a list of nodes connected to a root node
- **Responsibilities**:
  - Shows the root node name and its children
  - Handles node selection events
  - Highlights currently selected node
- **Props**: `root`, `children`, `index`

#### NodeDetails.vue
- **Purpose**: Displays detailed information about the selected node
- **Responsibilities**:
  - Shows node metadata (label, namespace, hash)
  - Displays constituents if available
- **Props**: `node` (validated for required data structure)

#### NodeHistory.vue
- **Purpose**: Displays navigation history
- **Responsibilities**:
  - Shows ordered list of visited nodes
  - Allows clicking to navigate back to previous nodes
- **Props**: `nodes`

#### DataService.js
- **Purpose**: API client abstraction layer
- **Responsibilities**:
  - Encapsulates all HTTP communication with backend
  - Provides clean interface for component-level API calls
- **Methods**:
  - `getInitialNode(startingNode)`: Fetch starting node by ID
  - `childrenOf(nodeId)`: Get all children of a node
  - `getNodeById(nodeId)`: Fetch any node by ID

### Backend Components

#### graph.js
- **Purpose**: Express server and API route definitions
- **Responsibilities**:
  - Define RESTful API endpoints
  - Handle HTTP requests and responses
  - Error handling and status codes
  - Apply middleware (rate limiting)
- **Endpoints**:
  - `GET /api/node/:id`: Retrieve a single node
  - `GET /api/node/:id/children`: Get children of a node

#### db.js
- **Purpose**: Database abstraction layer
- **Responsibilities**:
  - Encapsulate SQLite interactions
  - Provide promisified database operations
  - Abstract SQL queries from route handlers
- **Functions**:
  - `getNode(id)`: Query single node
  - `getChildren(id)`: Query connected nodes

#### rateLimiter.js
- **Purpose**: API rate limiting middleware
- **Responsibilities**:
  - Prevent API abuse
  - Limit requests to 100 per hour per IP
- **Configuration**: 60-minute window, 100 requests max

## Data Flow

### Node Selection Flow
1. User clicks a node in ConnectedList
2. ConnectedList emits `node-selected` event with nodeId and listIndex
3. GraphBrowser receives event and calls `selectNode(nodeId, listIndex)`
4. GraphBrowser uses DataService to fetch node details and children
5. DataService makes HTTP request to `/api/node/:id` and `/api/node/:id/children`
6. Backend routes delegate to db.js for database queries
7. SQLite database returns results
8. Backend sends JSON response
9. DataService returns data to GraphBrowser
10. GraphBrowser updates state (connectedLists, selectedNode, nodeHistory)
11. Vue's reactivity system updates UI automatically

### History Navigation Flow
1. User clicks on history item
2. NodeHistory emits `history-item-selected` event
3. GraphBrowser truncates history to selected point
4. GraphBrowser rebuilds all ConnectedLists from history data
5. Each list is populated by fetching children for historical nodes
6. UI updates to reflect historical state

## Database Schema

```sql
-- Nodes table: stores graph entities
CREATE TABLE nodes (
  id INTEGER PRIMARY KEY,
  name TEXT,
  data TEXT  -- JSON blob containing additional metadata
);

-- Edges table: stores relationships between nodes
CREATE TABLE edges (
  source INTEGER,
  target INTEGER,
  FOREIGN KEY (source) REFERENCES nodes(id),
  FOREIGN KEY (target) REFERENCES nodes(id)
);
```

### Node Data Structure
The `data` field contains JSON with this structure:
```json
{
  "label": "Node Label",
  "NS": "Namespace.Path",
  "hash": "unique_hash_123",
  "constituents": [
    {
      "hash": "constituent_hash",
      "weight": 1.0
    }
  ]
}
```

## Key Design Patterns

### Separation of Concerns
- **Presentation Layer**: Vue components (view)
- **Business Logic**: Component methods and computed properties
- **Data Access**: DataService (frontend) and db.js (backend)
- **API Layer**: Express routes

### Component Communication
- **Props Down**: Parent components pass data to children via props
- **Events Up**: Child components emit events to notify parents
- **Centralized State**: GraphBrowser maintains global state

### Error Handling
- Backend returns standard HTTP error codes (404, 500)
- Console logging for debugging
- Error messages in API responses

### Testing Strategy
- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints with mocked database
- **Test Organization**: `__tests__` directories co-located with source
- **Mocking**: Database and HTTP calls mocked for isolated testing

## Development Workflow

### Local Development
1. Start backend: `node api/graph.js` (port 3000)
2. Start frontend: `npm run dev` (port 5173)
3. Vite proxies API requests to backend automatically

### Testing
1. Run all tests: `npm test`
2. Coverage report: `npm run coverage`
3. Watch mode: Tests automatically rerun on file changes

### Build & Deployment
1. Build: `npm run build` (outputs to `docs/` directory)
2. Preview: `npm run preview`
3. Deploy: Static files can be served from any web server

## Configuration

### Frontend Configuration (vite.config.js)
- Vue plugin setup
- Path aliases (`@` → `./src`)
- Base path for GitHub Pages
- Test configuration
- Build output directory

### Backend Configuration
- Port: 3000 (hardcoded in graph.js)
- Database: `trains.db` (hardcoded in db.js)
- Rate limit: 100 requests/hour (rateLimiter.js)

**Note**: Configuration management is an area for improvement (see ARCHITECTURE.md)

## Security Considerations

### Current Security Measures
- Rate limiting (100 requests/hour per IP)
- Express 5 built-in security improvements
- Parameterized SQL queries (prevents SQL injection)

### Recommended Improvements (See ARCHITECTURE.md)
- Add helmet.js for security headers
- Implement CORS policy
- Add input validation
- Add authentication/authorization (if needed)
- Security audit of dependencies

## Performance Characteristics

### Frontend
- Initial load: Fast (small bundle size)
- Node selection: <100ms (single API call)
- History navigation: <500ms (multiple API calls)
- UI updates: Instant (Vue reactivity)

### Backend
- Node query: <10ms (indexed lookup)
- Children query: <50ms (simple JOIN)
- Rate limiting overhead: Minimal

### Database
- File-based SQLite: Fast for current dataset size
- Scales well to thousands of nodes
- Limitations begin at millions of records

## Scalability Considerations

### Current Limits
- SQLite concurrent writes: Limited
- Dataset size: Optimal up to ~100,000 nodes
- Single server deployment: Vertical scaling only

### Future Scaling Options (See ARCHITECTURE.md)
- Migrate to PostgreSQL for larger datasets
- Add caching layer (Redis)
- Implement pagination
- API versioning for backward compatibility
- Microservices architecture for very large scale

## Further Reading

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Comprehensive architecture assessment and recommendations
- [Architecture Decision Records](decisions/) - Historical architectural decisions
- [README.md](../../README.md) - Project setup and usage
- [API README](../../api/README.md) - Backend API details

## Quick Links

- **Main Documentation**: [README.md](../../README.md)
- **Architecture Assessment**: [ARCHITECTURE.md](../../ARCHITECTURE.md)
- **ADR Index**: [decisions/README.md](decisions/README.md)
- **Contributing**: See ARCHITECTURE.md for recommended areas

---

**Last Updated**: 2025-10-10  
**Status**: Current
