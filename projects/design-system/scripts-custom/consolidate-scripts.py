#!/usr/bin/env python3
"""
Script Consolidation and Renaming Utility

This script implements a consolidated naming scheme for all scripts-custom/ scripts
to make them more consistent while preserving necessary distinctions.

NAMING PATTERNS:
1. analyze-* : Deep analysis and structural examination
2. detect-*  : Find specific issues or patterns  
3. validate-* : Validation and compliance checking
4. extract-* : Extract information for documentation
5. cleanup-* : Maintenance and cleanup operations
6. track-*   : Monitoring and change tracking
7. generate-* : Content generation

AUTHORS: Design System Team
VERSION: 1.0.0
LAST UPDATED: July 15, 2025
"""

import os
import shutil
from pathlib import Path

class ScriptConsolidator:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.scripts_dir = self.project_root / "scripts-custom"
        
        # Define renaming map: old_name -> new_name
        self.rename_map = {
            # Analysis group - keep analyze-* pattern
            "inspect-token-structure.js": "analyze-token-structure.js",
            
            # Detection group - consolidate to detect-* pattern  
            "find-plural-references.py": "detect-plural-references.py",
            
            # Validation group - already consistent with validate-* pattern
            # No changes needed for validate-* scripts
            
            # Extraction group - already consistent with extract-* pattern
            # No changes needed for extract-* scripts
            
            # Cleanup group - consolidate maintenance scripts
            "remove-empty-files.sh": "cleanup-empty-files.sh",
            "remove-obsolete-files.js": "cleanup-obsolete-files.js",
            "check-protected-files.sh": "validate-protected-files.sh",  # Move to validate group
            "enforce-documentation-structure.sh": "validate-documentation-structure.sh",  # Move to validate group
            
            # Generation group - already consistent
            # No changes needed for generate-* scripts
            
            # Tracking group - already consistent  
            # No changes needed for track-* scripts
            
            # Quick validation - make naming more consistent
            "quick-validate-token-syntax.py": "validate-token-syntax.py",
            
            # Word generation - consolidate similar scripts
            "markdown_to_word.py": "generate-word-from-markdown.py"
        }
        
        # Define which scripts are one-time/cleanup and could be marked
        self.one_time_scripts = {
            "cleanup-empty-files.sh",
            "cleanup-obsolete-files.js", 
            "extract-compound-units.js"  # This extracts info for docs, typically one-time
        }
    
    def check_script_purposes(self):
        """Analyze scripts to identify one-time vs recurring use."""
        print("📋 Script Analysis:")
        print("=" * 50)
        
        analysis = {
            "recurring": [],
            "one_time": [],
            "placeholders": []
        }
        
        for script_file in self.scripts_dir.glob("*.py"):
            if script_file.stat().st_size == 0:
                analysis["placeholders"].append(script_file.name)
            elif script_file.name in self.one_time_scripts:
                analysis["one_time"].append(script_file.name)
            else:
                analysis["recurring"].append(script_file.name)
                
        for script_file in self.scripts_dir.glob("*.js"):
            if script_file.stat().st_size == 0:
                analysis["placeholders"].append(script_file.name)
            elif script_file.name in self.one_time_scripts:
                analysis["one_time"].append(script_file.name)
            else:
                analysis["recurring"].append(script_file.name)
                
        for script_file in self.scripts_dir.glob("*.sh"):
            if script_file.stat().st_size == 0:
                analysis["placeholders"].append(script_file.name)
            elif script_file.name in self.one_time_scripts:
                analysis["one_time"].append(script_file.name)
            else:
                analysis["recurring"].append(script_file.name)
        
        print(f"🔄 Recurring Scripts ({len(analysis['recurring'])}):")
        for script in sorted(analysis["recurring"]):
            print(f"   - {script}")
            
        print(f"\n⚡ One-time/Cleanup Scripts ({len(analysis['one_time'])}):")
        for script in sorted(analysis["one_time"]):
            print(f"   - {script}")
            
        if analysis["placeholders"]:
            print(f"\n⚠️  Empty Placeholder Scripts ({len(analysis['placeholders'])}):")
            for script in sorted(analysis["placeholders"]):
                print(f"   - {script}")
        
        return analysis
    
    def rename_scripts(self, dry_run=True):
        """Rename scripts according to the consolidation plan."""
        if dry_run:
            print("\n🎯 Planned Renames (DRY RUN):")
            print("=" * 50)
        else:
            print("\n🔄 Executing Renames:")
            print("=" * 50)
        
        successful_renames = []
        
        for old_name, new_name in self.rename_map.items():
            old_path = self.scripts_dir / old_name
            new_path = self.scripts_dir / new_name
            
            if old_path.exists():
                if dry_run:
                    print(f"   {old_name} → {new_name}")
                else:
                    try:
                        shutil.move(str(old_path), str(new_path))
                        successful_renames.append((old_name, new_name))
                        print(f"✅ {old_name} → {new_name}")
                    except Exception as e:
                        print(f"❌ Failed to rename {old_name}: {e}")
            else:
                print(f"⚠️  File not found: {old_name}")
        
        return successful_renames
    
    def show_final_structure(self):
        """Show the final organized structure."""
        print("\n📂 Final Script Organization:")
        print("=" * 50)
        
        categories = {
            "analyze": [],
            "detect": [],
            "validate": [],
            "extract": [],
            "cleanup": [],
            "generate": [],
            "track": [],
            "setup": [],
            "other": []
        }
        
        # Categorize all current scripts
        for script_file in self.scripts_dir.glob("*"):
            if script_file.is_file() and script_file.suffix in {'.py', '.js', '.sh'}:
                name = script_file.name
                categorized = False
                
                for category in categories.keys():
                    if name.startswith(f"{category}-"):
                        categories[category].append(name)
                        categorized = True
                        break
                
                if not categorized:
                    categories["other"].append(name)
        
        for category, scripts in categories.items():
            if scripts:
                print(f"\n🔧 {category.upper()} ({len(scripts)}):")
                for script in sorted(scripts):
                    print(f"   - {script}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Consolidate and rename scripts')
    parser.add_argument('--analyze', action='store_true', help='Analyze current scripts')
    parser.add_argument('--rename', action='store_true', help='Execute the renames')
    parser.add_argument('--dry-run', action='store_true', help='Show planned renames without executing')
    parser.add_argument('--project-root', default='.', help='Project root directory')
    
    args = parser.parse_args()
    
    consolidator = ScriptConsolidator(args.project_root)
    
    if args.analyze or not any([args.rename, args.dry_run]):
        consolidator.check_script_purposes()
    
    if args.dry_run or args.rename:
        consolidator.rename_scripts(dry_run=not args.rename)
    
    consolidator.show_final_structure()

if __name__ == "__main__":
    main()
