#!/usr/bin/env python3
"""
L1/L2 Token Redundancy Validator
===============================

Validates the assumption that L2 tokens are just direct references to L1 tokens
without any transformation, creating redundancy that could be simplified.

Usage:
    python3 scripts-custom/validate-l1-l2-redundancy.py
"""

import json
import os
from pathlib import Path

def load_json_file(file_path):
    """Load and parse a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading {file_path}: {e}")
        return None

def extract_token_references(data, path=""):
    """Extract all token references from nested JSON structure."""
    references = {}
    
    if isinstance(data, dict):
        if '$value' in data:
            # This is a token with a value
            references[path] = data['$value']
        else:
            # Recurse into nested structure
            for key, value in data.items():
                if not key.startswith('$'):  # Skip metadata keys
                    new_path = f"{path}.{key}" if path else key
                    nested_refs = extract_token_references(value, new_path)
                    references.update(nested_refs)
    
    return references

def analyze_l1_l2_relationship():
    """Analyze the relationship between L1 and L2 tokens."""
    project_root = Path(__file__).parent.parent
    
    # Find L1 and L2 files
    l1_file = project_root / "src/lib/themes/semantic/color/l1-lightness/light.json"
    l2_file = project_root / "src/lib/themes/semantic/color/l2-inversity/normal.json"
    
    if not l1_file.exists():
        print(f"❌ L1 file not found: {l1_file}")
        return False
    
    if not l2_file.exists():
        print(f"❌ L2 file not found: {l2_file}")
        return False
    
    print("📄 Analyzing L1/L2 token relationship...")
    print(f"📁 L1 file: {l1_file.name}")
    print(f"📁 L2 file: {l2_file.name}")
    print("-" * 60)
    
    # Load both files
    l1_data = load_json_file(l1_file)
    l2_data = load_json_file(l2_file)
    
    if not l1_data or not l2_data:
        return False
    
    # Extract token references
    l1_tokens = extract_token_references(l1_data.get('ob', {}).get('s', {}).get('color', {}).get('l1', {}), "l1")
    l2_tokens = extract_token_references(l2_data.get('ob', {}).get('s', {}).get('color', {}).get('l2', {}), "l2")
    
    print(f"🔍 Found {len(l1_tokens)} L1 tokens")
    print(f"🔍 Found {len(l2_tokens)} L2 tokens")
    print()
    
    # Analyze L2 token references
    redundant_count = 0
    non_redundant_count = 0
    direct_references = []
    transformed_references = []
    
    for l2_path, l2_value in l2_tokens.items():
        if isinstance(l2_value, str) and l2_value.startswith("{ob.s.color.l1"):
            # This L2 token references an L1 token
            redundant_count += 1
            
            # Extract the referenced L1 path
            l1_ref = l2_value.strip('{}')
            l1_path_parts = l1_ref.split('.')
            if len(l1_path_parts) >= 4:
                # Convert to our internal path format
                l1_internal_path = '.'.join(l1_path_parts[3:])  # Remove 'ob.s.color.l1'
                l2_internal_path = '.'.join(l2_path.split('.')[1:])  # Remove 'l2'
                
                if l1_internal_path == l2_internal_path:
                    direct_references.append((l2_path, l2_value))
                else:
                    transformed_references.append((l2_path, l2_value, l1_internal_path, l2_internal_path))
        else:
            non_redundant_count += 1
    
    # Report findings
    total_l2_tokens = len(l2_tokens)
    redundancy_percentage = (redundant_count / total_l2_tokens) * 100 if total_l2_tokens > 0 else 0
    
    print("📊 ANALYSIS RESULTS:")
    print(f"   Total L2 tokens: {total_l2_tokens}")
    print(f"   Redundant (reference L1): {redundant_count} ({redundancy_percentage:.1f}%)")
    print(f"   Non-redundant: {non_redundant_count}")
    print()
    
    print("🔗 REFERENCE TYPES:")
    print(f"   Direct references (same path): {len(direct_references)}")
    print(f"   Transformed references: {len(transformed_references)}")
    print()
    
    # Show examples
    if direct_references:
        print("✅ DIRECT REFERENCE EXAMPLES (L2 = L1):")
        for i, (l2_path, l2_value) in enumerate(direct_references[:5]):
            print(f"   {i+1}. {l2_path} → {l2_value}")
        if len(direct_references) > 5:
            print(f"   ... and {len(direct_references) - 5} more")
        print()
    
    if transformed_references:
        print("🔄 TRANSFORMED REFERENCE EXAMPLES:")
        for i, (l2_path, l2_value, l1_internal, l2_internal) in enumerate(transformed_references[:3]):
            print(f"   {i+1}. {l2_path}")
            print(f"      L2 path: {l2_internal}")
            print(f"      L1 path: {l1_internal}")
            print(f"      Reference: {l2_value}")
        if len(transformed_references) > 3:
            print(f"   ... and {len(transformed_references) - 3} more")
        print()
    
    # Conclusion
    print("🎯 CONCLUSION:")
    if redundancy_percentage > 90:
        print("   ✅ ASSUMPTION CONFIRMED: L2 is almost entirely redundant with L1")
        print("   💡 RECOMMENDATION: Create build script to generate L2 from L1")
        print("   📉 IMPACT: Could reduce CSS variable count significantly")
    elif redundancy_percentage > 70:
        print("   ⚠️  ASSUMPTION PARTIALLY CONFIRMED: High redundancy detected")
        print("   💡 RECOMMENDATION: Consider partial optimization")
    else:
        print("   ❌ ASSUMPTION NOT CONFIRMED: L2 has significant unique content")
        print("   💡 RECOMMENDATION: Keep current structure")
    
    print()
    print("🛠️  POTENTIAL BUILD SCRIPT BENEFITS:")
    print(f"   - Reduce CSS variables by ~{redundant_count} tokens")
    print(f"   - Simplify maintenance (single source of truth)")
    print(f"   - Automatic consistency between L1/L2")
    print(f"   - Smaller bundle size")
    
    return redundancy_percentage > 90

def main():
    """Main function."""
    print("🔍 L1/L2 Token Redundancy Analysis")
    print("=" * 50)
    
    is_redundant = analyze_l1_l2_relationship()
    
    if is_redundant:
        print("\n💡 NEXT STEPS:")
        print("   1. Create build script to generate L2 from L1")
        print("   2. Update build process to include token transformation")
        print("   3. Test CSS output matches current behavior")
        print("   4. Update documentation about simplified workflow")

if __name__ == '__main__':
    main()
