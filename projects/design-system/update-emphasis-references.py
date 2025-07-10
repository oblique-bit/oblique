#!/usr/bin/env python3
"""
Script to update references in emphasis layer files to use new inversity suffixes.
This script updates all l2 (inversity layer) references to include the .inversity-normal suffix.
"""

import json
import re
import sys

def update_inversity_references(data):
    """
    Recursively update all $value references to inversity layer tokens.
    Converts: {ob.s.color.l2.X} -> {ob.s.color.l2.X.inversity-normal}
    """
    if isinstance(data, dict):
        updated_data = {}
        for key, value in data.items():
            if key == "$value" and isinstance(value, str):
                # Pattern to match inversity layer references
                pattern = r'\{(ob\.s\.color\.l2\.[^}]+)\}'
                def add_suffix(match):
                    original_ref = match.group(1)
                    # Add .inversity-normal suffix
                    return '{' + original_ref + '.inversity-normal}'
                
                updated_value = re.sub(pattern, add_suffix, value)
                updated_data[key] = updated_value
            else:
                updated_data[key] = update_inversity_references(value)
        return updated_data
    elif isinstance(data, list):
        return [update_inversity_references(item) for item in data]
    else:
        return data

def main():
    files_to_update = [
        "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantics/colors/emphasis/high.json",
        "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantics/colors/emphasis/low.json"
    ]
    
    for file_path in files_to_update:
        print(f"Updating references in {file_path}")
        
        # Read the file
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            continue
        
        # Update references
        updated_data = update_inversity_references(data)
        
        # Write back to file
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(updated_data, f, indent=2, ensure_ascii=False)
            print(f"Successfully updated {file_path}")
        except Exception as e:
            print(f"Error writing {file_path}: {e}")

if __name__ == "__main__":
    main()
