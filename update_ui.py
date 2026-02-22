import sys
import re

# 1. Update Input.tsx
with open('src/components/ui/Input.tsx', 'r') as f:
    input_content = f.read()

# Make it h-12 instead of h-9
input_content = re.sub(r'flex h-9 ', r'flex h-12 ', input_content)
with open('src/components/ui/Input.tsx', 'w') as f:
    f.write(input_content)

# 2. Update Select.tsx
with open('src/components/ui/Select.tsx', 'r') as f:
    select_content = f.read()

# Make it h-12 instead of h-9
select_content = re.sub(r'flex h-9 ', r'flex h-12 ', select_content)
with open('src/components/ui/Select.tsx', 'w') as f:
    f.write(select_content)

# 3. Clean pre-question/page.tsx
with open('src/app/dashboard/pre-question/page.tsx', 'r') as f:
    page_content = f.read()

# Remove inline grey backgrounds and heights for Inputs
page_content = re.sub(r'\s*bg-gray-50/50\s*', ' ', page_content)
page_content = re.sub(r'\s*bg-gray-50\s*', ' ', page_content)
# some are bg-gray-50/40 or bg-gray-50/80 but let's keep them if they are containers.
# Actually, wait, let's only target the Input and Select classNames explicitly.

with open('src/app/dashboard/pre-question/page.tsx', 'w') as f:
    f.write(page_content)

print("Done updating Input.tsx and Select.tsx")
