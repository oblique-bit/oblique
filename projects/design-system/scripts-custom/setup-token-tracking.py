#!/usr/bin/env python3
"""
Style Dictionary Integration Setup & Maintenance Utility

This script helps set up and maintain the style dictionary integration tracking system.

USAGE:
    python3 setup-token-tracking.py [command]
    
COMMANDS:
    setup     - Initial setup and configuration validation
    validate  - Validate configuration and tracked tokens
    add-token - Interactive tool to add new tracked tokens
    cron      - Show cron job setup instructions
    git-hook  - Setup git pre-commit hook
    help      - Show this help message

AUTHORS: Design System Team
VERSION: 1.0.0
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Set, Any
import subprocess

class StyleDictionaryIntegrationSetup:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.reports_dir = self.project_root / "documentation" / "reports" / "style-dictionary-integration"
        self.config_path = self.project_root / "scripts-custom" / "tracked-tokens-config.json"
        self.scripts_dir = self.project_root / "scripts-custom"
        
    def setup(self):
        """Initial setup and validation."""
        print("🚀 Setting up Style Dictionary Integration Tracking System...")
        
        # Check if files exist
        if not self.config_path.exists():
            print(f"❌ Configuration file not found: {self.config_path}")
            return False
            
        if not (self.scripts_dir / "track-token-changes.py").exists():
            print(f"❌ Tracking script not found: {self.scripts_dir}/track-token-changes.py")
            return False
            
        # Validate configuration
        print("✅ Files found, validating configuration...")
        if not self.validate_config():
            return False
            
        # Run initial scan
        print("🔍 Running initial scan...")
        result = subprocess.run([
            sys.executable, 
            str(self.scripts_dir / "track-token-changes.py"),
            "--manual",
            "--project-root", str(self.project_root)
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Initial scan completed successfully!")
            print(f"📁 Reports saved in: {self.reports_dir}")
            return True
        else:
            print(f"❌ Initial scan failed: {result.stderr}")
            return False
    
    def validate_config(self):
        """Validate configuration file."""
        try:
            with open(self.config_path, 'r') as f:
                config = json.load(f)
            
            # Check required sections
            required_sections = ['trackedTokens', 'watchPatterns', 'breakingChangeRules']
            for section in required_sections:
                if section not in config:
                    print(f"❌ Missing required section in config: {section}")
                    return False
            
            # Count tracked tokens
            total_tracked = 0
            for category_data in config.get('trackedTokens', {}).values():
                if isinstance(category_data, dict) and 'paths' in category_data:
                    total_tracked += len(category_data['paths'])
            
            print(f"✅ Configuration valid:")
            print(f"   - {len(config.get('trackedTokens', {}))} token categories")
            print(f"   - {total_tracked} tracked token paths")
            print(f"   - {len(config.get('watchPatterns', {}).get('includes', []))} watch patterns")
            
            return True
            
        except Exception as e:
            print(f"❌ Configuration validation failed: {e}")
            return False
    
    def add_token_interactive(self):
        """Interactive tool to add new tracked tokens."""
        print("🎯 Add New Tracked Token")
        print("=" * 40)
        
        # Load current config
        try:
            with open(self.config_path, 'r') as f:
                config = json.load(f)
        except Exception as e:
            print(f"❌ Could not load config: {e}")
            return
        
        # Show current categories
        categories = list(config.get('trackedTokens', {}).keys())
        print(f"\nCurrent categories: {', '.join(categories)}")
        
        # Get input
        token_path = input("\n🏷️  Enter token path (e.g., ob.s.color.neutral.no-color): ").strip()
        if not token_path:
            print("❌ Token path cannot be empty")
            return
        
        # Choose category
        print(f"\n📂 Choose category:")
        for i, cat in enumerate(categories, 1):
            print(f"   {i}. {cat}")
        print(f"   {len(categories) + 1}. Create new category")
        
        try:
            choice = int(input(f"\nEnter choice (1-{len(categories) + 1}): "))
            if 1 <= choice <= len(categories):
                category = categories[choice - 1]
            elif choice == len(categories) + 1:
                category = input("Enter new category name: ").strip()
                if not category:
                    print("❌ Category name cannot be empty")
                    return
                # Initialize new category
                config['trackedTokens'][category] = {
                    "description": f"{category.title()} tokens that are hardcoded in style dictionary",
                    "paths": []
                }
            else:
                print("❌ Invalid choice")
                return
        except ValueError:
            print("❌ Invalid input")
            return
        
        # Add usage context
        usage_context = input(f"\n💬 Usage context (optional): ").strip()
        
        # Add to config
        if token_path not in config['trackedTokens'][category]['paths']:
            config['trackedTokens'][category]['paths'].append(token_path)
            config['lastUpdated'] = "2025-07-15"  # Update timestamp
            
            # Save config
            try:
                with open(self.config_path, 'w') as f:
                    json.dump(config, f, indent=2, ensure_ascii=False)
                print(f"✅ Added '{token_path}' to category '{category}'")
                if usage_context:
                    print(f"   Context: {usage_context}")
                print(f"📄 Config updated: {self.config_path}")
            except Exception as e:
                print(f"❌ Could not save config: {e}")
        else:
            print(f"⚠️  Token '{token_path}' already exists in category '{category}'")
    
    def show_cron_setup(self):
        """Show cron job setup instructions."""
        script_path = self.scripts_dir / "track-token-changes.py"
        
        print("⏰ Cron Job Setup Instructions")
        print("=" * 40)
        print("\n1. Open your crontab:")
        print("   crontab -e")
        print("\n2. Add this line for daily execution at 2 AM:")
        print(f"   0 2 * * * cd {self.project_root} && python3 {script_path} >/dev/null 2>&1")
        print("\n3. For more frequent checks (every 4 hours):")
        print(f"   0 */4 * * * cd {self.project_root} && python3 {script_path} >/dev/null 2>&1")
        print("\n4. To receive email notifications on changes:")
        print(f"   0 2 * * * cd {self.project_root} && python3 {script_path} || echo 'Token changes detected' | mail -s 'Design System Alert' your-email@company.com")
        print("\nNote: Make sure to update the email address above.")
    
    def setup_git_hook(self):
        """Setup git pre-commit hook."""
        git_dir = self.project_root / ".git"
        if not git_dir.exists():
            print("❌ Not a git repository")
            return
        
        hooks_dir = git_dir / "hooks"
        hooks_dir.mkdir(exist_ok=True)
        
        hook_file = hooks_dir / "pre-commit"
        script_path = self.scripts_dir / "track-token-changes.py"
        
        hook_content = f"""#!/bin/bash
