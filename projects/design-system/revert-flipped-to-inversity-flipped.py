#!/usr/bin/env python3
"""
Revert flipped.json to use .inversity-flipped suffixes instead of .inversity-normal
This restores the proper distinction between normal and flipped inversity layers.
"""

import json
import re

def revert_flipped_json():
    file_path = "src/lib/themes/semantics/colors/inversity/flipped.json"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace all .inversity-normal with .inversity-flipped in the entire file
    # This affects both the token names and the references
    updated_content = content.replace('.inversity-normal', '.inversity-flipped')
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    # Validate JSON syntax
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print("✅ Successfully reverted flipped.json to use .inversity-flipped")
        print("✅ JSON syntax is valid")
    except json.JSONDecodeError as e:
        print(f"❌ JSON syntax error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = revert_flipped_json()
    if success:
        print("\n🔄 Reversion complete!")
        print("📁 flipped.json now uses .inversity-flipped suffixes")
        print("🔗 All references point to .inversity-flipped tokens in l1")
    else:
        print("\n❌ Reversion failed!")
