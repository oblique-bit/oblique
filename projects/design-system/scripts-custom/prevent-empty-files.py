#!/usr/bin/env python3
"""
Empty File Prevention Monitor
============================

Monitors the design system workspace for empty file creation and prevents
accumulation through real-time detection and automated cleanup.

Features:
- File system monitoring for empty file creation
- Automatic cleanup of untracked empty files
- Logging and notifications
- Integration with development workflow

Usage:
    python3 scripts-custom/prevent-empty-files.py [--watch] [--cleanup-now]
"""

import os
import time
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from typing import List, Set

class EmptyFileMonitor:
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.log_file = project_root / "_private" / "logs" / "empty-file-monitor.log"
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Directories to exclude from monitoring
        self.excluded_dirs = {
            '.git', 'node_modules', '.vscode', 'dist', 'build',
            '_private/logs', '__pycache__', '.pytest_cache'
        }
        
        # Files that are allowed to be empty
        self.allowed_empty = {
            '.gitkeep', '.gitignore', '__init__.py'
        }
        
    def log(self, message: str):
        """Log message with timestamp."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        print(log_entry)
        
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry + '\n')
            
    def notify_macos(self, message: str):
        """Send macOS notification."""
        try:
            subprocess.run([
                'osascript', '-e', 
                f'display notification "{message}" with title "Empty File Monitor"'
            ], check=False, capture_output=True)
        except Exception:
            pass  # Notifications are optional
            
    def find_empty_files(self) -> List[Path]:
        """Find all empty files in the project."""
        empty_files = []
        
        for root, dirs, files in os.walk(self.project_root):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if d not in self.excluded_dirs]
            
            for file in files:
                file_path = Path(root) / file
                
                # Skip allowed empty files
                if file in self.allowed_empty:
                    continue
                    
                # Check if file is empty
                try:
                    if file_path.stat().st_size == 0:
                        empty_files.append(file_path)
                except (OSError, FileNotFoundError):
                    continue
                    
        return empty_files
        
    def get_git_status(self, files: List[Path]) -> tuple[List[Path], List[Path]]:
        """Categorize files by git tracking status."""
        if not files:
            return [], []
            
        try:
            # Get tracked files
            result = subprocess.run(
                ['git', 'ls-files'] + [str(f) for f in files],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=False
            )
            tracked_files = [Path(line) for line in result.stdout.strip().split('\n') if line]
            
            # Get untracked files
            result = subprocess.run(
                ['git', 'ls-files', '--others', '--exclude-standard'] + [str(f) for f in files],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=False
            )
            untracked_files = [Path(line) for line in result.stdout.strip().split('\n') if line]
            
            return tracked_files, untracked_files
            
        except Exception as e:
            self.log(f"⚠️  Error checking git status: {e}")
            return [], files  # Treat all as untracked if git fails
            
    def cleanup_empty_files(self, auto_remove_untracked: bool = True) -> dict:
        """Clean up empty files and return summary."""
        empty_files = self.find_empty_files()
        
        if not empty_files:
            self.log("✅ No empty files found.")
            return {'total': 0, 'tracked': 0, 'untracked': 0, 'removed': 0}
            
        tracked, untracked = self.get_git_status(empty_files)
        
        summary = {
            'total': len(empty_files),
            'tracked': len(tracked),
            'untracked': len(untracked),
            'removed': 0
        }
        
        self.log(f"🔍 Found {len(empty_files)} empty files:")
        
        # Log tracked empty files (warning only)
        if tracked:
            self.log(f"⚠️  WARNING: {len(tracked)} empty files are tracked by git:")
            for file in tracked:
                rel_path = file.relative_to(self.project_root)
                self.log(f"   • {rel_path} (tracked - manual review required)")
                
        # Handle untracked empty files
        if untracked:
            self.log(f"🗑️  Found {len(untracked)} untracked empty files:")
            
            for file in untracked:
                rel_path = file.relative_to(self.project_root)
                self.log(f"   • {rel_path}")
                
            if auto_remove_untracked:
                self.log("🧹 Auto-removing untracked empty files...")
                removed_count = 0
                
                for file in untracked:
                    try:
                        if file.exists():
                            file.unlink()
                            rel_path = file.relative_to(self.project_root)
                            self.log(f"   ✅ Removed: {rel_path}")
                            removed_count += 1
                    except Exception as e:
                        rel_path = file.relative_to(self.project_root)
                        self.log(f"   ❌ Failed to remove {rel_path}: {e}")
                        
                summary['removed'] = removed_count
                self.log(f"✅ Removed {removed_count} untracked empty files.")
                
                if removed_count > 0:
                    self.notify_macos(f"🧹 Auto-cleaned {removed_count} empty files")
                    
        return summary
        
    def monitor_continuously(self, check_interval: int = 60):
        """Monitor for empty files continuously."""
        self.log("🔍 Starting continuous empty file monitoring...")
        self.log(f"📁 Monitoring: {self.project_root}")
        self.log(f"⏱️  Check interval: {check_interval} seconds")
        
        try:
            while True:
                summary = self.cleanup_empty_files(auto_remove_untracked=True)
                
                if summary['total'] > 0:
                    self.log(f"📊 Scan summary: {summary['total']} total, "
                           f"{summary['tracked']} tracked, "
                           f"{summary['untracked']} untracked, "
                           f"{summary['removed']} removed")
                           
                time.sleep(check_interval)
                
        except KeyboardInterrupt:
            self.log("🛑 Monitoring stopped by user.")
        except Exception as e:
            self.log(f"❌ Monitoring error: {e}")
            
def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description='Monitor and prevent empty file accumulation')
    parser.add_argument('--watch', action='store_true', help='Start continuous monitoring')
    parser.add_argument('--cleanup-now', action='store_true', help='Run cleanup immediately and exit')
    parser.add_argument('--interval', type=int, default=60, help='Check interval in seconds (default: 60)')
    
    args = parser.parse_args()
    
    # Determine project root
    script_path = Path(__file__).resolve()
    project_root = script_path.parent.parent
    
    monitor = EmptyFileMonitor(project_root)
    
    if args.cleanup_now:
        monitor.log("🧹 Running immediate cleanup...")
        summary = monitor.cleanup_empty_files(auto_remove_untracked=True)
        monitor.log("🏁 Cleanup completed.")
        
    elif args.watch:
        monitor.monitor_continuously(args.interval)
        
    else:
        # Default: run cleanup once
        monitor.cleanup_empty_files(auto_remove_untracked=True)

if __name__ == "__main__":
    main()
