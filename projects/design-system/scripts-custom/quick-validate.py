#!/usr/bin/env python3
"""
Quick Script Runner
==================

Runs a sequence of recommended validation scripts based on auto-detected changes.
This is the fastest way to validate your work after making changes.

Usage:
    python3 scripts-custom/quick-validate.py
"""

import subprocess
import sys
from pathlib import Path

def run_command(command: str, description: str) -> bool:
    """Run a command and return success status."""
    print(f"🔧 {description}")
    print(f"   Running: {command}")
    
    try:
        result = subprocess.run(command.split(), capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"   ✅ Success")
            return True
        else:
            print(f"   ❌ Failed")
            if result.stderr:
                print(f"   Error: {result.stderr.strip()}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    """Run the most critical validation scripts."""
    print("⚡ QUICK VALIDATION")
    print("=" * 30)
    print("Running the most important validation scripts...\n")
    
    scripts = [
        {
            'command': 'python3 scripts-custom/detect-plural-references.py',
            'description': 'Checking naming conventions'
        },
        {
            'command': 'python3 scripts-custom/validate-token-syntax.py', 
            'description': 'Validating token syntax'
        },
        {
            'command': 'python3 scripts-custom/validate-consumption-hierarchy.py',
            'description': 'Checking token consumption hierarchy'
        }
    ]
    
    success_count = 0
    total_count = len(scripts)
    
    for script in scripts:
        if run_command(script['command'], script['description']):
            success_count += 1
        print()
    
    # Summary
    print("📊 VALIDATION SUMMARY")
    print("=" * 30)
    print(f"✅ {success_count}/{total_count} scripts passed")
    
    if success_count == total_count:
        print("🎉 All critical validations passed!")
        sys.exit(0)
    else:
        print("⚠️  Some validations failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
