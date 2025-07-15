#!/bin/bash

# Documentation Structure Enforcement Script
# This script ensures that the documentation folder contains only subdirectories (no files)
# Per requirement: "in documentation folder there must be no file, but only folders"

PROJECT_DIR="$(dirname "$0")/.."
DOCUMENTATION_DIR="$PROJECT_DIR/documentation"

echo "🔍 Enforcing documentation folder structure rules..."
echo "   Rule: documentation folder should only contain subfolders, not files"

# Check if the documentation directory exists
if [ ! -d "$DOCUMENTATION_DIR" ]; then
    echo "❌ Error: Documentation directory not found at $DOCUMENTATION_DIR"
    exit 1
fi

# Get a list of files in the documentation directory (not directories)
FILES_TO_REMOVE=$(find "$DOCUMENTATION_DIR" -maxdepth 1 -type f)

# Check if there are any files to remove
if [ -z "$FILES_TO_REMOVE" ]; then
    echo "✅ Documentation structure is already correct (no files at root level)"
    exit 0
fi

# Count the files
FILE_COUNT=$(echo "$FILES_TO_REMOVE" | wc -l)
echo "⚠️ Found $FILE_COUNT files directly in documentation folder (should be in subfolders)"

# Process each file
REMOVED_FILES=()
PRESERVED_FILES=()

while IFS= read -r file; do
    # Skip .DS_Store and other hidden files
    if [[ "$(basename "$file")" == .* ]]; then
        echo "⏩ Skipping hidden file: $(basename "$file")"
        continue
    fi
    
    echo "🗑️ Removing file: $file"
    rm "$file"
    REMOVED_FILES+=("$file")
done <<< "$FILES_TO_REMOVE"

# Log the cleanup if any files were removed
if [ ${#REMOVED_FILES[@]} -gt 0 ]; then
    echo ""
    echo "📝 Cleanup summary:"
    for file in "${REMOVED_FILES[@]}"; do
        echo "  ✅ Removed: $(basename "$file")"
    done
    
    echo "🧹 Cleaned up ${#REMOVED_FILES[@]} files from documentation root folder"
    echo "✅ Documentation structure now follows the rule: only subfolders, no files"
else
    echo "ℹ️ No files were removed"
fi
