#!/usr/bin/env python3
"""
Quick Token Syntax Validation

This script performs fast validation of token reference syntax:
- Checks for plural forms in token references (colors → color)
- Validates inversity suffix requirements for color tokens
- Identifies common syntax issues after refactoring

USAGE:
    python3 scripts-custom/validate-token-syntax.py

Run from project root for quick validation after changes.
"""

import json
import os
import re
from collections import defaultdict
from pathlib import Path

def load_all_tokens():
    """Load all tokens from JSON files."""
    tokens = {}
    themes_dir = Path('src/lib/themes')
    
    for json_file in themes_dir.rglob('*.json'):
        if json_file.name.startswith('$') or '_ignore-in-ds' in str(json_file):
            continue
            
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                tokens[str(json_file)] = data
        except json.JSONDecodeError as e:
            print(f"JSON error in {json_file}: {e}")
        except Exception as e:
            print(f"Error loading {json_file}: {e}")
    
    return tokens

def extract_references(obj, path=""):
    """Extract all token references from a JSON object."""
    references = []
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            current_path = f"{path}.{key}" if path else key
            if key == "$value" and isinstance(value, str) and value.startswith("{") and value.endswith("}"):
                # Extract the reference
                ref = value[1:-1]  # Remove { and }
                references.append((current_path, ref))
            elif isinstance(value, (dict, list)):
                references.extend(extract_references(value, current_path))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            current_path = f"{path}[{i}]"
            references.extend(extract_references(item, current_path))
    
    return references

def check_references():
    """Check all token references for validity."""
    tokens = load_all_tokens()
    all_references = []
    
    # Extract all references
    for file_path, data in tokens.items():
        refs = extract_references(data)
        for path, ref in refs:
            all_references.append((file_path, path, ref))
    
    print(f"Found {len(all_references)} token references")
    
    # Check for common issues
    issues = []
    
    for file_path, path, ref in all_references:
        # Check for plural forms in references
        if re.search(r'\b(colors|components|semantics|primitives)\b', ref):
            issues.append(f"Plural reference in {file_path} at {path}: {ref}")
        
        # Check for missing inversity suffixes in color references
        if 'ob.s.color' in ref and not ref.endswith(('.inversity-normal', '.inversity-flipped', '.inversity-flipped-alpha')):
            # Check if it's a theme reference or needs inversity suffix
            if not any(x in ref for x in ['theme-configuration', 'static', 'brand']):
                issues.append(f"Missing inversity suffix in {file_path} at {path}: {ref}")
    
    if issues:
        print(f"\nFound {len(issues)} potential issues:")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\nNo major issues found!")
    
    return len(issues) == 0

if __name__ == "__main__":
    check_references()
