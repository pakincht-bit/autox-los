---
description: Git branching and commit workflow for feature development
---

# Git Flow Workflow

## 1. Sync with main

// turbo
```bash
git checkout main && git pull origin main
```

## 2. Create feature branch

```bash
git checkout -b <type>/<short-name>
```

Branch naming:
- `feat/<name>` — new features (e.g. `feat/loan-tracking`)
- `fix/<name>` — bug fixes (e.g. `fix/date-validation`)
- `style/<name>` — UI/CSS changes (e.g. `style/table-hover`)
- `docs/<name>` — documentation (e.g. `docs/api-guide`)

## 3. Make changes with conventional commits

```bash
git add .
git commit -m "<type>: <description in English>"
```

Commit types:
| Type | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/CSS only |
| `docs:` | Documentation |
| `refactor:` | Code restructure, no behavior change |
| `chore:` | Build, tooling, or config changes |

## 4. Pre-push checks

// turbo
```bash
npm run lint && npm run build
```

Both must pass before pushing.

## 5. Push and create PR

```bash
git push origin <branch-name>
```

Then create a Pull Request on GitHub targeting `main`.
