#!/usr/bin/env python3
"""
Project Cleanup and Organization Script

This script maintains project organization by:
- Ensuring all custom scripts are in scripts-custom/ folder
- Moving misplaced scripts to correct locations
- Cleaning up empty directories
- Validating folder structure compliance

USAGE:
    python3 scripts-custom/cleanup-scripts.py [options]
    
OPTIONS:
    --check     Check for misplaced scripts (no changes)
    --fix       Fix misplaced scripts by moving them
    --private   Also check private scripts folder
    --verbose   Show detailed output
    
RULES:
- All custom scripts go in scripts-custom/
- Private scripts go in separate private folder (only when explicitly specified)
- Configuration files stay with their scripts
- Reports go in documentation/reports/
- No scripts in documentation/ folders except configs

AUTHORS: Design System Team
VERSION: 1.0.0
LAST UPDATED: July 15, 2025
"""

import os
import sys
import shutil
import argparse
from pathlib import Path
from typing import List, Dict, Tuple, Set

class ScriptCleanup:
    def __init__(self, project_root: str, include_private: bool = False, verbose: bool = False):
        self.project_root = Path(project_root)
        self.include_private = include_private
        self.verbose = verbose
        
        # Define proper locations
        self.scripts_custom = self.project_root / "scripts-custom"
        self.private_scripts = self.project_root / "_private" / "scripts-custom"
        
        # Script extensions to look for
        self.script_extensions = {'.py', '.js', '.sh', '.bash', '.zsh'}
        
        # Exclude Angular/framework files that end in .ts but aren't scripts
        self.angular_file_patterns = {
            '.component.ts', '.component.spec.ts', '.service.ts', '.module.ts', 
            '.model.ts', '.config.ts', '.pipe.ts', '.directive.ts', '.guard.ts',
            '.resolver.ts', '.interceptor.ts'
        }
        
        # Folders where scripts should NOT be (except configs)
        self.forbidden_script_locations = [
            'documentation/reports',
            'documentation/design-tokens', 
            'documentation/workflow',
            'src/lib',
            'src/nginx'
        ]
        
        # Exceptions - files that can stay in documentation folders
        self.allowed_in_docs = {
            'config.json',
            'tracked-tokens-config.json',
            '.gitkeep',
            'README.md'
        }
    
    def is_script_file(self, file_path: Path) -> bool:
        """Determine if a file is actually a script that should be moved."""
        # Check extension
        if file_path.suffix not in self.script_extensions:
            return False
            
        # Exclude Angular framework files
        for pattern in self.angular_file_patterns:
            if file_path.name.endswith(pattern):
                return False
                
        # If it's a TypeScript file, check if it's in src/ (likely Angular code)
        if file_path.suffix == '.ts' and 'src/' in str(file_path):
            return False
            
        return True
    
    def find_misplaced_scripts(self) -> Dict[str, List[Path]]:
        """Find scripts that are in wrong locations."""
        misplaced = {
            'scripts_in_docs': [],
            'scripts_in_wrong_places': [],
            'configs_separated_from_scripts': []
        }
        
        # Check documentation folders for scripts
        docs_dir = self.project_root / "documentation"
        if docs_dir.exists():
            for script_file in docs_dir.rglob("*"):
                if (script_file.is_file() and 
                    self.is_script_file(script_file) and
                    script_file.name not in self.allowed_in_docs):
                    misplaced['scripts_in_docs'].append(script_file)
        
        # Check other forbidden locations
        for forbidden_path in self.forbidden_script_locations:
            forbidden_dir = self.project_root / forbidden_path
            if forbidden_dir.exists():
                for script_file in forbidden_dir.rglob("*"):
                    if (script_file.is_file() and 
                        self.is_script_file(script_file) and
                        script_file.name not in self.allowed_in_docs):
                        misplaced['scripts_in_wrong_places'].append(script_file)
        
        # Find configs that might be separated from their scripts
        for config_file in self.project_root.rglob("*config*.json"):
            if (config_file.is_file() and 
                "scripts-custom" not in str(config_file) and
                "_private" not in str(config_file)):
                # Check if there's a related script in scripts-custom
                config_name = config_file.stem
                possible_script_names = [
                    f"{config_name}.py",
                    f"{config_name.replace('-config', '')}.py",
                    f"{config_name.replace('config-', '')}.py"
                ]
                
                for script_name in possible_script_names:
                    if (self.scripts_custom / script_name).exists():
                        misplaced['configs_separated_from_scripts'].append(config_file)
                        break
        
        return misplaced
    
    def check_folder_structure(self) -> Dict[str, any]:
        """Check if folder structure follows the rules."""
        issues = {
            'missing_folders': [],
            'empty_script_folders': [],
            'scripts_count': {}
        }
        
        # Check if scripts-custom exists
        if not self.scripts_custom.exists():
            issues['missing_folders'].append('scripts-custom')
        else:
            # Count scripts in scripts-custom
            script_files = list(self.scripts_custom.glob("*"))
            script_files = [f for f in script_files if f.is_file() and self.is_script_file(f)]
            issues['scripts_count']['scripts-custom'] = len(script_files)
            
            if len(script_files) == 0:
                issues['empty_script_folders'].append('scripts-custom')
        
        # Check private scripts if requested
        if self.include_private:
            if not self.private_scripts.exists():
                issues['missing_folders'].append('private/scripts-custom')
            else:
                script_files = list(self.private_scripts.glob("*"))
                script_files = [f for f in script_files if f.is_file() and self.is_script_file(f)]
                issues['scripts_count']['private/scripts-custom'] = len(script_files)
                
                if len(script_files) == 0:
                    issues['empty_script_folders'].append('private/scripts-custom')
        
        return issues
    
    def fix_misplaced_scripts(self, misplaced: Dict[str, List[Path]]) -> bool:
        """Fix misplaced scripts by moving them to correct locations."""
        moved_files = []
        
        try:
            # Ensure target directories exist
            self.scripts_custom.mkdir(exist_ok=True)
            if self.include_private:
                self.private_scripts.parent.mkdir(exist_ok=True)
                self.private_scripts.mkdir(exist_ok=True)
            
            # Move scripts from documentation to scripts-custom
            for script_file in misplaced['scripts_in_docs']:
                target = self.scripts_custom / script_file.name
                if not target.exists():
                    shutil.move(str(script_file), str(target))
                    moved_files.append((script_file, target))
                    if self.verbose:
                        print(f"📦 Moved {script_file} → {target}")
            
            # Move scripts from other wrong places
            for script_file in misplaced['scripts_in_wrong_places']:
                target = self.scripts_custom / script_file.name
                if not target.exists():
                    shutil.move(str(script_file), str(target))
                    moved_files.append((script_file, target))
                    if self.verbose:
                        print(f"📦 Moved {script_file} → {target}")
            
            # Move separated configs to be with their scripts
            for config_file in misplaced['configs_separated_from_scripts']:
                target = self.scripts_custom / config_file.name
                if not target.exists():
                    shutil.move(str(config_file), str(target))
                    moved_files.append((config_file, target))
                    if self.verbose:
                        print(f"⚙️ Moved config {config_file} → {target}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error moving files: {e}")
            return False
    
    def cleanup_empty_directories(self):
        """Remove empty directories left behind after moving scripts."""
        for root, dirs, files in os.walk(self.project_root, topdown=False):
            for dir_name in dirs:
                dir_path = Path(root) / dir_name
                try:
                    # Only remove if empty and not important
                    if (not any(dir_path.iterdir()) and 
                        'scripts' in dir_name.lower() and
                        'node_modules' not in str(dir_path) and
                        '.git' not in str(dir_path)):
                        dir_path.rmdir()
                        if self.verbose:
                            print(f"🗑️ Removed empty directory: {dir_path}")
                except OSError:
                    pass  # Directory not empty or protected
    
    def generate_report(self, misplaced: Dict[str, List[Path]], structure_issues: Dict[str, any]) -> str:
        """Generate a report of findings."""
        report = []
        report.append("# Script Organization Report")
        report.append(f"Generated: {os.path.basename(sys.argv[0])} on {Path.cwd()}")
        report.append("")
        
        # Misplaced scripts
        total_misplaced = sum(len(files) for files in misplaced.values())
        if total_misplaced > 0:
            report.append("## 🚨 Misplaced Scripts Found")
            
            if misplaced['scripts_in_docs']:
                report.append("### Scripts in Documentation Folders:")
                for script in misplaced['scripts_in_docs']:
                    report.append(f"- `{script}`")
                report.append("")
            
            if misplaced['scripts_in_wrong_places']:
                report.append("### Scripts in Other Wrong Locations:")
                for script in misplaced['scripts_in_wrong_places']:
                    report.append(f"- `{script}`")
                report.append("")
            
            if misplaced['configs_separated_from_scripts']:
                report.append("### Configs Separated from Scripts:")
                for config in misplaced['configs_separated_from_scripts']:
                    report.append(f"- `{config}`")
                report.append("")
        else:
            report.append("## ✅ No Misplaced Scripts Found")
            report.append("")
        
        # Structure issues
        if any(structure_issues.values()):
            report.append("## 📁 Folder Structure Issues")
            
            if structure_issues['missing_folders']:
                report.append("### Missing Folders:")
                for folder in structure_issues['missing_folders']:
                    report.append(f"- `{folder}`")
                report.append("")
            
            if structure_issues['empty_script_folders']:
                report.append("### Empty Script Folders:")
                for folder in structure_issues['empty_script_folders']:
                    report.append(f"- `{folder}`")
                report.append("")
        
        # Script counts
        if structure_issues['scripts_count']:
            report.append("## 📊 Script Distribution")
            for folder, count in structure_issues['scripts_count'].items():
                report.append(f"- `{folder}`: {count} scripts")
            report.append("")
        
        # Recommendations
        report.append("## 💡 Recommendations")
        if total_misplaced > 0:
            report.append("- Run with `--fix` to automatically move misplaced scripts")
        report.append("- All custom scripts should be in `scripts-custom/`")
        report.append("- Private scripts go in separate private folder only when explicitly needed")
        report.append("- Configuration files should stay with their scripts")
        
        return "\n".join(report)

