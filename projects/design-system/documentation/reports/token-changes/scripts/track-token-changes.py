#!/usr/bin/env python3
"""
Token Change Tracking System for Oblique Design System

This script tracks changes to design tokens that are hardcoded in style dictionary,
focusing only on tokens specified in the tracked-tokens-config.json file.

USAGE:
    python3 track-token-changes.py [--manual] [--config path/to/config.json]
    
    --manual: Run manual scan (vs automated)
    --config: Custom config file path (default: tracked-tokens-config.json)

FEATURES:
- Tracks only tokens specified in configuration
- Detects path changes, deletions, value modifications
- Generates breaking change alerts
- Creates migration guides
- Supports both automated and manual execution

AUTHORS: Design System Team
VERSION: 1.0.0
LAST UPDATED: July 15, 2025
"""

import json
import os
import sys
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Any, Optional, Tuple
import argparse
import difflib

class TokenChangeTracker:
    def __init__(self, config_path: str, project_root: str):
        self.project_root = Path(project_root)
        self.config_path = Path(config_path)
        self.config = self.load_config()
        self.reports_dir = self.project_root / "documentation" / "reports" / "token-changes"
        self.latest_dir = self.reports_dir / "latest"
        self.registry_file = self.latest_dir / "token-registry.json"
        
    def load_config(self) -> Dict[str, Any]:
        """Load the tracked tokens configuration."""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Config file not found: {self.config_path}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in config file: {e}")
            sys.exit(1)

    def get_tracked_token_paths(self) -> Set[str]:
        """Extract all tracked token paths from config."""
        tracked_paths = set()
        
        for category_data in self.config.get('trackedTokens', {}).values():
            if isinstance(category_data, dict) and 'paths' in category_data:
                tracked_paths.update(category_data['paths'])
        
        return tracked_paths

    def find_token_files(self) -> List[Path]:
        """Find all token files based on watch patterns."""
        token_files = []
        includes = self.config.get('watchPatterns', {}).get('includes', ['src/lib/themes/**/*.json'])
        excludes = self.config.get('watchPatterns', {}).get('excludes', [])
        
        for pattern in includes:
            # Convert glob pattern to actual file search
            if '**' in pattern:
                base_path = pattern.split('**')[0]
                extension = pattern.split('.')[-1]
                search_path = self.project_root / base_path
                
                if search_path.exists():
                    token_files.extend(search_path.rglob(f"*.{extension}"))
        
        # Filter out excluded patterns
        filtered_files = []
        for file_path in token_files:
            exclude_file = False
            for exclude_pattern in excludes:
                if any(part in str(file_path) for part in exclude_pattern.split('/')):
                    exclude_file = True
                    break
            if not exclude_file:
                filtered_files.append(file_path)
        
        return filtered_files

    def extract_tokens_from_file(self, file_path: Path) -> Dict[str, Any]:
        """Extract token definitions from a single file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            return self.flatten_tokens(data, str(file_path))
        except Exception as e:
            print(f"⚠️  Warning: Could not parse {file_path}: {e}")
            return {}

    def flatten_tokens(self, data: Any, source_file: str, prefix: str = "") -> Dict[str, Any]:
        """Flatten nested token structure into dot notation."""
        tokens = {}
        
        if isinstance(data, dict):
            for key, value in data.items():
                current_path = f"{prefix}.{key}" if prefix else key
                
                if isinstance(value, dict):
                    if "$value" in value:
                        # This is a token definition
                        tokens[current_path] = {
                            "value": value.get("$value"),
                            "type": value.get("$type"),
                            "description": value.get("$description"),
                            "source_file": source_file,
                            "full_definition": value
                        }
                    else:
                        # Continue flattening
                        tokens.update(self.flatten_tokens(value, source_file, current_path))
        
        return tokens

    def build_current_registry(self) -> Dict[str, Any]:
        """Build a registry of all current tokens."""
        print("🔍 Scanning for token files...")
        token_files = self.find_token_files()
        print(f"📁 Found {len(token_files)} token files")
        
        all_tokens = {}
        tracked_paths = self.get_tracked_token_paths()
        
        for file_path in token_files:
            file_tokens = self.extract_tokens_from_file(file_path)
            all_tokens.update(file_tokens)
        
        # Filter to only tracked tokens
        tracked_tokens = {
            path: data for path, data in all_tokens.items() 
            if path in tracked_paths
        }
        
        registry = {
            "timestamp": datetime.now().isoformat(),
            "total_tokens_scanned": len(all_tokens),
            "tracked_tokens_found": len(tracked_tokens),
            "tracked_tokens_configured": len(tracked_paths),
            "tokens": tracked_tokens,
            "config_version": self.config.get("version", "unknown"),
            "scan_metadata": {
                "files_scanned": len(token_files),
                "tracking_focus": "hardcoded_style_dictionary_tokens"
            }
        }
        
        return registry

    def load_previous_registry(self) -> Optional[Dict[str, Any]]:
        """Load the previous token registry if it exists."""
        if not self.registry_file.exists():
            return None
        
        try:
            with open(self.registry_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️  Warning: Could not load previous registry: {e}")
            return None

    def detect_changes(self, previous: Dict[str, Any], current: Dict[str, Any]) -> Dict[str, Any]:
        """Detect changes between previous and current token registries."""
        if not previous:
            return {
                "type": "initial_scan",
                "summary": "First scan - no changes to detect",
                "changes": {}
            }
        
        prev_tokens = previous.get("tokens", {})
        curr_tokens = current.get("tokens", {})
        
        changes = {
            "added": {},
            "removed": {},
            "modified": {},
            "renamed": []
        }
        
        # Detect additions
        for path, data in curr_tokens.items():
            if path not in prev_tokens:
                changes["added"][path] = data
        
        # Detect removals
        for path, data in prev_tokens.items():
            if path not in curr_tokens:
                changes["removed"][path] = data
        
        # Detect modifications
        for path in set(prev_tokens.keys()) & set(curr_tokens.keys()):
            prev_token = prev_tokens[path]
            curr_token = curr_tokens[path]
            
            if prev_token.get("value") != curr_token.get("value"):
                changes["modified"][path] = {
                    "previous": prev_token,
                    "current": curr_token,
                    "changes": {
                        "value": {
                            "from": prev_token.get("value"),
                            "to": curr_token.get("value")
                        }
                    }
                }
        
        # Detect potential renames (same value, different path)
        for removed_path, removed_data in changes["removed"].items():
            for added_path, added_data in changes["added"].items():
                if (removed_data.get("value") == added_data.get("value") and
                    removed_data.get("type") == added_data.get("type")):
                    changes["renamed"].append({
                        "from": removed_path,
                        "to": added_path,
                        "value": removed_data.get("value")
                    })
        
        # Remove renamed tokens from added/removed
        renamed_paths = set()
        for rename in changes["renamed"]:
            renamed_paths.add(rename["from"])
            renamed_paths.add(rename["to"])
        
        changes["added"] = {k: v for k, v in changes["added"].items() if k not in renamed_paths}
        changes["removed"] = {k: v for k, v in changes["removed"].items() if k not in renamed_paths}
        
        return {
            "type": "change_detection",
            "summary": self.summarize_changes(changes),
            "changes": changes
        }

    def summarize_changes(self, changes: Dict[str, Any]) -> Dict[str, Any]:
        """Create a summary of detected changes."""
        return {
            "total_changes": (
                len(changes["added"]) + 
                len(changes["removed"]) + 
                len(changes["modified"]) + 
                len(changes["renamed"])
            ),
            "breaking_changes": len(changes["removed"]) + len(changes["renamed"]),
            "additions": len(changes["added"]),
            "removals": len(changes["removed"]),
            "modifications": len(changes["modified"]),
            "renames": len(changes["renamed"]),
            "severity": self.assess_severity(changes)
        }

    def assess_severity(self, changes: Dict[str, Any]) -> str:
        """Assess the severity of changes based on breaking change rules."""
        if changes["removed"] or changes["renamed"]:
            return "critical"  # Breaking changes
        elif changes["modified"]:
            return "major"     # Value changes
        elif changes["added"]:
            return "minor"     # Only additions
        else:
            return "none"      # No changes

    def generate_report(self, current_registry: Dict[str, Any], 
                       change_detection: Dict[str, Any], 
                       is_manual: bool = False) -> Tuple[str, str]:
        """Generate both markdown and JSON reports."""
        
        timestamp = datetime.now()
        report_date = timestamp.strftime("%Y%m%d-%H%M")
        
        # Create year/month directory structure
        year_month_dir = self.reports_dir / timestamp.strftime("%Y") / timestamp.strftime("%m")
        year_month_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate reports
        markdown_content = self.generate_markdown_report(current_registry, change_detection, is_manual, timestamp)
        json_content = self.generate_json_report(current_registry, change_detection, is_manual, timestamp)
        
        # Save reports
        md_file = year_month_dir / f"{report_date}-token-changes.md"
        json_file = year_month_dir / f"{report_date}-token-changes.json"
        
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        with open(json_file, 'w', encoding='utf-8') as f:
            f.write(json_content)
        
        # Update latest summary
        latest_summary = self.latest_dir / "last-change-summary.md"
        with open(latest_summary, 'w', encoding='utf-8') as f:
            f.write(self.generate_latest_summary(change_detection, timestamp))
        
        return str(md_file), str(json_file)

    def generate_markdown_report(self, registry: Dict[str, Any], 
                                changes: Dict[str, Any], 
                                is_manual: bool, 
                                timestamp: datetime) -> str:
        """Generate detailed markdown report."""
        
        severity = changes.get("summary", {}).get("severity", "none")
        severity_emoji = {
            "critical": "🚨",
            "major": "⚠️",
            "minor": "ℹ️",
            "none": "✅"
        }
        
        content = f"""# Token Changes Report

