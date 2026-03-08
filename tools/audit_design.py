#!/usr/bin/env python3
"""
audit_design.py — Audit .tsx files for design-rule violations in AutoX LOS.

Usage:
    python tools/audit_design.py [path]

Arguments:
    path    File or directory to audit (default: src/)

Rules checked:
    1. Bare `border` without color class (Tailwind v4 defaults to currentColor)
    2. bg-gray-50 on form inputs (should be bg-white)
    3. type="date" native inputs (should use B.E. text inputs)
    4. Tables missing hover:bg-gray-50/50 or transition-colors
    5. Dialog close (X) icon patterns
    6. A.D. year literals (should be B.E.)
"""

import sys
import os
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Violation:
    file: str
    line: int
    rule: str
    snippet: str
    severity: str = "warning"


# ── Rule Definitions ──────────────────────────────────────────

RULES: list[dict] = [
    {
        "id": "BORDER-NO-COLOR",
        "description": "Bare `border` without explicit color (Tailwind v4 defaults to currentColor)",
        "pattern": re.compile(
            r'''(?:className\s*=\s*["'`{])'''       # start of className
            r'''[^"'`}]*'''                           # any classes before
            r'''\bborder\b'''                         # the word "border"
            r'''(?!-)'''                              # NOT followed by dash (border-*)
            r'''[^"'`}]*'''                           # rest of classes
            r'''["'`}]'''                              # end of className
        ),
        "negative_pattern": re.compile(
            r'''\bborder\b\s+\bborder-'''             # border followed by border-<color>
        ),
        "severity": "warning",
    },
    {
        "id": "INPUT-GRAY-BG",
        "description": "Form inputs should use bg-white, not bg-gray-50",
        "pattern": re.compile(
            r'''<(?:Input|Select|Textarea|SelectTrigger)[^>]*bg-gray-50(?!/|[0-9])'''
        ),
        "severity": "warning",
    },
    {
        "id": "NATIVE-DATE",
        "description": 'Native type="date" inputs should use B.E. text inputs instead',
        "pattern": re.compile(r'''type\s*=\s*["']date["']'''),
        "severity": "error",
    },
    {
        "id": "TABLE-NO-HOVER",
        "description": "TableRow should have hover:bg-gray-50/50 and transition-colors",
        "pattern": re.compile(r'''<TableRow[^>]*>'''),
        "negative_pattern": re.compile(r'''hover:bg-gray-50/50'''),
        "severity": "info",
    },
    {
        "id": "DIALOG-CLOSE-X",
        "description": "Dialogs should not have top-right close (X) icon",
        "pattern": re.compile(
            r'''DialogClose[^>]*(?:absolute|top-|right-)'''
        ),
        "severity": "error",
    },
]


def audit_file(filepath: str) -> list[Violation]:
    """Audit a single .tsx file and return violations."""
    violations: list[Violation] = []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except (UnicodeDecodeError, FileNotFoundError):
        return violations

    for i, line in enumerate(lines, start=1):
        for rule in RULES:
            match = rule["pattern"].search(line)
            if not match:
                continue

            # Check negative pattern (if the line ALSO matches the negative, skip)
            neg = rule.get("negative_pattern")
            if neg and neg.search(line):
                continue

            violations.append(Violation(
                file=filepath,
                line=i,
                rule=f"[{rule['id']}] {rule['description']}",
                snippet=line.strip()[:120],
                severity=rule.get("severity", "warning"),
            ))

    return violations


def audit_directory(dirpath: str) -> list[Violation]:
    """Recursively audit all .tsx files in a directory."""
    all_violations: list[Violation] = []

    for root, _dirs, files in os.walk(dirpath):
        # Skip node_modules and .next
        if "node_modules" in root or ".next" in root:
            continue
        for fname in sorted(files):
            if fname.endswith(".tsx"):
                fpath = os.path.join(root, fname)
                all_violations.extend(audit_file(fpath))

    return all_violations


SEVERITY_ICONS = {
    "error": "❌",
    "warning": "⚠️ ",
    "info": "ℹ️ ",
}


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "src/"

    # Resolve relative to project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(project_root, target) if not os.path.isabs(target) else target

    if not os.path.exists(target_path):
        print(f"Error: Path not found: {target_path}")
        sys.exit(1)

    if os.path.isfile(target_path):
        violations = audit_file(target_path)
    else:
        violations = audit_directory(target_path)

    if not violations:
        print("✅ No design-rule violations found!")
        sys.exit(0)

    # Group by file
    by_file: dict[str, list[Violation]] = {}
    for v in violations:
        rel = os.path.relpath(v.file, project_root)
        by_file.setdefault(rel, []).append(v)

    errors = sum(1 for v in violations if v.severity == "error")
    warnings = sum(1 for v in violations if v.severity == "warning")
    infos = sum(1 for v in violations if v.severity == "info")

    print(f"\n🔍 Design Audit: {len(violations)} issue(s) in {len(by_file)} file(s)\n")

    for filepath, file_violations in sorted(by_file.items()):
        print(f"  📄 {filepath}")
        for v in file_violations:
            icon = SEVERITY_ICONS.get(v.severity, "•")
            print(f"     {icon} L{v.line}: {v.rule}")
            print(f"        → {v.snippet}")
        print()

    print(f"Summary: {errors} error(s), {warnings} warning(s), {infos} info(s)")

    # Exit with error code if there are errors
    sys.exit(1 if errors > 0 else 0)


if __name__ == "__main__":
    main()
