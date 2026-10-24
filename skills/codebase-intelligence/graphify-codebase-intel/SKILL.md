---
name: graphify-codebase-intel
description: >
  Master skill for building and querying structural knowledge graphs of codebases using Graphify.
  Extracts AST symbols, function call graphs, inheritance hierarchies, and dependency relationships.
  Use when exploring large unfamiliar codebases, planning architectural refactoring, or performing
  deep impact analysis across multi-module projects.
---

# Graphify Codebase Intelligence Skill

Graphify turns complex repositories into queryable, visual knowledge graphs. It extracts abstract syntax trees (AST), symbol declarations, imports, call paths, and architectural boundaries.

## 1. When to Use

- **Onboarding large codebases:** Map out module interactions before changing code.
- **Architectural refactoring:** Identify circular dependencies and high-coupling hotspots.
- **Impact analysis:** Query which downstream components, tests, and endpoints are impacted when modifying a core model or service.

## 2. Command Playbook

```bash
# Build knowledge graph for current repository
npx graphify build --dir . --out .planning/graphs/codebase-graph.json

# Query symbols and dependencies
npx graphify query --symbol "AuthService" --depth 2

# Check for architectural violations or circular imports
npx graphify audit --rules strict-boundaries
```

## 3. Best Practices for AI Agents

1. **Query before editing:** Query symbol references across the workspace to avoid breaking hidden callers.
2. **Cluster by module:** Inspect high-level module graphs first, then zoom into file-level call graphs.
3. **Persist graphs:** Keep `.planning/graphs/` synced to preserve structural memory across agent sessions.
