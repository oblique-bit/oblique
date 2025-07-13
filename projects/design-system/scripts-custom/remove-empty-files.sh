#!/bin/bash

# Automated Empty File Cleanup Script
# This script checks for and removes untracked empty files to prevent clutter

PROJECT_DIR="$(dirname "$0")/.."
cd "$PROJECT_DIR" || exit 1

echo "🔍 Searching for empty files in documentation directory..."

# Find all empty files in documentation directory
DOCUMENTATION_DIR="$PROJECT_DIR/documentation"
# Use relative paths for better readability
cd "$PROJECT_DIR" || exit 1
EMPTY_FILES_LIST=$(find "documentation" -type f -empty 2>/dev/null)

# Also check untracked files via git (original functionality)
UNTRACKED_FILES=$(git status --porcelain | grep "^??" | cut -c4-)

# Combine the lists (untracked + empty docs files)
ALL_FILES="$EMPTY_FILES_LIST
$UNTRACKED_FILES"

if [ -z "$ALL_FILES" ]; then
    echo "✅ No empty files found"
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
                   [[ "$file" == *"static.json" && "$file" == *"global"* ]] || \
                   # Always remove files directly in documentation folder (only subfolders allowed)
                   [[ "$file" == "documentation/"*.md ]] || \
                   [[ "$file" == "documentation/"*.json ]] || \
                   [[ "$file" == "documentation/"*.js ]] || \
                   [[ "$file" == "documentation/"*.ts ]] || \
                   # Original patterns
                   [[ "$file" == *"documentation/semantic-colors-"* ]] || \
                   [[ "$file" == *"documentation/design-tokens/colors/colors-semantic-"* ]] || \
                   [[ "$file" == *"documentation/status-token-classification.md"* ]] || \
                   [[ "$file" == *"documentation/competitive-analysis.md"* ]] || \
                   [[ "$file" == *"documentation/naming-conventions.md"* ]]; then
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
done <<< "$ALL_FILES"

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
