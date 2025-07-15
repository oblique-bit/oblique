#!/usr/bin/env python3
"""
Comprehensive Plural Reference Finder for Oblique Design System

This script validates that all token names, file names, and documentation references
use singular naming conventions consistently throughout the design system.

VALIDATION SCOPE:
✅ Token references in JSON files (e.g., {ob.s.color.l1.interaction})
✅ File path references in documentation (e.g., semantic/color/)
✅ JSON token definitions and structures
✅ Documentation with explicit token mentions
✅ Explicit token paths like ob.s.color.l1.interaction
✅ File paths in documentation that reference token structure

EXCLUSIONS:
❌ Generic descriptive text (e.g., "Interactive elements with emphasis levels")
❌ $themes.json file (managed by Tokens Studio)
❌ Figma metadata and parent references
❌ Documentation titles and general descriptions where we don't explicitly mention files or tokens
❌ Historical reports (singular-plural-inconsistency-report.md)
❌ Script-generated report files
❌ Generic descriptions like "status colors communicate state"

VALIDATION CRITERIA:
✅ VALID: "Interactive elements with emphasis levels (high/low) and states"
❌ INVALID: "ob.s.color.l1.interactions" or "semantic/colors/" or "colors.json"

The key distinction: Generic descriptions about colors/elements are OK, 
but explicit token names and file references must always be singular.

USAGE:
    python3 scripts-custom/detect-plural-references.py
    
RECOMMENDED WORKFLOW:
    # Run after any changes to validate singular naming conventions
    npm run check:plural-references  # (if added to package.json)
    # OR
    python3 scripts-custom/detect-plural-references.py

SUCCESS CRITERIA:
When this script reports "NO PLURAL REFERENCES FOUND", the design system 
maintains consistent singular naming conventions throughout all:
- Token names and references  
- File and folder names
- Documentation that explicitly mentions tokens/files

STATUS: ✅ All plural references resolved as of July 11, 2025
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

class PluralFinder:
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir)
        self.issues = []
        
    def find_all_issues(self) -> List[Dict[str, str]]:
        """Find all plural references in the design system."""
        print("🔍 PLURAL REFERENCE FINDER")
        print("=" * 50)
        print("Checking token names, file names, and documentation references...")
        print()
        
        # Check JSON token files
        self._check_json_files()
        
        # Check documentation files
        self._check_documentation_files()
        
        # Check file and folder names
        self._check_file_names()
        
        return self.issues
    
    def _check_json_files(self):
        """Check JSON files for plural token references."""
        print("📄 Checking JSON token files...")
        
        json_files = list(self.base_dir.rglob("*.json"))
        
        for json_file in json_files:
            # Skip $themes.json (managed by Tokens Studio)
            if json_file.name.startswith('$'):
                continue
                
            # Skip files in _ignore-in-ds directory
            if '_ignore-in-ds' in str(json_file):
                continue
                
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Check for plural token references in $value fields
                self._check_token_references(content, str(json_file))
                
                # Check JSON structure for plural keys (excluding Figma metadata)
                data = json.loads(content)
                self._check_json_structure(data, str(json_file))
                
            except (json.JSONDecodeError, Exception) as e:
                print(f"  ⚠️  Error reading {json_file}: {e}")
    
    def _check_token_references(self, content: str, file_path: str):
        """Check for plural references in token values and explicit token paths."""
        # Pattern for token references like {ob.s.colors.l1.interaction}
        token_patterns = [
            r'\{ob\.p\.colors\.',  # Primitive colors (should be ob.p.color)
            r'\{ob\.s\.colors\.',  # Semantic colors (should be ob.s.color)
            r'\{ob\.c\.colors\.',  # Component colors (should be ob.c.color)
            r'\{ob\.h\.colors\.',  # HTML colors (should be ob.h.color)
            r'ob\.p\.colors\.',    # Direct primitive colors reference
            r'ob\.s\.colors\.',    # Direct semantic colors reference
            r'ob\.c\.colors\.',    # Direct component colors reference
            r'ob\.h\.colors\.',    # Direct HTML colors reference
            r'semantics/colors/',  # Should be semantic/color/
            r'primitives/colors/', # Should be primitive/color/
            r'components/colors/', # Should be component/color/
            r'semantic/colors/',   # Should be semantic/color/
            r'primitive/colors/',  # Should be primitive/color/
            r'component/colors/',  # Should be component/color/
        ]
        
        for pattern in token_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                # Find the line number
                line_num = content[:match.start()].count('\n') + 1
                line_content = content.split('\n')[line_num - 1].strip()
                
                self.issues.append({
                    'type': 'token_reference',
                    'file': file_path,
                    'line': line_num,
                    'content': line_content,
                    'issue': f"Plural token reference: {match.group()}"
                })
    
    def _check_json_structure(self, data: dict, file_path: str, path: str = ""):
        """Check JSON structure for plural keys (excluding Figma metadata)."""
        if isinstance(data, dict):
            for key, value in data.items():
                current_path = f"{path}.{key}" if path else key
                
                # Skip Figma metadata fields
                if key in ['parent', 'description', 'oldValue']:
                    continue
                    
                # Skip $description fields (documentation)
                if key.startswith('$'):
                    continue
                
                # Check for plural token names
                plural_patterns = [
                    r'^colors$',       # Root level "colors"
                    r'^components$',   # Root level "components"
                    r'^semantics$',    # Root level "semantics"
                    r'^primitives$',   # Root level "primitives"
                ]
                
                for pattern in plural_patterns:
                    if re.match(pattern, key):
                        self.issues.append({
                            'type': 'json_structure',
                            'file': file_path,
                            'path': current_path,
                            'issue': f"Plural key in JSON structure: '{key}'"
                        })
                
                # Recurse into nested objects
                if isinstance(value, dict):
                    self._check_json_structure(value, file_path, current_path)
    
    def _check_documentation_files(self):
        """Check documentation files for explicit token and file references."""
        print("📝 Checking documentation files...")
        
        doc_patterns = [
            "*.md",
            "*.txt", 
            "*.rst"
        ]
        
        doc_files = []
        for pattern in doc_patterns:
            doc_files.extend(self.base_dir.rglob(pattern))
        
        for doc_file in doc_files:
            # Skip script-generated report files
            if 'plural-references-report' in str(doc_file):
                continue
                
            # Skip historical reports that document old plural references
            if 'singular-plural-inconsistency-report' in str(doc_file):
                continue
                
            # Skip AI chat memory and historical reports
            if 'chat-memory' in str(doc_file) or 'team-reports' in str(doc_file):
                continue
                
            try:
                with open(doc_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    self._check_documentation_content(content, str(doc_file))
                    
            except Exception as e:
                print(f"  ⚠️  Error reading {doc_file}: {e}")
    
    def _check_documentation_content(self, content: str, file_path: str):
        """Check documentation content for explicit token and file references."""
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            # Skip generic descriptions and titles
            if self._is_generic_description(line):
                continue
                
            # Check for explicit token references (these must be singular)
            explicit_patterns = [
                r'ob\.p\.colors\.',    # Explicit primitive token reference
                r'ob\.s\.colors\.',    # Explicit semantic token reference  
                r'ob\.c\.colors\.',    # Explicit component token reference
                r'ob\.h\.colors\.',    # Explicit HTML token reference
                r'`semantics/colors/',  # File path reference in code blocks
                r'`primitives/colors/', # File path reference in code blocks
                r'`semantic/colors/',   # File path reference in code blocks
                r'`primitive/colors/',  # File path reference in code blocks
                r'`component/colors/',  # File path reference in code blocks
                r'`components/colors/', # File path reference in code blocks
                r'semantics/colors\.json', # JSON file reference
                r'primitives/colors\.json', # JSON file reference
                r'semantic/colors\.json',   # JSON file reference
                r'primitive/colors\.json',  # JSON file reference
                r'component/colors\.json',  # JSON file reference
                r'components/colors\.json', # JSON file reference
                r'colors\.json',           # Generic colors.json file reference
            ]
            
            for pattern in explicit_patterns:
                matches = re.finditer(pattern, line, re.IGNORECASE)
                for match in matches:
                    self.issues.append({
                        'type': 'documentation',
                        'file': file_path,
                        'line': line_num,
                        'content': line.strip(),
                        'issue': f"Plural reference in documentation: {match.group()}"
                    })
    
    def _is_generic_description(self, line: str) -> bool:
        """Check if a line contains generic description that should be excluded."""
        # Skip headings and titles
        if line.strip().startswith('#'):
            return True
            
        # Skip bullet points with generic descriptions (like the example in your request)
        if re.match(r'^\s*[-*]\s*\*\*\w+\s+Colors?\*\*\s*-', line):
            return True
            
        # Skip table headers and generic content
        generic_patterns = [
            r'status colors',
            r'interaction colors', 
            r'neutral colors',
            r'emphasis colors',
            r'semantic colors',
            r'primitive colors',
            r'component colors',
            r'Colors?\s+(communicate|provide|handle)',
            r'different\s+colors?',
            r'color\s+system',
            r'color\s+palette',
            r'color\s+tokens?',
            r'Interactive elements with emphasis levels',  # Specific example from your request
            r'elements with emphasis levels',
            r'and states \(',  # Pattern for "and states (hover, focus, active, disabled)"
            r'status\s+(states|information)',
            r'different\s+(types|kinds|levels)',
            r'various\s+(colors?|elements)',
        ]
        
        for pattern in generic_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                return True
                
        return False
    
    def _check_file_names(self):
        """Check file and folder names for plural patterns."""
        print("📁 Checking file and folder names...")
        
        # Check all files and directories
        all_paths = []
        all_paths.extend(self.base_dir.rglob("*"))
        
        plural_patterns = [
            r'/colors\.json$',      # File: colors.json (should be color.json)
            r'/colors/',            # Folder: colors/ (should be color/)
            r'/components\.json$',  # File: components.json
            r'/components/',        # Folder: components/
            r'/semantics\.json$',   # File: semantics.json
            r'/semantics/',         # Folder: semantics/
            r'/primitives\.json$',  # File: primitives.json  
            r'/primitives/',        # Folder: primitives/
        ]
        
        for path in all_paths:
            path_str = str(path)
            
            # Skip $themes.json and Tokens Studio files  
            if path.name.startswith('$') or 'tokens-studio' in path_str.lower():
                continue
                
            # Skip .git and node_modules
            if '.git/' in path_str or 'node_modules/' in path_str:
                continue
                
            # Skip AI chat memory and reports directories
            if 'chat-memory' in path_str or 'team-reports' in path_str:
                continue
            
            for pattern in plural_patterns:
                if re.search(pattern, path_str):
                    self.issues.append({
                        'type': 'file_name',
                        'file': path_str,
                        'issue': f"Plural in file/folder name: {path.name}"
                    })
    
    def print_report(self):
        """Print a comprehensive report of all plural references found."""
        if not self.issues:
            print("✅ NO PLURAL REFERENCES FOUND!")
            print("All token names, file names, and documentation references use singular naming.")
            return
            
        print(f"\n🚨 FOUND {len(self.issues)} PLURAL REFERENCES")
        print("=" * 50)
        
        # Group by type
        by_type = {}
        for issue in self.issues:
            issue_type = issue['type']
            if issue_type not in by_type:
                by_type[issue_type] = []
            by_type[issue_type].append(issue)
        
        # Print each type
        for issue_type, issues in by_type.items():
            print(f"\n📋 {issue_type.upper().replace('_', ' ')} ({len(issues)} issues)")
            print("-" * 30)
            
            for issue in issues:
                if issue_type == 'token_reference':
                    print(f"  📄 {issue['file']}:{issue['line']}")
                    print(f"     {issue['issue']}")
                    print(f"     Content: {issue['content']}")
                    
                elif issue_type == 'json_structure':
                    print(f"  📄 {issue['file']}")
                    print(f"     Path: {issue['path']}")
                    print(f"     {issue['issue']}")
                    
                elif issue_type == 'documentation':
                    print(f"  📝 {issue['file']}:{issue['line']}")
                    print(f"     {issue['issue']}")
                    print(f"     Content: {issue['content']}")
                    
                elif issue_type == 'file_name':
                    print(f"  📁 {issue['file']}")
                    print(f"     {issue['issue']}")
                
                print()
    
    def save_report(self, output_file: str = "plural-references-report.txt"):
        """Save the report to a file."""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("PLURAL REFERENCE FINDER REPORT\n")
            f.write("=" * 50 + "\n\n")
            
            if not self.issues:
                f.write("✅ NO PLURAL REFERENCES FOUND!\n")
                f.write("All token names, file names, and documentation references use singular naming.\n")
                return
                
            f.write(f"Found {len(self.issues)} plural references:\n\n")
            
            for issue in self.issues:
                f.write(f"Type: {issue['type']}\n")
                f.write(f"File: {issue['file']}\n")
                if 'line' in issue:
                    f.write(f"Line: {issue['line']}\n")
                if 'path' in issue:
                    f.write(f"Path: {issue['path']}\n")
                f.write(f"Issue: {issue['issue']}\n")
                if 'content' in issue:
                    f.write(f"Content: {issue['content']}\n")
                f.write("-" * 40 + "\n\n")


def main():
    """Main function to run the plural finder."""
    finder = PluralFinder()
    issues = finder.find_all_issues()
    finder.print_report()
    
    # Save report
    if issues:
        finder.save_report()
        print(f"\n📊 Report saved to: plural-references-report.txt")
    
    print(f"\n🎯 SUMMARY: {len(issues)} plural references found")
    
    return len(issues) == 0


if __name__ == "__main__":
    success = main()
    if not success:
        exit(1)
