#!/usr/bin/env python3
"""
Script Redundancy Analyzer
==========================

Analyzes redundancy and overlap across design system scripts in scripts-custom/.
Identifies potential consolidation opportunities, duplicated functionality,
and recommends optimization strategies.

Features:
- Function/method analysis across JavaScript and Python scripts
- Import/dependency overlap detection
- Token validation redundancy identification
- Similar purpose script grouping
- Consolidation recommendations

Usage:
    python3 scripts-custom/analyze-script-redundancy.py
"""

import os
import re
import ast
import json
from pathlib import Path
from collections import defaultdict, Counter
from typing import Dict, List, Set, Tuple

class ScriptAnalyzer:
    def __init__(self):
        self.scripts_dir = Path(__file__).parent
        self.analysis_results = {
            'python_scripts': {},
            'javascript_scripts': {},
            'shell_scripts': {},
            'redundancy_analysis': {},
            'consolidation_opportunities': []
        }
        
    def analyze_all_scripts(self):
        """Main analysis entry point."""
        print("🔍 SCRIPT REDUNDANCY ANALYZER")
        print("=" * 50)
        
        # Analyze each script type
        self._analyze_python_scripts()
        self._analyze_javascript_scripts()
        self._analyze_shell_scripts()
        
        # Cross-script analysis
        self._detect_redundancy()
        self._identify_consolidation_opportunities()
        
        # Generate report
        self._generate_report()
        
    def _analyze_python_scripts(self):
        """Analyze Python scripts for functions, imports, and patterns."""
        python_files = list(self.scripts_dir.glob("*.py"))
        
        for py_file in python_files:
            if py_file.name == "__init__.py" or py_file.name == Path(__file__).name:
                continue
                
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                analysis = self._analyze_python_content(content, py_file.name)
                self.analysis_results['python_scripts'][py_file.name] = analysis
                
            except Exception as e:
                print(f"⚠️  Error analyzing {py_file.name}: {e}")
                
    def _analyze_python_content(self, content: str, filename: str) -> Dict:
        """Deep analysis of Python script content."""
        try:
            tree = ast.parse(content)
        except SyntaxError:
            return {'error': 'Syntax error in file'}
            
        analysis = {
            'functions': [],
            'classes': [],
            'imports': [],
            'token_patterns': [],
            'validation_patterns': [],
            'file_operations': [],
            'json_operations': [],
            'docstring': '',
            'purpose_keywords': set(),
            'line_count': len(content.splitlines())
        }
        
        # Extract docstring
        if (tree.body and isinstance(tree.body[0], ast.Expr) 
            and isinstance(tree.body[0].value, ast.Constant)):
            analysis['docstring'] = tree.body[0].value.value
            
        # Walk the AST
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                analysis['functions'].append({
                    'name': node.name,
                    'args': [arg.arg for arg in node.args.args],
                    'line': node.lineno
                })
                
            elif isinstance(node, ast.ClassDef):
                analysis['classes'].append({
                    'name': node.name,
                    'line': node.lineno
                })
                
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        analysis['imports'].append(alias.name)
                else:
                    module = node.module or ''
                    for alias in node.names:
                        analysis['imports'].append(f"{module}.{alias.name}")
                        
        # Pattern detection
        analysis['token_patterns'] = self._find_token_patterns(content)
        analysis['validation_patterns'] = self._find_validation_patterns(content)
        analysis['file_operations'] = self._find_file_operations(content)
        analysis['json_operations'] = self._find_json_operations(content)
        analysis['purpose_keywords'] = self._extract_purpose_keywords(content)
        
        return analysis
        
    def _analyze_javascript_scripts(self):
        """Analyze JavaScript/Node.js scripts."""
        js_files = list(self.scripts_dir.glob("*.js"))
        
        for js_file in js_files:
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                analysis = self._analyze_javascript_content(content, js_file.name)
                self.analysis_results['javascript_scripts'][js_file.name] = analysis
                
            except Exception as e:
                print(f"⚠️  Error analyzing {js_file.name}: {e}")
                
    def _analyze_javascript_content(self, content: str, filename: str) -> Dict:
        """Analyze JavaScript script content."""
        analysis = {
            'functions': [],
            'imports': [],
            'requires': [],
            'exports': [],
            'token_patterns': [],
            'validation_patterns': [],
            'file_operations': [],
            'json_operations': [],
            'purpose_keywords': set(),
            'line_count': len(content.splitlines())
        }
        
        # Function detection
        func_patterns = [
            r'function\s+(\w+)\s*\(',
            r'const\s+(\w+)\s*=\s*\(',
            r'let\s+(\w+)\s*=\s*\(',
            r'(\w+)\s*:\s*function\s*\(',
            r'(\w+)\s*=>\s*{?'
        ]
        
        for pattern in func_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                analysis['functions'].append({
                    'name': match.group(1),
                    'type': 'function',
                    'line': content[:match.start()].count('\n') + 1
                })
                
        # Import/require detection
        require_matches = re.finditer(r'require\([\'"]([^\'"]+)[\'"]\)', content)
        for match in require_matches:
            analysis['requires'].append(match.group(1))
            
        import_matches = re.finditer(r'import\s+.*\s+from\s+[\'"]([^\'"]+)[\'"]', content)
        for match in import_matches:
            analysis['imports'].append(match.group(1))
            
        # Pattern detection
        analysis['token_patterns'] = self._find_token_patterns(content)
        analysis['validation_patterns'] = self._find_validation_patterns(content)
        analysis['file_operations'] = self._find_file_operations(content)
        analysis['json_operations'] = self._find_json_operations(content)
        analysis['purpose_keywords'] = self._extract_purpose_keywords(content)
        
        return analysis
        
    def _analyze_shell_scripts(self):
        """Analyze shell scripts."""
        shell_files = list(self.scripts_dir.glob("*.sh"))
        
        for sh_file in shell_files:
            try:
                with open(sh_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                analysis = self._analyze_shell_content(content, sh_file.name)
                self.analysis_results['shell_scripts'][sh_file.name] = analysis
                
            except Exception as e:
                print(f"⚠️  Error analyzing {sh_file.name}: {e}")
                
    def _analyze_shell_content(self, content: str, filename: str) -> Dict:
        """Analyze shell script content."""
        analysis = {
            'functions': [],
            'commands': [],
            'file_operations': [],
            'git_operations': [],
            'purpose_keywords': set(),
            'line_count': len(content.splitlines())
        }
        
        # Function detection
        func_matches = re.finditer(r'(\w+)\s*\(\)\s*{', content)
        for match in func_matches:
            analysis['functions'].append({
                'name': match.group(1),
                'line': content[:match.start()].count('\n') + 1
            })
            
        # Command detection
        common_commands = ['find', 'grep', 'sed', 'awk', 'rm', 'mv', 'cp', 'ls', 'git']
        for cmd in common_commands:
            if cmd in content:
                analysis['commands'].append(cmd)
                
        # Specific operation detection
        if re.search(r'find.*-type\s+f', content):
            analysis['file_operations'].append('find_files')
        if re.search(r'rm\s+', content):
            analysis['file_operations'].append('remove_files')
        if re.search(r'git\s+', content):
            analysis['git_operations'].append('git_operations')
            
        analysis['purpose_keywords'] = self._extract_purpose_keywords(content)
        
        return analysis
        
    def _find_token_patterns(self, content: str) -> List[str]:
        """Find design token related patterns."""
        patterns = []
        
        token_indicators = [
            r'\$value',
            r'color\.',
            r'spacing\.',
            r'typography\.',
            r'semantic/',
            r'primitive/',
            r'component/',
            r'\.json',
            r'token'
        ]
        
        for indicator in token_indicators:
            if re.search(indicator, content, re.IGNORECASE):
                patterns.append(indicator)
                
        return patterns
        
    def _find_validation_patterns(self, content: str) -> List[str]:
        """Find validation related patterns."""
        patterns = []
        
        validation_indicators = [
            r'validate',
            r'check',
            r'verify',
            r'lint',
            r'error',
            r'warning',
            r'assert',
            r'test'
        ]
        
        for indicator in validation_indicators:
            if re.search(indicator, content, re.IGNORECASE):
                patterns.append(indicator)
                
        return patterns
        
    def _find_file_operations(self, content: str) -> List[str]:
        """Find file operation patterns."""
        patterns = []
        
        file_ops = [
            r'open\(',
            r'read',
            r'write',
            r'fs\.',
            r'Path\(',
            r'glob',
            r'listdir',
            r'exists'
        ]
        
        for op in file_ops:
            if re.search(op, content):
                patterns.append(op)
                
        return patterns
        
    def _find_json_operations(self, content: str) -> List[str]:
        """Find JSON operation patterns."""
        patterns = []
        
        json_ops = [
            r'json\.load',
            r'json\.dump',
            r'JSON\.parse',
            r'JSON\.stringify',
            r'\.json\(',
            r'loads\(',
            r'dumps\('
        ]
        
        for op in json_ops:
            if re.search(op, content):
                patterns.append(op)
                
        return patterns
        
    def _extract_purpose_keywords(self, content: str) -> Set[str]:
        """Extract purpose-indicating keywords."""
        keywords = set()
        
        purpose_words = [
            'validate', 'check', 'analyze', 'inspect', 'detect', 'find',
            'remove', 'clean', 'generate', 'extract', 'enforce', 'token',
            'redundancy', 'circular', 'plural', 'reference', 'chain',
            'hierarchy', 'consumption', 'emphasis', 'structure', 'syntax'
        ]
        
        content_lower = content.lower()
        for word in purpose_words:
            if word in content_lower:
                keywords.add(word)
                
        return keywords
        
    def _detect_redundancy(self):
        """Detect redundancy across all scripts."""
        redundancy = {
            'function_overlaps': {},
            'import_overlaps': {},
            'pattern_overlaps': {},
            'purpose_overlaps': {}
        }
        
        all_scripts = {
            **self.analysis_results['python_scripts'],
            **self.analysis_results['javascript_scripts'],
            **self.analysis_results['shell_scripts']
        }
        
        # Function name overlaps
        func_names = defaultdict(list)
        for script_name, analysis in all_scripts.items():
            if 'functions' in analysis:
                for func in analysis['functions']:
                    func_names[func['name']].append(script_name)
                    
        redundancy['function_overlaps'] = {
            name: scripts for name, scripts in func_names.items() 
            if len(scripts) > 1
        }
        
        # Import overlaps
        import_usage = defaultdict(list)
        for script_name, analysis in all_scripts.items():
            imports = analysis.get('imports', []) + analysis.get('requires', [])
            for imp in imports:
                import_usage[imp].append(script_name)
                
        redundancy['import_overlaps'] = {
            imp: scripts for imp, scripts in import_usage.items() 
            if len(scripts) > 1
        }
        
        # Pattern overlaps
        pattern_usage = defaultdict(list)
        for script_name, analysis in all_scripts.items():
            patterns = (analysis.get('token_patterns', []) + 
                       analysis.get('validation_patterns', []) +
                       analysis.get('file_operations', []) +
                       analysis.get('json_operations', []))
            for pattern in patterns:
                pattern_usage[pattern].append(script_name)
                
        redundancy['pattern_overlaps'] = {
            pattern: scripts for pattern, scripts in pattern_usage.items()
            if len(scripts) > 1
        }
        
        # Purpose overlaps
        purpose_usage = defaultdict(list)
        for script_name, analysis in all_scripts.items():
            for keyword in analysis.get('purpose_keywords', set()):
                purpose_usage[keyword].append(script_name)
                
        redundancy['purpose_overlaps'] = {
            keyword: scripts for keyword, scripts in purpose_usage.items()
            if len(scripts) > 1
        }
        
        self.analysis_results['redundancy_analysis'] = redundancy
        
    def _identify_consolidation_opportunities(self):
        """Identify scripts that could be consolidated."""
        opportunities = []
        
        redundancy = self.analysis_results['redundancy_analysis']
        
        # Group scripts by similar purposes
        purpose_groups = defaultdict(set)
        for keyword, scripts in redundancy['purpose_overlaps'].items():
            if len(scripts) >= 2:
                key = tuple(sorted(scripts))
                purpose_groups[key].add(keyword)
                
        for scripts, keywords in purpose_groups.items():
            if len(keywords) >= 3:  # Strong overlap
                opportunities.append({
                    'type': 'purpose_consolidation',
                    'scripts': list(scripts),
                    'shared_keywords': list(keywords),
                    'confidence': 'high' if len(keywords) >= 5 else 'medium'
                })
                
        # Identify validation script overlaps
        validation_scripts = []
        all_scripts = {
            **self.analysis_results['python_scripts'],
            **self.analysis_results['javascript_scripts']
        }
        
        for script_name, analysis in all_scripts.items():
            if ('validate' in analysis.get('purpose_keywords', set()) or
                'check' in analysis.get('purpose_keywords', set())):
                validation_scripts.append(script_name)
                
        if len(validation_scripts) >= 3:
            opportunities.append({
                'type': 'validation_consolidation',
                'scripts': validation_scripts,
                'recommendation': 'Consider creating a unified validation framework',
                'confidence': 'medium'
            })
            
        self.analysis_results['consolidation_opportunities'] = opportunities
        
    def _generate_report(self):
        """Generate comprehensive redundancy report."""
        print("\n📊 REDUNDANCY ANALYSIS RESULTS")
        print("=" * 50)
        
        # Script inventory
        total_scripts = (len(self.analysis_results['python_scripts']) +
                        len(self.analysis_results['javascript_scripts']) +
                        len(self.analysis_results['shell_scripts']))
        
        print(f"📁 Total Scripts Analyzed: {total_scripts}")
        print(f"   • Python: {len(self.analysis_results['python_scripts'])}")
        print(f"   • JavaScript: {len(self.analysis_results['javascript_scripts'])}")
        print(f"   • Shell: {len(self.analysis_results['shell_scripts'])}")
        
        # Redundancy summary
        redundancy = self.analysis_results['redundancy_analysis']
        
        print(f"\n🔄 Function Name Overlaps: {len(redundancy['function_overlaps'])}")
        for func_name, scripts in redundancy['function_overlaps'].items():
            print(f"   • {func_name}: {', '.join(scripts)}")
            
        print(f"\n📦 Import/Dependency Overlaps: {len(redundancy['import_overlaps'])}")
        common_imports = {k: v for k, v in redundancy['import_overlaps'].items() 
                         if len(v) >= 3}
        for imp, scripts in list(common_imports.items())[:5]:  # Top 5
            print(f"   • {imp}: {', '.join(scripts)}")
            
        print(f"\n🎯 Purpose Keyword Overlaps: {len(redundancy['purpose_overlaps'])}")
        common_purposes = {k: v for k, v in redundancy['purpose_overlaps'].items() 
                          if len(v) >= 3}
        for keyword, scripts in list(common_purposes.items())[:5]:  # Top 5
            print(f"   • {keyword}: {', '.join(scripts)}")
            
        # Consolidation opportunities
        opportunities = self.analysis_results['consolidation_opportunities']
        
        print(f"\n💡 CONSOLIDATION OPPORTUNITIES: {len(opportunities)}")
        for i, opp in enumerate(opportunities, 1):
            print(f"\n{i}. {opp['type'].replace('_', ' ').title()}")
            print(f"   Scripts: {', '.join(opp['scripts'])}")
            if 'shared_keywords' in opp:
                print(f"   Shared functionality: {', '.join(opp['shared_keywords'])}")
            if 'recommendation' in opp:
                print(f"   Recommendation: {opp['recommendation']}")
            print(f"   Confidence: {opp['confidence']}")
            
        # Specific recommendations
        print(f"\n✨ SPECIFIC RECOMMENDATIONS")
        print("=" * 30)
        
        validation_scripts = [name for name, analysis in 
                            {**self.analysis_results['python_scripts'],
                             **self.analysis_results['javascript_scripts']}.items()
                            if 'validate' in name.lower() or 'check' in name.lower()]
        
        if len(validation_scripts) >= 3:
            print("🔧 VALIDATION CONSOLIDATION:")
            print("   Consider creating a unified validation framework:")
            for script in validation_scripts:
                print(f"   • {script}")
            print("   → Potential outcome: Single validation CLI with subcommands")
            
        # Token-related scripts
        token_scripts = [name for name, analysis in 
                        {**self.analysis_results['python_scripts'],
                         **self.analysis_results['javascript_scripts']}.items()
                        if 'token' in analysis.get('purpose_keywords', set())]
        
        if len(token_scripts) >= 2:
            print(f"\n🎨 TOKEN ANALYSIS CONSOLIDATION:")
            print("   Token-related scripts that could share utilities:")
            for script in token_scripts:
                print(f"   • {script}")
            print("   → Potential outcome: Shared token parsing library")
            
        print(f"\n✅ ANALYSIS COMPLETE")
        print("Review consolidation opportunities to reduce maintenance overhead.")

def main():
    """Main execution function."""
    analyzer = ScriptAnalyzer()
    analyzer.analyze_all_scripts()

if __name__ == "__main__":
    main()