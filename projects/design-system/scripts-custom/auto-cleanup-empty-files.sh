#!/bin/bash

# Automated Empty File Cleaner
# Runs periodically to detect and remove empty files before they accumulate
# Can be run manually or scheduled via cron/launchd

set -euo pipefail

PROJECT_ROOT="/Users/davorradisic/vc git repo bit/oblique/projects/design-system"
LOG_FILE="$PROJECT_ROOT/_private/logs/empty-file-cleanup.log"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send notification (macOS)
notify() {
    osascript -e "display notification \"$1\" with title \"Design System Cleanup\""
}

log "🧹 Starting automated empty file cleanup..."

cd "$PROJECT_ROOT"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    log "❌ Not in a git repository. Exiting."
    exit 1
fi

# Find empty files (excluding intentionally empty files)
EMPTY_FILES=$(find . -type f -size 0 \
    ! -name ".gitkeep" \
    ! -name ".gitignore" \
    ! -path "./.git/*" \
    ! -path "./node_modules/*" \
    ! -path "./.vscode/*" \
    ! -path "./_private/logs/*" \
    ! -path "./dist/*" \
    ! -path "./build/*" \
    2>/dev/null || true)

if [ -z "$EMPTY_FILES" ]; then
    log "✅ No empty files found. Repository is clean."
    exit 0
fi

# Count empty files
EMPTY_COUNT=$(echo "$EMPTY_FILES" | wc -l | tr -d ' ')
log "🗑️  Found $EMPTY_COUNT empty files:"

# Log each empty file
echo "$EMPTY_FILES" | while read -r file; do
    log "   • $file"
done

# Check git status to see if any are tracked
TRACKED_EMPTY=$(echo "$EMPTY_FILES" | xargs git ls-files 2>/dev/null || true)
UNTRACKED_EMPTY=$(echo "$EMPTY_FILES" | xargs git ls-files --others --exclude-standard 2>/dev/null || true)

# Handle tracked empty files (warning only)
if [ ! -z "$TRACKED_EMPTY" ]; then
    TRACKED_COUNT=$(echo "$TRACKED_EMPTY" | wc -l | tr -d ' ')
    log "⚠️  WARNING: $TRACKED_COUNT empty files are tracked by git:"
    echo "$TRACKED_EMPTY" | while read -r file; do
        log "   • $file (tracked - manual review required)"
    done
    notify "⚠️ Found $TRACKED_COUNT tracked empty files requiring manual review"
fi

# Remove untracked empty files
if [ ! -z "$UNTRACKED_EMPTY" ]; then
    UNTRACKED_COUNT=$(echo "$UNTRACKED_EMPTY" | wc -l | tr -d ' ')
    log "🗑️  Removing $UNTRACKED_COUNT untracked empty files..."
    
    echo "$UNTRACKED_EMPTY" | while read -r file; do
        if [ -f "$file" ]; then
            rm "$file"
            log "   ✅ Removed: $file"
        fi
    done
    
    log "✅ Cleanup complete. Removed $UNTRACKED_COUNT empty files."
    notify "🧹 Cleaned up $UNTRACKED_COUNT empty files"
else
    log "ℹ️  No untracked empty files to remove."
fi

# Final summary
log "📊 Cleanup Summary:"
log "   • Total empty files found: $EMPTY_COUNT"
if [ ! -z "$TRACKED_EMPTY" ]; then
    log "   • Tracked (needs manual review): $(echo "$TRACKED_EMPTY" | wc -l | tr -d ' ')"
fi
if [ ! -z "$UNTRACKED_EMPTY" ]; then
    log "   • Untracked (auto-removed): $(echo "$UNTRACKED_EMPTY" | wc -l | tr -d ' ')"
fi

log "🏁 Empty file cleanup completed."
