#!/usr/bin/env python3
"""
Transform L3 emphasis low.json:
1. Add .inversity-normal suffix to all tokens
2. Update all references to use .inversity-normal
"""

import json
import re

def transform_low_json():
    file_path = "src/lib/themes/semantics/colors/emphasis/low.json"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    def add_inversity_normal_suffix(obj, path=""):
        if isinstance(obj, dict):
            new_obj = {}
            for key, value in obj.items():
                if isinstance(value, dict):
                    if "$value" in value and "$type" in value:
                        # This is a token definition - wrap it with inversity-normal
                        new_obj[key] = {
                            "inversity-normal": value
                        }
                    else:
                        # This is a container - recurse
                        new_obj[key] = add_inversity_normal_suffix(value, f"{path}.{key}" if path else key)
                else:
                    new_obj[key] = value
            return new_obj
        else:
            return obj
    
    # Transform the structure
    transformed_data = add_inversity_normal_suffix(data)
    
    # Update all references in $value to include .inversity-normal
    def update_references(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "$value" and isinstance(value, str) and value.startswith("{ob.s.color.l2."):
                    # Update reference to include .inversity-normal
                    if not value.endswith(".inversity-normal}"):
                        # Insert .inversity-normal before the closing brace
                        obj[key] = value[:-1] + ".inversity-normal}"
                elif isinstance(value, dict):
                    update_references(value)
    
    update_references(transformed_data)
    
    # Write back to file with proper formatting
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(transformed_data, f, indent=2, ensure_ascii=False)
    
    print("✅ Successfully transformed low.json")
    return True

if __name__ == "__main__":
    success = transform_low_json()
    if success:
        print("\n🔄 Transformation complete!")
        print("📁 low.json tokens now have .inversity-normal suffix")
        print("🔗 All L2 references updated to use .inversity-normal")
    else:
        print("\n❌ Transformation failed!")
