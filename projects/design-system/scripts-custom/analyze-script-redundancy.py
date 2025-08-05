#!/usr/bin/env python3
"""
Script Redundancy Analyzer
==========================

Analyzes all custom scripts to identify potential redundancies, overlapping functionality,
and opportunities for consolidation.

Usage:
    python3 scripts-custom/analyze-script-redundancy.py
"""

import os
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c8793e298936b5c3eb625f01d0d7b5eb7461b5a4
import sys
import re
import json
from pathlib import Path
from collections import defaultdict

class ScriptRedundancyAnalyzer:
    def __init__(self, scripts_dir: str):
        self.scripts_dir = Path(scripts_dir)
        self.scripts = {}
        self.function_analysis = defaultdict(list)
        self.redundancy_report = []

    def analyze_all_scripts(self):
        """Analyze all scripts for redundancy."""
        print("🔍 SCRIPT REDUNDANCY ANALYSIS")
        print("=" * 50)
        
        # Load all scripts
        self._load_all_scripts()
        
        # Analyze functions and capabilities
        self._analyze_script_functions()
        
        # Check for redundancies
        self._check_redundancies()
<<<<<<< HEAD
=======
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
>>>>>>> ts-develop-02.03
=======
>>>>>>> c8793e298936b5c3eb625f01d0d7b5eb7461b5a4
        
        # Generate report
        self._generate_report()
        
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c8793e298936b5c3eb625f01d0d7b5eb7461b5a4
    def _load_all_scripts(self):
        """Load all script files for analysis."""
        script_files = list(self.scripts_dir.glob("*.py")) + \
                      list(self.scripts_dir.glob("*.js")) + \
                      list(self.scripts_dir.glob("*.sh"))
        
        for script_file in script_files:
            if script_file.name.startswith('.'):
                continue
                
            try:
                content = script_file.read_text(encoding='utf-8')
                self.scripts[script_file.name] = {
                    'path': script_file,
                    'content': content,
                    'lines': len(content.splitlines()),
                    'type': script_file.suffix[1:],  # Remove the dot
                    'functions': [],
                    'imports': [],
                    'purpose': self._extract_purpose(content)
                }
            except Exception as e:
                print(f"❌ Error reading {script_file.name}: {e}")

    def _extract_purpose(self, content: str) -> str:
        """Extract the purpose from script comments/docstrings."""
        # Python docstrings
        docstring_match = re.search(r'"""(.*?)"""', content, re.DOTALL)
        if docstring_match:
            return docstring_match.group(1).strip()
        
        # JavaScript comments
        js_comment_match = re.search(r'/\*\*(.*?)\*/', content, re.DOTALL)
        if js_comment_match:
            return js_comment_match.group(1).strip()
        
        # Shell comments
        shell_comment_lines = []
        for line in content.splitlines()[:10]:
            if line.strip().startswith('#') and not line.startswith('#!'):
                shell_comment_lines.append(line.strip()[1:].strip())
            elif shell_comment_lines:
                break
        
        return '\n'.join(shell_comment_lines) if shell_comment_lines else "No description found"

    def _analyze_script_functions(self):
        """Analyze functions and capabilities in each script."""
        for script_name, script_data in self.scripts.items():
            content = script_data['content']
            script_type = script_data['type']
            
            if script_type == 'py':
                self._analyze_python_script(script_name, content)
            elif script_type == 'js':
                self._analyze_javascript_script(script_name, content)
            elif script_type == 'sh':
                self._analyze_shell_script(script_name, content)

    def _analyze_python_script(self, script_name: str, content: str):
        """Analyze Python script functions."""
        # Extract function definitions
        functions = re.findall(r'def\s+(\w+)\s*\(', content)
        self.scripts[script_name]['functions'] = functions
        
        # Extract imports
        imports = re.findall(r'(?:from\s+\S+\s+)?import\s+([^\n]+)', content)
        self.scripts[script_name]['imports'] = imports
        
        # Common functionality patterns
        if 'json.load' in content or 'JSON.parse' in content:
            self.function_analysis['json_processing'].append(script_name)
        if 'Path(' in content or 'pathlib' in content:
            self.function_analysis['file_operations'].append(script_name)
        if 'token' in content.lower():
            self.function_analysis['token_operations'].append(script_name)
        if 'validate' in content.lower():
            self.function_analysis['validation'].append(script_name)
        if re.search(r'\.md|markdown', content.lower()):
            self.function_analysis['markdown_processing'].append(script_name)
        if 'docx' in content.lower():
            self.function_analysis['word_generation'].append(script_name)

    def _analyze_javascript_script(self, script_name: str, content: str):
        """Analyze JavaScript script functions."""
        # Extract function definitions
        functions = re.findall(r'function\s+(\w+)\s*\(|(\w+)\s*:\s*function|(\w+)\s*=>\s*|const\s+(\w+)\s*=\s*\(', content)
        # Flatten the tuple matches
        flat_functions = [f for match in functions for f in match if f]
        self.scripts[script_name]['functions'] = flat_functions
        
        # Extract requires/imports
        imports = re.findall(r'(?:const|let|var)\s+.*?=\s*require\([\'"]([^\'"]+)[\'"]', content)
        self.scripts[script_name]['imports'] = imports
        
        # Common functionality patterns
        if 'JSON.parse' in content or 'fs.readFileSync' in content:
            self.function_analysis['json_processing'].append(script_name)
        if 'fs.' in content or 'path.' in content:
            self.function_analysis['file_operations'].append(script_name)
        if 'token' in content.lower():
            self.function_analysis['token_operations'].append(script_name)
        if 'flatten' in content.lower():
            self.function_analysis['data_flattening'].append(script_name)

    def _analyze_shell_script(self, script_name: str, content: str):
        """Analyze shell script functions."""
        # Extract function definitions
        functions = re.findall(r'(\w+)\s*\(\s*\)\s*{', content)
        self.scripts[script_name]['functions'] = functions
        
        # Common functionality patterns
        if 'git' in content:
            self.function_analysis['git_operations'].append(script_name)
        if 'find' in content:
            self.function_analysis['file_search'].append(script_name)
        if 'rm' in content or 'remove' in content:
            self.function_analysis['file_cleanup'].append(script_name)

    def _check_redundancies(self):
        """Check for potential redundancies."""
        # Check for similar functionality
        for func_type, scripts in self.function_analysis.items():
            if len(scripts) > 1:
                self.redundancy_report.append({
                    'type': 'functionality_overlap',
                    'category': func_type,
                    'scripts': scripts,
                    'severity': 'medium' if len(scripts) == 2 else 'high'
                })

        # Check for similar purposes
        purpose_groups = defaultdict(list)
        for script_name, script_data in self.scripts.items():
            purpose_words = set(re.findall(r'\w+', script_data['purpose'].lower()))
            key_words = purpose_words.intersection({
                'validate', 'analyze', 'generate', 'cleanup', 'detect', 'token', 'word', 'markdown'
            })
            if key_words:
                purpose_groups[tuple(sorted(key_words))].append(script_name)

        for purpose_key, scripts in purpose_groups.items():
            if len(scripts) > 1:
                self.redundancy_report.append({
                    'type': 'similar_purpose',
                    'category': ' + '.join(purpose_key),
                    'scripts': scripts,
                    'severity': 'low'
                })

        # Check for specific redundancy patterns
        self._check_specific_redundancies()

    def _check_specific_redundancies(self):
        """Check for specific known redundancy patterns."""
        # Check analyze scripts
        analyze_scripts = [s for s in self.scripts.keys() if s.startswith('analyze-')]
        if len(analyze_scripts) > 1:
            # Check if they have overlapping token analysis functionality
            token_analyze = []
            for script in analyze_scripts:
                if 'token' in self.scripts[script]['content'].lower():
                    token_analyze.append(script)
            
            if len(token_analyze) > 1:
                self.redundancy_report.append({
                    'type': 'token_analysis_overlap',
                    'category': 'Token Analysis',
                    'scripts': token_analyze,
                    'severity': 'high',
                    'suggestion': 'Consider merging token analysis functionality'
                })

        # Check generate scripts
        generate_scripts = [s for s in self.scripts.keys() if s.startswith('generate-')]
        if len(generate_scripts) > 1:
            word_scripts = []
            for script in generate_scripts:
                if 'word' in script.lower() or 'docx' in self.scripts[script]['content'].lower():
                    word_scripts.append(script)
            
            if len(word_scripts) > 1:
                self.redundancy_report.append({
                    'type': 'word_generation_overlap',
                    'category': 'Word Document Generation',
                    'scripts': word_scripts,
                    'severity': 'high',
                    'suggestion': 'One appears to be a general converter, one specific. Consider consolidating.'
                })

        # Check cleanup scripts
        cleanup_scripts = [s for s in self.scripts.keys() if s.startswith('cleanup-')]
        if len(cleanup_scripts) > 2:  # More than cleanup-scripts.py + 1 other
            file_cleanup = []
            for script in cleanup_scripts:
                if script != 'cleanup-scripts.py' and ('file' in script.lower() or 'empty' in script.lower()):
                    file_cleanup.append(script)
            
            if len(file_cleanup) > 1:
                self.redundancy_report.append({
                    'type': 'file_cleanup_overlap',
                    'category': 'File Cleanup',
                    'scripts': file_cleanup,
                    'severity': 'medium',
                    'suggestion': 'Consider merging file cleanup operations'
                })

    def _generate_report(self):
        """Generate the final redundancy report."""
        print("\n📊 REDUNDANCY ANALYSIS RESULTS")
        print("=" * 50)
        
        if not self.redundancy_report:
            print("✅ No significant redundancies detected!")
            print("All scripts appear to have distinct, non-overlapping functionality.")
            return

        # Group by severity
        high_severity = [r for r in self.redundancy_report if r.get('severity') == 'high']
        medium_severity = [r for r in self.redundancy_report if r.get('severity') == 'medium']
        low_severity = [r for r in self.redundancy_report if r.get('severity') == 'low']

        if high_severity:
            print("🚨 HIGH PRIORITY REDUNDANCIES:")
            for issue in high_severity:
                print(f"   • {issue['category']}: {', '.join(issue['scripts'])}")
                if 'suggestion' in issue:
                    print(f"     💡 {issue['suggestion']}")
            print()

        if medium_severity:
            print("⚠️  MEDIUM PRIORITY REDUNDANCIES:")
            for issue in medium_severity:
                print(f"   • {issue['category']}: {', '.join(issue['scripts'])}")
                if 'suggestion' in issue:
                    print(f"     💡 {issue['suggestion']}")
            print()

        if low_severity:
            print("ℹ️  LOW PRIORITY OVERLAPS:")
            for issue in low_severity:
                print(f"   • {issue['category']}: {', '.join(issue['scripts'])}")
            print()

        # Script statistics
        print("📈 SCRIPT STATISTICS:")
        print(f"   • Total scripts analyzed: {len(self.scripts)}")
        print(f"   • Python scripts: {sum(1 for s in self.scripts.values() if s['type'] == 'py')}")
        print(f"   • JavaScript scripts: {sum(1 for s in self.scripts.values() if s['type'] == 'js')}")
        print(f"   • Shell scripts: {sum(1 for s in self.scripts.values() if s['type'] == 'sh')}")
        print(f"   • Total lines of code: {sum(s['lines'] for s in self.scripts.values())}")
        
        # Functionality distribution
        print("\n🔧 FUNCTIONALITY DISTRIBUTION:")
        for func_type, scripts in self.function_analysis.items():
            if len(scripts) > 1:
                print(f"   • {func_type.replace('_', ' ').title()}: {len(scripts)} scripts")

def main():
    """Main execution function."""
    script_dir = Path(__file__).parent
    
    analyzer = ScriptRedundancyAnalyzer(script_dir)
    analyzer.analyze_all_scripts()

if __name__ == "__main__":
    main()
<<<<<<< HEAD
=======
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
>>>>>>> ts-develop-02.03
=======
>>>>>>> c8793e298936b5c3eb625f01d0d7b5eb7461b5a4
