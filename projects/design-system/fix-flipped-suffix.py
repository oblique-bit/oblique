#!/usr/bin/env python3
"""
Script to fix flipped.json by replacing .inversity-flipped with .inversity-normal
Both in the token structure and in the $value references.
"""

import json
import re

def fix_flipped_json():
    file_path = "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantics/colors/inversity/flipped.json"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace all occurrences of "inversity-flipped" with "inversity-normal"
    # This will fix both the token names and the $value references
    content = content.replace('"inversity-flipped"', '"inversity-normal"')
    content = content.replace('.inversity-flipped}', '.inversity-normal}')
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully updated flipped.json - replaced all .inversity-flipped with .inversity-normal")

if __name__ == "__main__":
    fix_flipped_json()
