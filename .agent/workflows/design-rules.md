---
description: Design rules and conventions for the AutoX LOS project UI
---

# Design Rules

These are the design conventions that **must** be followed when implementing UI in this project.

## Form Elements (Inputs, Selects, Comboboxes)
- **Use `h-12` as the platform standard height.** All form elements should uniformly use `h-12` (48px) to provide a consistent, touch-friendly UI across the application. 
- **Use white backgrounds.** Do not use `bg-gray-50` or `bg-gray-100` for default input backgrounds unless it is specifically disabled. Rely on the base `bg-white` from the default Shadcn component.
- The default UI components (`Input`, `Select`, `Combobox`) have been preconfigured to use `h-12` and `bg-white` by default. Do not add redundant `className="h-12 border-gray-200 ..."` inline classes when rendering these fields.
## Dates & Years
- **Strictly use Buddhist Era (พ.ศ.).** All dates displayed to the user or entered by the user **must** use B.E. years (e.g., 2567). 
- **No A.D. (C.E.) years.** Never show Western years (e.g., 2024) in any part of the UI.
- **Input logic.** Use text inputs with formatting logic (e.g., `DD/MM/YYYY`) to handle B.E. years. Avoid native `type="date"` inputs which often default to A.D.
- **Conversion.** Convert B.E. years to A.D. (Year - 543) only when saving to the backend or using standard JavaScript `Date` objects internally.

- Use `border-gray-200` (`#E5E7EB`) as the **default** border color for inputs and active containers.
- Use `border-gray-100` (`#F3F4F6` / `border-border-subtle`) for **outer card borders** in the minimalist aesthetic to ensure an integrated, premium feel, and for inner separators.
- Use `border-gray-300` (`#D1D5DB`) for strong boundaries where high contrast is needed.
- For brand-colored borders, use `border-chaiyo-blue` or `border-chaiyo-gold` sparingly.
- The bare `border` utility class in Tailwind v4 defaults to `currentColor` (often black). **Always** pair it with an explicit border color class, e.g., `border border-border-subtle`.

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
- **Dialogs must not have a top-right close (X) icon.** All dialogs should be closed via explicit buttons in the footer (e.g., "Cancel", "Confirm") or the backdrop. The close button has been removed from the shared `DialogContent` component; do not attempt to re-add it in individual implementations.

## Layering & Z-Index

- **Sidebar Toggle Overlay**: Use `z-40`. This ensures it stays above the main content but below any dialogs or sheets.
- **Dialogs, Sheets, & Modals**: Use `z-50` or higher (standard Radix behavior handles this). They must remain at the top of the stack. **Top-right close (X) icons are strictly forbidden on all overlays.**