# Oblique Design System - Token Change Detection Pre-commit Hook

# Check if any token files have been modified
token_files_changed=$(git diff --cached --name-only | grep -E "src/lib/themes.*\\.(json|js|ts)$" | wc -l)

if [ "$token_files_changed" -gt 0 ]; then
    echo "🔍 Token files detected in commit, running change detection..."
    
    # Run token change tracking
    cd "{self.project_root}"
    python3 "{script_path}" --project-root "{self.project_root}"
    
    # Check if breaking changes were detected
    if [ $? -eq 1 ]; then
        echo ""
        echo "🚨 BREAKING TOKEN CHANGES DETECTED!"
        echo "   Review the generated report before committing."
        echo "   Report location: documentation/reports/style-dictionary-integration/"
        echo ""
        echo "   To bypass this check: git commit --no-verify"
        exit 1
    else
        echo "✅ Token change detection completed"
    fi
fi
"""
        
        try:
            with open(hook_file, 'w') as f:
                f.write(hook_content)
            
            # Make executable
            os.chmod(hook_file, 0o755)
            
            print("✅ Git pre-commit hook installed successfully!")
            print(f"📁 Location: {hook_file}")
            print("\nThe hook will:")
            print("- Detect when token files are modified in commits")
            print("- Run automatic token change detection")
            print("- Block commits with breaking token changes")
            print("- Generate reports for review")
            
        except Exception as e:
            print(f"❌ Could not setup git hook: {e}")
    
    def show_help(self):
        """Show help message."""
        print(__doc__)

def main():
    if len(sys.argv) < 2:
        command = "help"
    else:
        command = sys.argv[1].lower()
    
    # Get project root
    project_root = Path(__file__).parent.parent
    setup = StyleDictionaryIntegrationSetup(str(project_root))
    
    if command == "setup":
        success = setup.setup()
        sys.exit(0 if success else 1)
    elif command == "validate":
        success = setup.validate_config()
        sys.exit(0 if success else 1)
    elif command == "add-token":
        setup.add_token_interactive()
    elif command == "cron":
        setup.show_cron_setup()
    elif command == "git-hook":
        setup.setup_git_hook()
    elif command == "help":
        setup.show_help()
    else:
        print(f"❌ Unknown command: {command}")
        setup.show_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
