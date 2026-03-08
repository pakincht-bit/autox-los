---
description: How to create a new dashboard page following project conventions
---

# New Page Workflow

## 1. Determine route and title

- Route: `/dashboard/<page-name>` (kebab-case)
- Title: Thai language page heading

## 2. Scaffold the page

// turbo
```bash
python tools/scaffold_page.py <page-name> "<Thai Title>"
```

Example:
```bash
python tools/scaffold_page.py loan-tracking "ติดตามสินเชื่อ"
```

This creates `src/app/dashboard/<page-name>/page.tsx` with:
- `"use client"` directive
- Breadcrumb setup via `useSidebar`
- Standard page layout structure

## 3. Add sidebar navigation

Open `src/components/layout/Sidebar.tsx` and add a navigation entry:

```tsx
{ label: "<Thai Label>", href: "/dashboard/<page-name>", icon: <LucideIcon> }
```

## 4. Build page content

- Use existing components from `src/components/`
- Follow the compact density "Nova Style" — reduced padding, clear boundaries
- Use `p-6` for page container padding
- Use `gap-4` between form fields, `gap-2` between related buttons

## 5. Audit design rules

// turbo
```bash
python tools/audit_design.py src/app/dashboard/<page-name>/page.tsx
```

## 6. Verify build

// turbo
```bash
npm run build
```
