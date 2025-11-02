# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Graph Browser project. ADRs document important architectural decisions made during the development of the project, including the context, decision, and consequences.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences. ADRs help teams:

- Understand why certain decisions were made
- Onboard new team members faster
- Revisit and revise decisions when needed
- Learn from past decisions

## ADR Format

Each ADR follows a consistent template that includes:

- **Status**: Current state of the decision (Proposed, Accepted, Deprecated, Superseded)
- **Context**: Background information and constraints
- **Decision**: What was decided and why
- **Alternatives Considered**: Other options that were evaluated
- **Consequences**: Positive, negative, and neutral outcomes

## Creating a New ADR

1. Copy the [template.md](template.md) file
2. Name it with the next sequential number: `NNNN-brief-description.md`
3. Fill in all sections
4. Submit for review via pull request
5. Update this index when the ADR is accepted

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-use-vue3-for-frontend.md) | Use Vue 3 for Frontend Framework | Accepted | 2023-01-01 |
| [0002](0002-use-sqlite-for-data-storage.md) | Use SQLite for Data Storage | Accepted | 2023-01-01 |
| [0003](0003-use-vitest-for-testing.md) | Use Vitest for Testing | Accepted | 2024-01-01 |

## ADR Lifecycle

### Proposed
The ADR is under discussion and not yet implemented.

### Accepted
The decision has been made and is being implemented or is in use.

### Deprecated
The decision is no longer current but hasn't been replaced. The system may still use this approach.

### Superseded
The decision has been replaced by a newer ADR. A reference to the superseding ADR should be included.

## References

- [ADR Template](template.md)
- [Architecture Documentation](../overview.md)
- [Main ARCHITECTURE.md](../../../ARCHITECTURE.md)

## Resources

- [Joel Parker Henderson's ADR organization](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization](https://adr.github.io/)
