#!/bin/bash

# Set colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking for modifications to protected files...${NC}"
echo -e "${YELLOW}IMPORTANT: DO NOT MODIFY package.json WITHOUT APPROVAL${NC}"

# List of protected files
PROTECTED_FILES=(
  "package.json"
  "ng-package.json"
  "tsconfig.lib.json"
  "tsconfig.lib.prod.json"
  "tsconfig.spec.json"
)

# Check each file
MODIFIED=0
for file in "${PROTECTED_FILES[@]}"; do
  if git diff --name-only | grep -q "$file"; then
    echo -e "${RED}WARNING: Protected file '$file' has been modified!${NC}"
    echo -e "${RED}This file should not be changed without team approval.${NC}"
    MODIFIED=1
  fi
done

if [ $MODIFIED -eq 0 ]; then
  echo -e "${GREEN}No protected files have been modified. Safe to proceed.${NC}"
fi
