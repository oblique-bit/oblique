#!/usr/bin/env python3
"""
Update all component references to L3 tokens to use .inversity-normal suffix
"""

import os
import json
import re

def find_all_json_files(root_dir):
    """Find all JSON files in the directory tree"""
    json_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.json'):
                json_files.append(os.path.join(root, file))
    return json_files

def update_l3_references_in_file(file_path):
    """Update L3 token references in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file contains L3 references
        if 'ob.s.color.l3.interaction.state' not in content:
            return False
        
        print(f"📁 Updating: {file_path}")
        
        # Replace L3 references to add .inversity-normal suffix
        # Pattern: {ob.s.color.l3.interaction.state.{property}.{state}} -> {ob.s.color.l3.interaction.state.{property}.{state}.inversity-normal}
        pattern = r'\{ob\.s\.color\.l3\.interaction\.state\.(fg|bg)\.(enabled|hover|focus|pressed|selected|visited|disabled)\}'
        replacement = r'{ob.s.color.l3.interaction.state.\1.\2.inversity-normal}'
        
        updated_content = re.sub(pattern, replacement, content)
        
        if updated_content != content:
            # Validate JSON syntax
            try:
                json.loads(updated_content)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"✅ Updated: {file_path}")
                return True
            except json.JSONDecodeError as e:
                print(f"❌ JSON syntax error in {file_path}: {e}")
                return False
        else:
            print(f"ℹ️  No changes needed: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to update all component references"""
    root_dir = "src/lib/themes"
    
    # Find all JSON files
    json_files = find_all_json_files(root_dir)
    
    # Filter out the emphasis layer files themselves
    component_files = [f for f in json_files if not f.endswith(('high.json', 'low.json')) or 'emphasis' not in f]
    
    print(f"🔍 Found {len(component_files)} component files to check")
    print(f"🎯 Looking for L3 token references to update...")
    
    updated_files = []
    
    for file_path in component_files:
        if update_l3_references_in_file(file_path):
            updated_files.append(file_path)
    
    print(f"\n✅ Successfully updated {len(updated_files)} files:")
    for file_path in updated_files:
        print(f"   - {file_path}")
    
    if len(updated_files) == 0:
        print("\nℹ️  No files needed updates")
    
    return len(updated_files) > 0

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🔄 Component reference updates complete!")
        print("📁 All L3 token references now use .inversity-normal suffix")
        print("🎯 Ready for manual .inversity-flipped assignments at component level")
    else:
        print("\n📝 No component references needed updating")