**Generated:** {timestamp.strftime("%Y-%m-%d %H:%M:%S")}  
**Scan Type:** {"Manual" if is_manual else "Automated"}  
**Severity:** {severity_emoji.get(severity, "❓")} {severity.upper()}  
**Config Version:** {registry.get("config_version", "unknown")}

---

## 📊 Summary

| Metric | Value |
|--------|-------|
| **Total Changes** | {changes.get("summary", {}).get("total_changes", 0)} |
| **Breaking Changes** | {changes.get("summary", {}).get("breaking_changes", 0)} |
| **Tracked Tokens Found** | {registry.get("tracked_tokens_found", 0)} |
| **Tracked Tokens Configured** | {registry.get("tracked_tokens_configured", 0)} |
| **Files Scanned** | {registry.get("scan_metadata", {}).get("files_scanned", 0)} |

---

## 🎯 Change Details

"""

        if changes["type"] == "initial_scan":
            content += """### 🆕 Initial Scan

This is the first scan of your tracked tokens. No changes detected.

**Next Steps:**
1. The baseline registry has been created
2. Future scans will detect changes against this baseline
3. Add any missing hardcoded token paths to `tracked-tokens-config.json`

"""
        else:
            # Breaking Changes Section
            if changes["changes"]["removed"] or changes["changes"]["renamed"]:
                content += "### 🚨 Breaking Changes\n\n"
                
                if changes["changes"]["removed"]:
                    content += "#### ❌ Removed Tokens\n"
                    for path, data in changes["changes"]["removed"].items():
                        content += f"- **`{path}`** - {data.get('description', 'No description')}\n"
                        content += f"  - Previous value: `{data.get('value')}`\n"
                        content += f"  - Source: `{data.get('source_file', 'unknown')}`\n\n"
                
                if changes["changes"]["renamed"]:
                    content += "#### 🔄 Renamed Tokens\n"
                    for rename in changes["changes"]["renamed"]:
                        content += f"- **`{rename['from']}`** → **`{rename['to']}`**\n"
                        content += f"  - Value: `{rename['value']}`\n\n"
                
                content += """
