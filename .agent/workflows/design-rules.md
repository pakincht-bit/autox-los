---
description: Design rules and conventions for the AutoX LOS project UI
---

# Design Rules

These are the design conventions that **must** be followed when implementing UI in this project.

## Form Elements (Inputs, Selects, Comboboxes)
- **Use `h-12` as the platform standard height.** All form elements should uniformly use `h-12` (48px) to provide a consistent, touch-friendly UI across the application. 
- **Use white backgrounds.** Do not use `bg-gray-50` or `bg-gray-100` for default input backgrounds unless it is specifically disabled. Rely on the base `bg-white` from the default Shadcn component.
- The default UI components (`Input`, `Select`, `Combobox`) have been preconfigured to use `h-12` and `bg-white` by default. Do not add redundant `className="h-12 border-gray-200 ..."` inline classes when rendering these fields.

## Border Colors

- **Never use black borders.** All borders must use soft, neutral gray tones.
- Use `border-gray-200` (`#E5E7EB`) as the **default** border color for cards, containers, and dividers.
- Use `border-gray-100` (`#F3F4F6`) for **subtle** borders (e.g., inner separators).
- Use `border-gray-300` (`#D1D5DB`) for **stronger** borders (e.g., inputs on focus).
- For brand-colored borders, use `border-chaiyo-blue` or `border-chaiyo-gold` sparingly.
- The bare `border` utility class in Tailwind v4 defaults to `currentColor` (often black). **Always** pair it with an explicit border color class, e.g., `border border-gray-200`.

## Color Tokens

Reference the `@theme` block in `globals.css` for all color tokens:
- `--color-border-color: #E5E7EB` (Gray 200) — default borders
- `--color-border-subtle: #F3F4F6` (Gray 100) — subtle borders
- `--color-border-strong: #D1D5DB` (Gray 300) — strong borders

## Components

- Always use **shadcn UI** components from `@/components/ui/` instead of creating custom HTML elements.
- If a component variant doesn't exist (e.g., `Alert` with `warning`), add the variant to the shadcn component rather than building a custom div.

## Dialogs

- Dialog backdrops (overlays) must use **10% opacity black** (`bg-black/10`) with a blur effect (`backdrop-blur-sm`). Do not use the default heavy `bg-black/80`.
