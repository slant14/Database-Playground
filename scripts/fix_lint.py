#!/usr/bin/env python3
"""
Auto-fix script for common flake8 issues.
Fixes whitespace, blank lines, and other basic formatting issues.
"""

import os
import re
import sys
from pathlib import Path


def fix_whitespace_issues(content):
    """Fix common whitespace issues."""
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        # Remove trailing whitespace (W291, W292)
        line = line.rstrip()
        
        # Fix E225: missing whitespace around operator
        # Handle assignment operators (but not in strings)
        if not (line.strip().startswith('#') or line.strip().startswith('"""') or line.strip().startswith("'''")):
            # Fix = operator (but be careful with == and !=)
            line = re.sub(r'(\w)=([^=])', r'\1 = \2', line)
            # Fix == operator
            line = re.sub(r'(\w)==([^=])', r'\1 == \2', line)
            # Fix != operator  
            line = re.sub(r'(\w)!=([^=])', r'\1 != \2', line)
            # Fix += operator
            line = re.sub(r'(\w)\+=', r'\1 += ', line)
            # Fix -= operator
            line = re.sub(r'(\w)-=', r'\1 -= ', line)
            # Fix *= operator
            line = re.sub(r'(\w)\*=', r'\1 *= ', line)
            # Fix /= operator
            line = re.sub(r'(\w)/=', r'\1 /= ', line)
        
        # Fix E252: missing whitespace around parameter equals (be more careful)
        # Only in function definitions and calls
        if 'def ' in line or '(' in line:
            # Fix default parameter values
            line = re.sub(r'(\w)=(["\'])', r'\1 = \2', line)
            line = re.sub(r'(\w)=([A-Za-z_])', r'\1 = \2', line)
            line = re.sub(r'(\w)=(\d)', r'\1 = \2', line)
            line = re.sub(r'(\w)=(\[)', r'\1 = \2', line)
            line = re.sub(r'(\w)=(\{)', r'\1 = \2', line)
            line = re.sub(r'(\w)=(\()', r'\1 = \2', line)
        
        fixed_lines.append(line)
    
    # Ensure file ends with newline (W292)
    if fixed_lines and fixed_lines[-1]:
        fixed_lines.append('')
    
    return '\n'.join(fixed_lines)


def fix_blank_lines(content):
    """Fix blank line issues."""
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Remove blank lines with whitespace (W293)
        if line.strip() == '':
            fixed_lines.append('')
        else:
            fixed_lines.append(line)
        
        i += 1
    
    # Remove excessive blank lines at end (W391)
    while len(fixed_lines) > 1 and fixed_lines[-1] == '' and fixed_lines[-2] == '':
        fixed_lines.pop()
    
    return '\n'.join(fixed_lines)


def fix_import_spacing(content):
    """Fix spacing around imports and class/function definitions."""
    lines = content.split('\n')
    fixed_lines = []

    for i, line in enumerate(lines):
        # Fix E701: multiple statements on one line (colon)
        if ': ...' in line:
            # Split class/function definition with ellipsis
            if line.strip().startswith('class ') or line.strip().startswith('def '):
                parts = line.split(': ...')
                if len(parts) == 2:
                    fixed_lines.append(parts[0] + ':')
                    # Add proper indentation for pass
                    indent = len(line) - len(line.lstrip())
                    fixed_lines.append(' ' * (indent + 4) + 'pass')
                    continue
        
        # Add blank lines before class definitions (E302)
        if (line.strip().startswith('class ') and 
            i > 0 and 
            lines[i-1].strip() != '' and
            not lines[i-1].strip().startswith('@')):
            # Check if we already have blank lines
            blank_count = 0
            j = i - 1
            while j >= 0 and lines[j].strip() == '':
                blank_count += 1
                j -= 1
            
            if blank_count < 2:
                # Add missing blank lines
                for _ in range(2 - blank_count):
                    fixed_lines.append('')
            fixed_lines.append(line)
            
        # Add blank lines before function definitions (E302)
        elif (line.strip().startswith('def ') and 
              i > 0 and 
              lines[i-1].strip() != '' and
              not lines[i-1].strip().startswith('@') and
              not line.startswith('    ')):  # Only for top-level functions
            # Check if we already have blank lines
            blank_count = 0
            j = i - 1
            while j >= 0 and lines[j].strip() == '':
                blank_count += 1
                j -= 1
            
            if blank_count < 2:
                # Add missing blank lines
                for _ in range(2 - blank_count):
                    fixed_lines.append('')
            fixed_lines.append(line)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)


def fix_file(filepath):
    """Fix a single Python file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply fixes
        content = fix_whitespace_issues(content)
        content = fix_blank_lines(content)
        content = fix_import_spacing(content)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
            return True
        else:
            print(f"No changes needed: {filepath}")
            return False
            
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False


def main():
    """Main function to fix all Python files in backend."""
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("Backend directory not found!")
        return 1
    
    # Find all Python files
    python_files = list(backend_dir.rglob("*.py"))
    
    # Exclude migration files and other auto-generated files
    excluded_patterns = [
        "migrations",
        "__pycache__",
        ".venv",
        "venv",
        ".pytest_cache"
    ]
    
    filtered_files = []
    for file_path in python_files:
        if not any(pattern in str(file_path) for pattern in excluded_patterns):
            filtered_files.append(file_path)
    
    print(f"Found {len(filtered_files)} Python files to check...")
    
    fixed_count = 0
    for file_path in filtered_files:
        if fix_file(file_path):
            fixed_count += 1
    
    print(f"\nFixed {fixed_count} out of {len(filtered_files)} files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