**🔧 Migration Required:**
Hardcoded references to these tokens in your style dictionary will break. Update your code to use the new paths.

"""

            # Modifications Section  
            if changes["changes"]["modified"]:
                content += "### 📝 Modified Tokens\n\n"
                for path, mod_data in changes["changes"]["modified"].items():
                    content += f"#### `{path}`\n"
                    content += f"- **Previous:** `{mod_data['changes']['value']['from']}`\n"
                    content += f"- **Current:** `{mod_data['changes']['value']['to']}`\n"
                    content += f"- **Source:** `{mod_data['current'].get('source_file', 'unknown')}`\n\n"

            # Additions Section
            if changes["changes"]["added"]:
                content += "### ➕ New Tokens\n\n"
                for path, data in changes["changes"]["added"].items():
                    content += f"- **`{path}`** = `{data.get('value')}`\n"
                    content += f"  - {data.get('description', 'No description')}\n"
                    content += f"  - Source: `{data.get('source_file', 'unknown')}`\n\n"

        # Configuration Section
        content += f"""
---

## ⚙️ Configuration Status

**Tracked Token Categories:** {len(self.config.get('trackedTokens', {}))}  
**Watch Patterns:** {len(self.config.get('watchPatterns', {}).get('includes', []))}  

### Missing Tracked Tokens
"""
        
        tracked_paths = self.get_tracked_token_paths()
        found_tokens = set(registry.get("tokens", {}).keys())
        missing_tokens = tracked_paths - found_tokens
        
        if missing_tokens:
            content += "The following tokens are configured for tracking but were not found:\n\n"
            for token in sorted(missing_tokens):
                content += f"- `{token}`\n"
            content += "\n**Action:** Verify these token paths exist or remove them from configuration.\n\n"
        else:
            content += "✅ All configured tokens were found.\n\n"

        # Footer
        content += f"""
---

## 📚 Resources

- **Configuration File:** `tracked-tokens-config.json`
- **Token Registry:** `latest/token-registry.json`  
- **Tracking Script:** `scripts/track-token-changes.py`

