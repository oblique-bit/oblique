#!/bin/bash

# Automated Empty File Cleanup Script
# This script checks for and removes untracked empty files to prevent clutter

PROJECT_DIR="$(dirname "$0")/.."
cd "$PROJECT_DIR" || exit 1

echo "🔍 Searching for empty untracked files..."

# Get list of untracked files
UNTRACKED_FILES=$(git status --porcelain | grep "^??" | cut -c4-)

if [ -z "$UNTRACKED_FILES" ]; then
    echo "✅ No untracked files found"
    exit 0
fi

# Check each untracked file
EMPTY_FILES=()
REMOVED_FILES=()

while IFS= read -r file; do
    if [ -f "$file" ] && [ ! -s "$file" ]; then
        # File exists and is empty
        EMPTY_FILES+=("$file")
        
        # Check if it's a known pattern that should be removed
        case "$file" in
            *.md|*.js|*.json|*.ts|*.css|*.html)
                if [[ "$file" == *"SCOPED_THEMES_REPORT"* ]] || \
                   [[ "$file" == *"clean-inverse-tokens"* ]] || \
                   [[ "$file" == *"AI_COMMANDS"* ]] || \
                   [[ "$file" == *"TOKEN_"* ]] || \
                   [[ "$file" == *"static.json" && "$file" == *"global"* ]]; then
                    echo "🗑️  Removing empty file: $file"
                    rm "$file"
                    REMOVED_FILES+=("$file")
                else
                    echo "⚠️  Found empty file (review needed): $file"
                fi
                ;;
            *)
                echo "⚠️  Found empty file (unknown type): $file"
                ;;
        esac
    fi
done <<< "$UNTRACKED_FILES"

# Log the cleanup if any files were removed
if [ ${#REMOVED_FILES[@]} -gt 0 ]; then
    echo ""
    echo "📝 Cleanup summary:"
    for file in "${REMOVED_FILES[@]}"; do
        echo "  ✅ Removed: $file"
    done
    
    echo "� Cleaned up ${#REMOVED_FILES[@]} empty files"
fi

# Summary
if [ ${#EMPTY_FILES[@]} -gt 0 ]; then
    echo ""
    echo "📊 Summary:"
    echo "   - Empty files found: ${#EMPTY_FILES[@]}"
    echo "   - Auto-removed: ${#REMOVED_FILES[@]}"
    echo "   - Require review: $((${#EMPTY_FILES[@]} - ${#REMOVED_FILES[@]}))"
else
    echo "✅ No empty files found"
fi
