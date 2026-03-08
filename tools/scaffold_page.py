#!/usr/bin/env python3
"""
scaffold_page.py — Generate a new Next.js dashboard page following AutoX LOS conventions.

Usage:
    python tools/scaffold_page.py <page-name> <"Page Title in Thai">

Arguments:
    page-name       kebab-case route name (e.g. loan-tracking)
    Page Title      Thai title for the page heading (e.g. "ติดตามสินเชื่อ")

Output:
    Creates src/app/dashboard/<page-name>/page.tsx
"""

import sys
import os
import textwrap


def generate_page(page_name: str, title: str) -> str:
    """Return the page file content."""
    # Convert kebab-case to PascalCase for component name
    component_name = "".join(word.capitalize() for word in page_name.split("-")) + "Page"

    return textwrap.dedent(f'''\
        "use client";

        // ──────────────────────────────────────────
        // {component_name}
        // Route: /dashboard/{page_name}
        // ──────────────────────────────────────────

        import {{ useEffect }} from "react";
        import {{ useSidebar }} from "@/components/layout/SidebarContext";

        export default function {component_name}() {{
            const {{ setBreadcrumbs }} = useSidebar();

            useEffect(() => {{
                setBreadcrumbs([
                    {{ label: "แดชบอร์ด", href: "/dashboard" }},
                    {{ label: "{title}" }},
                ]);
                return () => setBreadcrumbs([]);
            }}, [setBreadcrumbs]);

            return (
                <div className="h-full flex flex-col">
                    {{/* Page Header */}}
                    <div className="p-6 pb-0">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-[13px] text-muted mt-1">
                            {{/* TODO: Add page description */}}
                        </p>
                    </div>

                    {{/* Page Content */}}
                    <div className="flex-1 p-6">
                        {{/* TODO: implement page content */}}
                    </div>
                </div>
            );
        }}
    ''')


def main():
    if len(sys.argv) < 3:
        print('Usage: python tools/scaffold_page.py <page-name> <"Thai Title">')
        print('Example: python tools/scaffold_page.py loan-tracking "ติดตามสินเชื่อ"')
        sys.exit(1)

    page_name = sys.argv[1]
    title = sys.argv[2]

    # Validate kebab-case
    if not all(c.isalnum() or c == "-" for c in page_name) or page_name[0] == "-":
        print(f"Error: Page name '{page_name}' must be kebab-case (e.g. loan-tracking)")
        sys.exit(1)

    # Resolve paths relative to project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(project_root, "src", "app", "dashboard", page_name)
    target_file = os.path.join(target_dir, "page.tsx")

    if os.path.exists(target_file):
        print(f"Error: Page already exists: {target_file}")
        sys.exit(1)

    os.makedirs(target_dir, exist_ok=True)

    content = generate_page(page_name, title)
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(content)

    rel_path = os.path.relpath(target_file, project_root)
    print(f"✅ Created: {rel_path}")
    print(f"   Route:  /dashboard/{page_name}")
    print(f"   Title:  {title}")
    print(f"\n📝 Don't forget to add a sidebar link in src/components/layout/Sidebar.tsx")


if __name__ == "__main__":
    main()
