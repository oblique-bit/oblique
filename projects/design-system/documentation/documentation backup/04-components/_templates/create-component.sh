#!/bin/bash

# Component Template Creation Script
# Creates a new component folder structure from templates

set -e

# Check if component name is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <component-name>"
    echo "Example: $0 input-field"
    exit 1
fi

COMPONENT_NAME_KEBAB="$1"
COMPONENT_NAME_PASCAL=$(echo "$1" | sed -r 's/(^|-)([a-z])/\U\2/g')
CURRENT_DATE=$(date +"%Y-%m-%d")
CURRENT_TIMESTAMP=$(date +"%Y%m%d_%H%M")

# Find the next available component number
COMPONENTS_DIR="/Users/davorradisic/vc git repo bit/oblique/projects/design-system/documentation/04-components"
NEXT_NUMBER=$(find "$COMPONENTS_DIR" -maxdepth 1 -name "[0-9][0-9]-*" -type d | wc -l | awk '{printf "%02d", $1+1}')

COMPONENT_DIR="${COMPONENTS_DIR}/${NEXT_NUMBER}-${COMPONENT_NAME_KEBAB}"

echo "Creating component: $COMPONENT_NAME_PASCAL"
echo "Component directory: $COMPONENT_DIR"

# Create component directory
mkdir -p "$COMPONENT_DIR"

# Copy and customize template files
TEMPLATE_DIR="${COMPONENTS_DIR}/_templates"

# Copy main documentation files
cp "$TEMPLATE_DIR/README-template.md" "$COMPONENT_DIR/README.md"
cp "$TEMPLATE_DIR/01-overview-template.md" "$COMPONENT_DIR/01-overview.md"
cp "$TEMPLATE_DIR/02-architecture-template.md" "$COMPONENT_DIR/02-architecture.md"
cp "$TEMPLATE_DIR/03-implementation-template.md" "$COMPONENT_DIR/03-implementation.md"
cp "$TEMPLATE_DIR/04-guidelines-template.md" "$COMPONENT_DIR/04-guidelines.md"

# Copy research structure
cp -r "$TEMPLATE_DIR/_research-template" "$COMPONENT_DIR/_research"

# Copy reports structure  
cp -r "$TEMPLATE_DIR/_reports-template" "$COMPONENT_DIR/_reports"

# Replace placeholders in all copied files
find "$COMPONENT_DIR" -name "*.md" -type f -exec sed -i '' "s/{COMPONENT_NAME}/$COMPONENT_NAME_PASCAL/g" {} \;
find "$COMPONENT_DIR" -name "*.md" -type f -exec sed -i '' "s/{component-name}/$COMPONENT_NAME_KEBAB/g" {} \;
find "$COMPONENT_DIR" -name "*.md" -type f -exec sed -i '' "s/{DATE}/$CURRENT_DATE/g" {} \;
find "$COMPONENT_DIR" -name "*.md" -type f -exec sed -i '' "s/{TIMESTAMP}/$CURRENT_TIMESTAMP/g" {} \;

echo "✅ Component template created successfully!"
echo ""
echo "Next steps:"
echo "1. Edit the documentation files to add component-specific content"
echo "2. Replace remaining placeholders with actual content"
echo "3. Add research documents to _research/ folders"
echo "4. Set up validation reports in _reports/ folders"
echo ""
echo "Template files created:"
echo "- README.md (entry point)"
echo "- 01-overview.md (component introduction)"
echo "- 02-architecture.md (design decisions)"
echo "- 03-implementation.md (developer guide)"
echo "- 04-guidelines.md (usage guidelines)"
echo "- _research/ (research folder structure)"
echo "- _reports/ (validation reports structure)"
