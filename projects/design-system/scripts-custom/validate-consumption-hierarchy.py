#!/usr/bin/env python3
"""
Validate consumption hierarchy in s0/s1/s2/s3 semantic color sub-levels.

This script ensures proper token consumption patterns across the design system,
validating that components follow the correct hierarchical reference chain while
allowing legitimate exceptions for s0 static token consumption.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple, Any, Union

class TokenConsumptionValidator:
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.src_path = self.root_path / "src"
        self.errors = []
        self.warnings = []
        
        # Patterns for token references
        self.token_reference_pattern = re.compile(r'\{([^}]+)\}')
        
        # S0 static token exceptions - these are allowed to be consumed at higher levels
        self.s0_static_exceptions = {
            'ob.s.color.static.no-color',    # Transparent/no-color use cases
            'ob.s.color.static.brand',       # Brand identity use cases
        }
        
        # Allowed consumption contexts for s0 static tokens
        self.s0_allowed_contexts = {
            's2.color.interaction',          # s2 interaction indicators
            's3.color.emphasis',             # s3 emphasis layers
            's3.color.interaction',          # s3 interaction states
            'c.',                           # HTML component definitions
            'shadow',                       # Shadow definitions
            'border',                       # Border definitions
        }

    def find_token_files(self) -> List[Path]:
        """Find all JSON token files in the project."""
        token_files = []
        
        # Search in themes directory
        themes_path = self.src_path / "lib" / "themes"
        if themes_path.exists():
            token_files.extend(themes_path.rglob("*.json"))
        
        # Search in other potential token locations
        for pattern in ["**/*token*.json", "**/semantic/**/*.json", "**/primitive/**/*.json"]:
            token_files.extend(self.src_path.rglob(pattern))
        
        return list(set(token_files))  # Remove duplicates

    def extract_token_references(self, value: Any) -> List[str]:
        """Extract all token references from a value."""
        if isinstance(value, str):
            matches = self.token_reference_pattern.findall(value)
            return matches
        elif isinstance(value, dict):
            refs = []
            for v in value.values():
                refs.extend(self.extract_token_references(v))
            return refs
        elif isinstance(value, list):
            refs = []
            for item in value:
                refs.extend(self.extract_token_references(item))
            return refs
        return []

    def parse_token_file(self, file_path: Path) -> Dict[str, Any]:
        """Parse a token JSON file and extract token definitions."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"JSON parse error in {file_path}: {e}")
            return {}
        except Exception as e:
            self.errors.append(f"Error reading {file_path}: {e}")
            return {}

    def flatten_tokens(self, data: Union[Dict, List, Any], prefix: str = "") -> Dict[str, Any]:
        """Flatten nested token structure into dot notation."""
        tokens = {}
        
        if isinstance(data, dict):
            for key, value in data.items():
                current_path = f"{prefix}.{key}" if prefix else key
                
                if isinstance(value, dict):
                    if "$value" in value:
                        # This is a token definition
                        tokens[current_path] = value
                    else:
                        # Continue flattening
                        tokens.update(self.flatten_tokens(value, current_path))
        elif isinstance(data, list):
            # Handle array structures - skip them as they don't contain token definitions
            pass
        
        return tokens

    def get_token_level(self, token_name: str) -> str:
        """Determine the hierarchical level of a token."""
        if token_name.startswith('ob.p.'):
            return 'primitive'
        elif token_name.startswith('ob.s1.') or token_name.startswith('ob.s.color.l1.'):
            return 's1'
        elif token_name.startswith('ob.s2.') or token_name.startswith('ob.s.color.l2.'):
            return 's2'
        elif token_name.startswith('ob.s3.') or token_name.startswith('ob.s.color.l3.'):
            return 's3'
        elif token_name.startswith('ob.s.color.static.'):
            return 's0-static'  # Static color tokens
        elif token_name.startswith('ob.s.'):
            return 's0'  # Other semantic tokens (typography, spacing, etc.)
        elif token_name.startswith('ob.c.'):
            return 'component'
        elif token_name.startswith('ob.h.'):
            return 'html'  # HTML layer
        elif token_name.startswith('r13.'):
            return 'component'  # Legacy component tokens
        else:
            return 'unknown'

    def is_s0_static_token(self, token_name: str) -> bool:
        """Check if token is an s0 static token."""
        return token_name in self.s0_static_exceptions

    def is_s0_consumption_allowed(self, consuming_token: str, consumed_token: str) -> bool:
        """Check if s0 static token consumption is allowed in this context."""
        if not self.is_s0_static_token(consumed_token):
            return False
        
        # Check if consuming token is in allowed contexts
        for context in self.s0_allowed_contexts:
            if context in consuming_token:
                return True
        
        return False

    def validate_consumption_hierarchy(self, all_tokens: Dict[str, Any]) -> None:
        """Validate token consumption hierarchy across all tokens."""
        
        for token_name, token_data in all_tokens.items():
            token_level = self.get_token_level(token_name)
            
            # Extract all referenced tokens
            references = self.extract_token_references(token_data.get('$value', ''))
            
            for ref_token in references:
                ref_level = self.get_token_level(ref_token)
                
                # Core validation rules
                self._validate_core_hierarchy_rules(token_name, token_level, ref_token, ref_level)
                
                # S0 static token exception validation
                self._validate_s0_static_exceptions(token_name, token_level, ref_token, ref_level)

    def _validate_core_hierarchy_rules(self, token_name: str, token_level: str, ref_token: str, ref_level: str) -> None:
        """Validate core hierarchy rules."""
        
        # Rule 1: Components must never consume primitives directly
        if token_level in ['component', 'html'] and ref_level == 'primitive':
            self.errors.append(
                f"HIERARCHY VIOLATION: Component '{token_name}' directly consumes primitive '{ref_token}'. "
                f"Components must consume semantic tokens (s0/s2/s3) only."
            )
        
        # Rule 2: Components must never consume s1 tokens
        if token_level in ['component', 'html'] and ref_level == 's1':
            self.errors.append(
                f"S1 CONSUMPTION VIOLATION: Component '{token_name}' consumes s1 token '{ref_token}'. "
                f"Components cannot consume s1 tokens (lightness layer)."
            )

    def _validate_s0_static_exceptions(self, token_name: str, token_level: str, ref_token: str, ref_level: str) -> None:
        """Validate s0 static token exception rules."""
        
        if ref_level == 's0-static':
            # This is s0 static token consumption - check if allowed
            if not self.is_s0_consumption_allowed(token_name, ref_token):
                self.warnings.append(
                    f"S0 STATIC CONSUMPTION: Token '{token_name}' consumes s0 static token '{ref_token}'. "
                    f"Verify this is a legitimate use case (transparent/brand/interaction context)."
                )

    def _validate_semantic_alignment(self, token_name: str, token_level: str, ref_token: str, ref_level: str) -> None:
        """Validate semantic alignment rules."""
        
        if token_level != 'component':
            return
        
        # Interactive component rules
        if self._is_interactive_component(token_name):
            if ref_level in ['s2', 's3'] and 'neutral' in ref_token:
                self.errors.append(
                    f"SEMANTIC MISALIGNMENT: Interactive component '{token_name}' consumes neutral token '{ref_token}'. "
                    f"Interactive components should use interaction tokens with emphasis:low for monochromatic appearance."
                )
            
            if ref_level == 's2' and 'interaction' in ref_token:
                self.warnings.append(
                    f"LIMITED THEMING: Interactive component '{token_name}' consumes s2 interaction token '{ref_token}'. "
                    f"Consider s3 interaction tokens for full emphasis theming support."
                )
        
        # Status component rules
        elif self._is_status_component(token_name):
            if ref_level in ['s2', 's3'] and not any(x in ref_token for x in ['status', 'static']):
                self.warnings.append(
                    f"SEMANTIC MISALIGNMENT: Status component '{token_name}' should consume status tokens. "
                    f"Currently consumes '{ref_token}'."
                )

    def _is_interactive_component(self, token_name: str) -> bool:
        """Check if component is interactive based on name patterns."""
        interactive_patterns = ['button', 'link', 'stepper', 'tab', 'nav', 'menu']
        return any(pattern in token_name.lower() for pattern in interactive_patterns)

    def _is_status_component(self, token_name: str) -> bool:
        """Check if component is status-based based on name patterns."""
        status_patterns = ['badge', 'infobox', 'pill', 'tooltip', 'alert', 'notification']
        return any(pattern in token_name.lower() for pattern in status_patterns)

    def validate_s0_s1_s2_s3_hierarchy(self) -> None:
        """Main validation method for s0/s1/s2/s3 semantic color hierarchy."""
        print("🔍 Validating consumption hierarchy in s0/s1/s2/s3 semantic color sub-levels...")
        
        # Find all token files
        token_files = self.find_token_files()
        print(f"📁 Found {len(token_files)} token files")
        
        # Parse and collect all tokens
        all_tokens = {}
        for file_path in token_files:
            tokens_data = self.parse_token_file(file_path)
            flattened = self.flatten_tokens(tokens_data)
            all_tokens.update(flattened)
        
        print(f"🎯 Analyzing {len(all_tokens)} tokens")
        
        # Validate consumption hierarchy
        self.validate_consumption_hierarchy(all_tokens)
        
        # Report results
        self.report_results()

    def report_results(self) -> None:
        """Report validation results."""
        print("\n" + "="*80)
        print("📊 VALIDATION RESULTS")
        print("="*80)
        
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for i, error in enumerate(self.errors, 1):
                print(f"{i:2d}. {error}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for i, warning in enumerate(self.warnings, 1):
                print(f"{i:2d}. {warning}")
        
        if not self.errors and not self.warnings:
            print("\n✅ All token consumption patterns are valid!")
        
        print(f"\n📈 SUMMARY:")
        print(f"   • Errors: {len(self.errors)}")
        print(f"   • Warnings: {len(self.warnings)}")
        
        if self.errors:
            print(f"\n💡 S0 STATIC TOKEN EXCEPTIONS ALLOWED:")
            for token in sorted(self.s0_static_exceptions):
                print(f"   • {token}")
            print(f"\n💡 S0 CONSUMPTION CONTEXTS ALLOWED:")
            for context in sorted(self.s0_allowed_contexts):
                print(f"   • {context}")

def main():
    """Main execution function."""
    # Get the project root (assuming script is in scripts-custom/)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # Initialize validator
    validator = TokenConsumptionValidator(str(project_root))
    
    # Run validation
    validator.validate_s0_s1_s2_s3_hierarchy()
    
    # Exit with error code if validation failed
    if validator.errors:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
