#!/usr/bin/env python3
"""
scaffold_component.py — Generate a new React component following AutoX LOS conventions.

Usage:
    python tools/scaffold_component.py <ComponentName> <directory>

Arguments:
    ComponentName   PascalCase name (e.g. LoanSummaryCard)
    directory       Target folder inside src/components/ (e.g. application, dashboard, ui, calculator)

Output:
    Creates src/components/<directory>/<ComponentName>.tsx
"""

import sys
import os
import textwrap

VALID_DIRS = ["application", "applications", "calculator", "dashboard", "layout", "ui"]

def to_kebab(name: str) -> str:
    """Convert PascalCase to kebab-case."""
    import re
    s = re.sub(r'(?<=[a-z0-9])([A-Z])', r'-\1', name)
    return s.lower()

def generate_component(name: str, directory: str) -> str:
    """Return the component file content."""
    return textwrap.dedent(f'''\
        "use client";

        // ──────────────────────────────────────────
        // {name}
        // คำอธิบาย: [ใส่คำอธิบายของ component ที่นี่]
        // ──────────────────────────────────────────

        import {{ cn }} from "@/lib/utils";

        interface {name}Props {{
            className?: string;
        }}

        export function {name}({{ className }}: {name}Props) {{
            return (
                <div className={{cn("", className)}}>
                    {{/* TODO: implement {name} */}}
                </div>
            );
        }}
    ''')


def main():
    if len(sys.argv) < 3:
        print("Usage: python tools/scaffold_component.py <ComponentName> <directory>")
        print(f"Valid directories: {', '.join(VALID_DIRS)}")
        sys.exit(1)

    name = sys.argv[1]
    directory = sys.argv[2]

    # Validate component name is PascalCase
    if not name[0].isupper() or " " in name:
        print(f"Error: Component name '{name}' must be PascalCase (e.g. LoanSummaryCard)")
        sys.exit(1)

    if directory not in VALID_DIRS:
        print(f"Warning: '{directory}' is not a standard directory. Standard: {', '.join(VALID_DIRS)}")
        response = input("Continue anyway? (y/n): ").strip().lower()
        if response != "y":
            sys.exit(0)

    # Resolve paths relative to project root (one level up from tools/)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(project_root, "src", "components", directory)
    target_file = os.path.join(target_dir, f"{name}.tsx")

    if os.path.exists(target_file):
        print(f"Error: File already exists: {target_file}")
        sys.exit(1)

    os.makedirs(target_dir, exist_ok=True)

    content = generate_component(name, directory)
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(content)

    rel_path = os.path.relpath(target_file, project_root)
    print(f"✅ Created: {rel_path}")
    print(f"   Component: <{name} />")
    print(f"   Import: import {{ {name} }} from \"@/components/{directory}/{name}\";")


if __name__ == "__main__":
    main()
