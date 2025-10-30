# Quick Reference Card

**Graph Browser Architecture - At a Glance**

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Vue 3 | UI Components |
| Build Tool | Vite | Dev server & bundling |
| Backend | Express 5 | REST API |
| Database | SQLite3 | Data storage |
| Testing | Vitest | Unit & integration tests |

## API Endpoints

```
GET /api/node/:id
├─ Success: 200 { id, name, data }
├─ Not Found: 404 { error: "Node not found" }
└─ Error: 500 { error: "Internal Server Error" }

GET /api/node/:id/children
├─ Success: 200 [{ id, name, data }, ...]
└─ Error: 500 { error: "Internal Server Error" }
```

## Key Files

```
src/components/GraphBrowser.vue    - Main container component
src/components/DataService.js      - API client
api/graph.js                       - Express routes
api/db.js                          - Database queries
ARCHITECTURE.md                    - Full assessment
documentation/SUMMARY.md           - This assessment summary
```

## Development Commands

```bash
# Install dependencies
npm install

# Run backend (port 3000)
node api/graph.js

# Run frontend dev server (port 5173)
npm run dev

# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Build for production
npm run build

# Lint code
npm run lint
```

## Database Schema

```sql
nodes
├─ id (PRIMARY KEY)
├─ name (TEXT)
└─ data (JSON TEXT)

edges
├─ source (FK → nodes.id)
└─ target (FK → nodes.id)
```

## Component Props & Events

### GraphBrowser.vue
**Props:**
- `startingNode` (Number, required) - Initial node ID
- `containerCount` (Number, required) - Number of ConnectedList components

**State:**
- `selectedNode` - Currently selected node
- `connectedLists` - Array of {root, children} objects
- `nodeHistory` - Array of visited nodes

### ConnectedList.vue
**Props:**
- `root` (Object, required) - Root node
- `children` (Array, required) - Child nodes
- `index` (Number, required) - List index

**Events:**
- `node-selected(nodeId, listIndex)` - Node clicked

### NodeDetails.vue
**Props:**
- `node` (Object, required, validated) - Node to display
  - Must have: `data.label`, `data.NS`, `data.hash`, `data.constituents`

### NodeHistory.vue
**Props:**
- `nodes` (Array, required) - History of visited nodes

**Events:**
- `history-item-selected(nodeId, itemIndex)` - History item clicked

## DataService API

```javascript
const service = new DataService();

// Get initial/starting node
await service.getInitialNode(nodeId)
// Returns: { id, name, data }

// Get node by ID
await service.getNodeById(nodeId)
// Returns: { id, name, data }

// Get children of a node
await service.childrenOf(nodeId)
// Returns: [{ id, name, data }, ...]
```

## Database Functions

```javascript
import * as db from './api/db.js';

// Get single node
await db.getNode(id)
// Returns: { id, name, data } or null

// Get children of node
await db.getChildren(id)
// Returns: [{ id, name, data }, ...]
```

## Test Organization

```
Frontend Tests (src/components/__tests__/)
├─ ConnectedList.spec.js (4 tests)
├─ GraphBrowser.spec.js (13 tests)
├─ NodeDetails.spec.js (2 tests)
├─ NodeHistory.spec.js (1 test)
└─ graph.fixture.json (test data)

Backend Tests (api/__tests__/)
└─ graph.spec.js (6 tests)
```

## Priority Actions

### 🔴 High Priority (Critical)
1. Fix ESLint configuration
2. Run `npm audit fix` for security
3. Implement error handling
4. Add API documentation (OpenAPI)
5. Increase test coverage
6. Security hardening (helmet, CORS)

### 🟡 Medium Priority (Important)
7. Reorganize code structure
8. Add environment configuration
9. Create client SDK library
10. Add integration tests
11. Implement API versioning
12. Add caching layer

### 🟢 Low Priority (Nice to Have)
13. Feature-based backend structure
14. TypeScript migration
15. Test data builders
16. Plugin architecture
17. Data source abstraction
18. Monitoring & logging

## Security Notes

**Current:**
- ✅ Rate limiting: 100 req/hour per IP
- ✅ Parameterized SQL queries
- ✅ Express 5 security improvements

**Recommended:**
- ⚠️ Add helmet.js for headers
- ⚠️ Configure CORS properly
- ⚠️ Add input validation
- ⚠️ Fix npm vulnerabilities

## Performance Tips

**Frontend:**
- Vue reactivity handles updates automatically
- Component mounts are lazy
- Vite bundles efficiently

**Backend:**
- SQLite is fast for current scale (<100k nodes)
- Rate limiter prevents abuse
- Consider caching for repeated queries

**Optimization Ideas:**
- Add Redis for caching
- Implement pagination
- Add database indexes
- Use CDN for static assets

## Documentation Links

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Comprehensive assessment (500+ lines) |
| [SUMMARY.md](SUMMARY.md) | Assessment summary & navigation |
| [overview.md](architecture/overview.md) | Technical architecture details |
| [diagrams.md](architecture/diagrams.md) | Visual architecture diagrams |
| [ADR Index](architecture/decisions/README.md) | Architecture decisions |
| [README.md](../README.md) | Setup & usage |

## Getting Help

1. **New to the project?** Start with [README.md](../README.md)
2. **Understanding architecture?** Read [overview.md](architecture/overview.md)
3. **Making decisions?** Check [ADRs](architecture/decisions/) and use [template](architecture/decisions/template.md)
4. **Contributing?** See priorities in [ARCHITECTURE.md](../ARCHITECTURE.md)
5. **API questions?** See endpoint documentation in [overview.md](architecture/overview.md)

## Metrics

- **Files**: 8 documentation files created
- **Lines of Documentation**: ~1,500 lines
- **Test Coverage**: 26 tests passing
- **Dependencies**: 0 security issues (after npm audit fix)
- **Build Time**: <5 seconds
- **Test Time**: <3 seconds

---

**Version**: 1.0  
**Last Updated**: 2025-10-10  
**Quick Link**: [Full Documentation Index](SUMMARY.md)