def main():
    parser = argparse.ArgumentParser(description='Clean up and organize project scripts')
    parser.add_argument('--check', action='store_true', help='Check for issues without fixing')
    parser.add_argument('--fix', action='store_true', help='Fix misplaced scripts')
    parser.add_argument('--private', action='store_true', help='Include private scripts folder')
    parser.add_argument('--verbose', action='store_true', help='Show detailed output')
    parser.add_argument('--project-root', default='.', help='Project root directory')
    
    args = parser.parse_args()
    
    # Default to check if no action specified
    if not args.check and not args.fix:
        args.check = True
    
    cleanup = ScriptCleanup(args.project_root, args.private, args.verbose)
    
    print("🧹 Script Organization Cleanup")
    print("=" * 40)
    
    # Find issues
    misplaced = cleanup.find_misplaced_scripts()
    structure_issues = cleanup.check_folder_structure()
    
    total_issues = (sum(len(files) for files in misplaced.values()) + 
                   len(structure_issues['missing_folders']) + 
                   len(structure_issues['empty_script_folders']))
    
    if args.check:
        if total_issues == 0:
            print("✅ All scripts are properly organized!")
        else:
            print(f"⚠️ Found {total_issues} organization issues")
            print("\n" + cleanup.generate_report(misplaced, structure_issues))
    
    if args.fix:
        if total_issues == 0:
            print("✅ Nothing to fix - all scripts are properly organized!")
        else:
            print(f"🔧 Fixing {total_issues} organization issues...")
            
            success = cleanup.fix_misplaced_scripts(misplaced)
            if success:
                cleanup.cleanup_empty_directories()
                print("✅ Scripts reorganized successfully!")
                
                # Re-check to confirm
                misplaced_after = cleanup.find_misplaced_scripts()
                remaining_issues = sum(len(files) for files in misplaced_after.values())
                if remaining_issues == 0:
                    print("🎉 All scripts are now properly organized!")
                else:
                    print(f"⚠️ {remaining_issues} issues remain (may need manual review)")
            else:
                print("❌ Some issues occurred during reorganization")

if __name__ == "__main__":
    main()
