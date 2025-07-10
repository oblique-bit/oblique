#!/usr/bin/env python3
"""
Add .inversity-normal counterparts to flipped.json
These will reference {ob.s.color.l1.*.inversity-normal} tokens
"""

import json
import re

def add_inversity_normal_to_flipped():
    file_path = "src/lib/themes/semantics/colors/inversity/flipped.json"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    def add_normal_counterparts(obj, path=""):
        if isinstance(obj, dict):
            new_items = {}
            for key, value in obj.items():
                if key == "inversity-flipped" and isinstance(value, dict) and "$value" in value:
                    # This is a token definition, add the inversity-normal counterpart
                    normal_token = value.copy()
                    # Change the reference from .inversity-flipped to .inversity-normal
                    if "$value" in normal_token:
                        normal_token["$value"] = normal_token["$value"].replace(".inversity-flipped", ".inversity-normal")
                    new_items["inversity-normal"] = normal_token
                else:
                    add_normal_counterparts(value, f"{path}.{key}" if path else key)
            
            # Add the new items to the current level
            obj.update(new_items)
    
    # Process the entire structure
    add_normal_counterparts(data)
    
    # Write back to file with proper formatting
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Successfully added .inversity-normal counterparts to flipped.json")
    return True

if __name__ == "__main__":
    success = add_inversity_normal_to_flipped()
    if success:
        print("\n🔄 Addition complete!")
        print("📁 flipped.json now has both .inversity-flipped and .inversity-normal variants")
        print("🔗 .inversity-normal tokens reference L1 normal tokens")
        print("🔗 .inversity-flipped tokens reference L1 flipped tokens")
    else:
        print("\n❌ Addition failed!")
