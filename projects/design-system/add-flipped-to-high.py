#!/usr/bin/env python3
"""
Add .inversity-flipped counterparts to L3 emphasis high.json
These will reference {ob.s.color.l2.*.inversity-flipped} tokens
"""

import json

def add_inversity_flipped_to_high():
    file_path = "src/lib/themes/semantics/colors/emphasis/high.json"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    def add_flipped_counterparts(obj):
        if isinstance(obj, dict):
            new_items = {}
            for key, value in obj.items():
                if key == "inversity-normal" and isinstance(value, dict) and "$value" in value:
                    # This is a token definition, add the inversity-flipped counterpart
                    flipped_token = value.copy()
                    # Change the reference from .inversity-normal to .inversity-flipped
                    if "$value" in flipped_token and ".inversity-normal}" in flipped_token["$value"]:
                        flipped_token["$value"] = flipped_token["$value"].replace(".inversity-normal}", ".inversity-flipped}")
                    new_items["inversity-flipped"] = flipped_token
                else:
                    add_flipped_counterparts(value)
            
            # Add the new items to the current level
            obj.update(new_items)
    
    # Process the entire structure
    add_flipped_counterparts(data)
    
    # Write back to file with proper formatting
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Successfully added .inversity-flipped counterparts to high.json")
    return True

if __name__ == "__main__":
    success = add_inversity_flipped_to_high()
    if success:
        print("\n🔄 Addition complete!")
        print("📁 high.json now has both .inversity-normal and .inversity-flipped variants")
        print("🔗 .inversity-normal tokens reference L2 normal tokens")
        print("🔗 .inversity-flipped tokens reference L2 flipped tokens")
    else:
        print("\n❌ Addition failed!")
