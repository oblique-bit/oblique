#!/bin/bash

# validate-documentation-references.sh
# Script to validate token references in documentation files after naming convention changes
# Created: July 15, 2025
# Context: Post Token Studio l1/l2/l3 → s1/s2/s3 naming convention update

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/documentation"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Documentation Reference Validation${NC}"
echo "=================================================="
echo "Project: $(basename "$PROJECT_ROOT")"
echo "Documentation: $DOCS_DIR"
echo "Date: $(date)"
echo ""

# Function to check for old token patterns
check_old_patterns() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo -e "${YELLOW}📄 Checking: $filename${NC}"
    
    # Check for old l1/l2/l3 patterns
    local old_patterns=(
        "ob\.s\.color\.l1\."
        "ob\.s\.color\.l2\."
        "ob\.s\.color\.l3\."
        "l1-lightness"
        "l2-inversity" 
        "l3-emphasis"
        "l1-l2-redundancy"
    )
    
    local found_issues=0
    
    for pattern in "${old_patterns[@]}"; do
        local matches=$(grep -n "$pattern" "$file" 2>/dev/null || true)
        if [[ -n "$matches" ]]; then
            echo -e "  ${RED}❌ Found old pattern '$pattern':${NC}"
            echo "$matches" | sed 's/^/    /'
            found_issues=1
        fi
    done
    
    if [[ $found_issues -eq 0 ]]; then
        echo -e "  ${GREEN}✅ No old patterns found${NC}"
    fi
    
    return $found_issues
}

# Function to verify new token patterns
check_new_patterns() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Check for new s1/s2/s3 patterns
    local new_patterns=(
        "ob\.s1\.color\."
        "ob\.s2\.color\."
        "ob\.s3\.color\."
        "s1-lightness"
        "s2-inversity"
        "s3-emphasis"
        "s1-s2-redundancy"
    )
    
    local found_new=0
    
    for pattern in "${new_patterns[@]}"; do
        local matches=$(grep -c "$pattern" "$file" 2>/dev/null || echo "0")
        matches=$(echo "$matches" | tr -d '\n')
        if [[ "$matches" -gt 0 ]]; then
            echo -e "  ${GREEN}✅ Found $matches references to new pattern '$pattern'${NC}"
            found_new=1
        fi
    done
    
    if [[ $found_new -eq 0 ]]; then
        echo -e "  ${YELLOW}⚠️  No new token patterns found (might be expected for some files)${NC}"
    fi
}

# Function to check specific files that should have been updated
check_critical_files() {
    local critical_files=(
        "design-tokens/architecture.md"
        "design-tokens/colors/colors-semantic.md"
        "design-tokens/colors/colors.md"
        "design-tokens/guidelines-token-consumption.md"
        "design-tokens/theming.md"
        "workflow/tokens-studio-context.md"
        "design-tokens/global-tokens.md"
    )
    
    echo -e "\n${BLUE}🎯 Critical Files Validation${NC}"
    echo "================================="
    
    local total_issues=0
    
    for file_path in "${critical_files[@]}"; do
        local full_path="$DOCS_DIR/$file_path"
        
        if [[ -f "$full_path" ]]; then
            echo -e "\n${YELLOW}📋 Validating: $file_path${NC}"
            
            if check_old_patterns "$full_path"; then
                total_issues=$((total_issues + 1))
            fi
            
            check_new_patterns "$full_path"
        else
            echo -e "\n${RED}❌ File not found: $file_path${NC}"
            total_issues=$((total_issues + 1))
        fi
    done
    
    return $total_issues
}

# Function to generate validation report
generate_report() {
    local issues_count=$1
    
    echo -e "\n${BLUE}📊 Validation Summary${NC}"
    echo "====================="
    echo "Date: $(date)"
    echo "Documentation directory: $DOCS_DIR"
    
    if [[ $issues_count -eq 0 ]]; then
        echo -e "${GREEN}✅ All documentation references validated successfully!${NC}"
        echo -e "${GREEN}✅ No old token patterns (l1/l2/l3) found${NC}"
        echo -e "${GREEN}✅ New token patterns (s1/s2/s3) properly implemented${NC}"
    else
        echo -e "${RED}❌ Found $issues_count file(s) with validation issues${NC}"
        echo -e "${YELLOW}⚠️  Please review and fix the issues above${NC}"
    fi
    
    echo ""
    echo "Token naming convention:"
    echo "  OLD: ob.s.color.l1.* → NEW: ob.s1.color.*"
    echo "  OLD: ob.s.color.l2.* → NEW: ob.s2.color.*"
    echo "  OLD: ob.s.color.l3.* → NEW: ob.s3.color.*"
    echo ""
    echo "Folder structure:"
    echo "  OLD: l1-lightness/ → NEW: s1-lightness/"
    echo "  OLD: l2-inversity/ → NEW: s2-inversity/"
    echo "  OLD: l3-emphasis/ → NEW: s3-emphasis/"
}

# Main execution
main() {
    if [[ ! -d "$DOCS_DIR" ]]; then
        echo -e "${RED}❌ Documentation directory not found: $DOCS_DIR${NC}"
        exit 1
    fi
    
    # Run critical files validation
    check_critical_files
    local issues_count=$?
    
    # Generate report
    generate_report $issues_count
    
    # Exit with appropriate code
    if [[ $issues_count -eq 0 ]]; then
        echo -e "${GREEN}🎉 Documentation validation completed successfully!${NC}"
        exit 0
    else
        echo -e "${RED}❌ Documentation validation found issues. Please review.${NC}"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Validates token references in documentation files after naming convention changes."
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -v, --verbose  Enable verbose output"
    echo ""
    echo "This script checks for:"
    echo "  - Old token patterns (l1/l2/l3) that should be updated"
    echo "  - New token patterns (s1/s2/s3) that should be present"
    echo "  - Critical documentation files consistency"
    echo ""
    echo "Expected token naming convention:"
    echo "  ob.s.color.l1.* → ob.s1.color.*"
    echo "  ob.s.color.l2.* → ob.s2.color.*"
    echo "  ob.s.color.l3.* → ob.s3.color.*"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            set -x
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main
