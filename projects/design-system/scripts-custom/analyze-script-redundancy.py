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
        
        # Generate report
        self._generate_report()
        
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
