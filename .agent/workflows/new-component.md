---
description: How to create a new React component following project conventions
---

# New Component Workflow

## 1. Determine component type

- **UI base** → `src/components/ui/` (reusable primitives like Button, Input)
- **Feature-specific** → `src/components/<feature>/` (e.g. application, dashboard, calculator)

## 2. Scaffold the component

// turbo
```bash
python tools/scaffold_component.py <ComponentName> <directory>
```

Example:
```bash
python tools/scaffold_component.py LoanSummaryCard application
```

## 3. Implement the component

- Use **shadcn/ui** components from `@/components/ui/` — never create custom HTML when a shadcn component exists
- Import icons from `lucide-react`
- Use `cn()` from `@/lib/utils` for conditional classes
- Follow design rules: run `/design-rules` for the full reference

### Key conventions:
- Form inputs: `h-12`, `bg-white`, `rounded-xl`
- Borders: always pair `border` with an explicit color class
- Thai labels for all user-facing text
- English for code variables, comments, and component names

## 4. Audit design rules

// turbo
```bash
python tools/audit_design.py src/components/<directory>/<ComponentName>.tsx
```

Fix any violations before proceeding.

## 5. Verify build

// turbo
```bash
npm run build
```

Ensure no TypeScript or build errors.