**Report Generated by:** Oblique Design System Token Change Tracker v1.0.0
"""

        return content

    def generate_json_report(self, registry: Dict[str, Any], 
                           changes: Dict[str, Any], 
                           is_manual: bool, 
                           timestamp: datetime) -> str:
        """Generate machine-readable JSON report."""
        
        report_data = {
            "metadata": {
                "timestamp": timestamp.isoformat(),
                "scan_type": "manual" if is_manual else "automated",
                "version": "1.0.0",
                "config_version": registry.get("config_version", "unknown")
            },
            "summary": changes.get("summary", {}),
            "registry": registry,
            "changes": changes,
            "configuration": {
                "tracked_categories": len(self.config.get('trackedTokens', {})),
                "watch_patterns": self.config.get('watchPatterns', {}),
                "breaking_change_rules": self.config.get('breakingChangeRules', {})
            }
        }
        
        return json.dumps(report_data, indent=2, ensure_ascii=False)

    def generate_latest_summary(self, changes: Dict[str, Any], timestamp: datetime) -> str:
        """Generate a quick summary for the latest directory."""
        
        severity = changes.get("summary", {}).get("severity", "none")
        total_changes = changes.get("summary", {}).get("total_changes", 0)
        
        return f"""# Latest Token Changes Summary

**Last Updated:** {timestamp.strftime("%Y-%m-%d %H:%M:%S")}  
**Status:** {severity.upper()}  
**Total Changes:** {total_changes}

{f"🚨 **{changes.get('summary', {}).get('breaking_changes', 0)} breaking changes detected!**" if changes.get('summary', {}).get('breaking_changes', 0) > 0 else "✅ No breaking changes"}

## Quick Actions

- View full report: `{timestamp.strftime('%Y/%m/%Y%m%d-%H%M')}-token-changes.md`
- Update configuration: `tracked-tokens-config.json`
- Run manual scan: `npm run track:token-changes`

---
*Generated by Token Change Tracker*
"""

    def save_registry(self, registry: Dict[str, Any]) -> None:
        """Save the current registry for future comparisons."""
        self.latest_dir.mkdir(parents=True, exist_ok=True)
        
        with open(self.registry_file, 'w', encoding='utf-8') as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)

    def run_scan(self, is_manual: bool = False) -> Tuple[str, bool]:
        """Run a complete token change scan."""
        print("🚀 Starting token change tracking scan...")
        print(f"📂 Project root: {self.project_root}")
        print(f"⚙️  Config file: {self.config_path}")
        print(f"🎯 Tracked tokens: {len(self.get_tracked_token_paths())}")
        
        # Build current state
        current_registry = self.build_current_registry()
        
        # Load previous state
        previous_registry = self.load_previous_registry()
        
        # Detect changes
        change_detection = self.detect_changes(previous_registry, current_registry)
        
        # Generate reports
        md_file, json_file = self.generate_report(current_registry, change_detection, is_manual)
        
        # Save current state as new baseline
        self.save_registry(current_registry)
        
        # Print results
        severity = change_detection.get("summary", {}).get("severity", "none")
        total_changes = change_detection.get("summary", {}).get("total_changes", 0)
        breaking_changes = change_detection.get("summary", {}).get("breaking_changes", 0)
        
        print(f"\n✅ Scan completed!")
        print(f"📊 Results: {total_changes} total changes, {breaking_changes} breaking")
        print(f"📄 Reports saved:")
        print(f"   - {md_file}")
        print(f"   - {json_file}")
        
        if breaking_changes > 0:
            print(f"\n🚨 WARNING: {breaking_changes} breaking changes detected!")
            print("   Review the report and update hardcoded token references.")
            return f"Breaking changes detected: {breaking_changes}", True
        elif total_changes > 0:
            print(f"\nℹ️  {total_changes} non-breaking changes detected.")
            return f"Non-breaking changes detected: {total_changes}", False
        else:
            print("\n✅ No changes detected.")
            return "No changes detected", False

def main():
    parser = argparse.ArgumentParser(description='Track design token changes for hardcoded style dictionary references')
    parser.add_argument('--manual', action='store_true', help='Run manual scan (vs automated)')
    parser.add_argument('--config', default='tracked-tokens-config.json', help='Path to configuration file')
    parser.add_argument('--project-root', default='.', help='Project root directory')
    
    args = parser.parse_args()
    
    # Resolve paths
    project_root = Path(args.project_root).resolve()
    config_path = project_root / "documentation" / "reports" / "token-changes" / args.config
    
    # Initialize tracker
    tracker = TokenChangeTracker(str(config_path), str(project_root))
    
    # Run scan
    try:
        result_message, has_breaking_changes = tracker.run_scan(args.manual)
        
        if has_breaking_changes:
            sys.exit(1)  # Exit with error code for breaking changes
        else:
            sys.exit(0)  # Exit successfully
            
    except KeyboardInterrupt:
        print("\n❌ Scan interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Error during scan: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
