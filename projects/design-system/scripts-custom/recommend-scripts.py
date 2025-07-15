#!/usr/bin/env python3
"""
Intelligent Script Recommendation System
========================================

Analyzes your planned changes or completed work and recommends which scripts to run
for validation, analysis, and maintenance based on the type of changes detected.

Usage:
    python3 scripts-custom/recommend-scripts.py [options]
    
Options:
    --plan "description"     - Describe what you plan to do
    --done "description"     - Describe what you just completed
    --auto                   - Auto-detect changes from git status
    --interactive           - Interactive mode with questions
"""

import os
import sys
import re
import subprocess
from pathlib import Path
from typing import List, Dict, Set
import argparse

class ScriptRecommendationEngine:
    def __init__(self):
        self.script_categories = {
            # Validation Scripts (run these to check quality)
            'validation': {
                'detect-plural-references.py': {
                    'triggers': ['naming', 'file', 'folder', 'token', 'plural', 'singular'],
                    'when': 'After naming changes, file renames, or new token creation',
                    'critical': True
                },
                'validate-token-syntax.py': {
                    'triggers': ['token', 'reference', 'syntax', 'json', 'value'],
                    'when': 'After editing token files or adding new token references',
                    'critical': True
                },
                'validate-consumption-hierarchy.py': {
                    'triggers': ['token', 'layer', 'primitive', 'semantic', 'component', 'reference'],
                    'when': 'After creating new tokens or changing token references between layers',
                    'critical': True
                },
                'validate-token-chain-resolution.js': {
                    'triggers': ['token', 'reference', 'chain', 'circular', 'dependency'],
                    'when': 'After complex token reference changes or new token relationships',
                    'critical': False
                },
                'validate-l1-l2-redundancy.py': {
                    'triggers': ['l1', 'l2', 'lightness', 'inversity', 'semantic', 'redundancy'],
                    'when': 'After changes to L1/L2 semantic layers',
                    'critical': False
                },
                'validate-documentation-references.sh': {
                    'triggers': ['documentation', 'doc', 'markdown', 'reference', 'link'],
                    'when': 'After updating documentation or changing file/token names',
                    'critical': False
                },
                'validate-documentation-structure.sh': {
                    'triggers': ['documentation', 'structure', 'folder', 'organization'],
                    'when': 'After reorganizing documentation folders or adding new docs',
                    'critical': False
                },
                'validate-protected-files.sh': {
                    'triggers': ['protected', 'important', 'core', 'critical', 'system'],
                    'when': 'Before major changes to ensure protected files are safe',
                    'critical': False
                }
            },
            
            # Analysis Scripts (run these to understand your system)
            'analysis': {
                'analyze-token-structure.js': {
                    'triggers': ['debug', 'token', 'structure', 'missing', 'issue', 'problem'],
                    'when': 'When debugging token issues or understanding token structure',
                    'critical': False
                },
                'analyze-emphasis-structure.js': {
                    'triggers': ['emphasis', 'l3', 'relationship', 'structure'],
                    'when': 'When working with emphasis tokens or debugging L3 layer',
                    'critical': False
                },
                'detect-circular-token-references.js': {
                    'triggers': ['circular', 'infinite', 'loop', 'reference', 'dependency'],
                    'when': 'When experiencing build issues or infinite reference loops',
                    'critical': True
                }
            },
            
            # Cleanup Scripts (run these to maintain cleanliness)
            'cleanup': {
                'cleanup-empty-files.sh': {
                    'triggers': ['empty', 'cleanup', 'clean', 'remove', 'unused'],
                    'when': 'After refactoring or when you notice empty files',
                    'critical': False
                },
                'cleanup-obsolete-files.js': {
                    'triggers': ['obsolete', 'deprecated', 'old', 'legacy', 'unused'],
                    'when': 'After major refactoring to remove old files',
                    'critical': False
                },
                'cleanup-scripts.py': {
                    'triggers': ['script', 'organization', 'consolidate', 'tidy'],
                    'when': 'When reorganizing or adding new scripts',
                    'critical': False
                }
            },
            
            # Generation Scripts (run these to create outputs)
            'generation': {
                'generate-word-docs.py': {
                    'triggers': ['word', 'docx', 'documentation', 'offline', 'print'],
                    'when': 'When you need offline documentation or want to share docs',
                    'critical': False
                },
                'extract-compound-units.js': {
                    'triggers': ['compound', 'extract', 'analysis', 'units'],
                    'when': 'One-time use for extracting compound token patterns',
                    'critical': False
                }
            }
        }
        
        self.workflow_recommendations = {
            'new_tokens': [
                'detect-plural-references.py',
                'validate-token-syntax.py', 
                'validate-consumption-hierarchy.py'
            ],
            'refactor_tokens': [
                'detect-plural-references.py',
                'validate-token-syntax.py',
                'validate-consumption-hierarchy.py',
                'validate-token-chain-resolution.js'
            ],
            'documentation_update': [
                'detect-plural-references.py',
                'validate-documentation-references.sh'
            ],
            'file_organization': [
                'detect-plural-references.py',
                'validate-documentation-structure.sh',
                'cleanup-empty-files.sh'
            ],
            'debug_issues': [
                'analyze-token-structure.js',
                'detect-circular-token-references.js',
                'validate-token-syntax.py'
            ]
        }

    def analyze_change_description(self, description: str) -> Set[str]:
        """Analyze a change description and return triggered keywords."""
        description_lower = description.lower()
        triggered_keywords = set()
        
        # Extract keywords from description
        words = re.findall(r'\w+', description_lower)
        
        for word in words:
            triggered_keywords.add(word)
            
        return triggered_keywords

    def get_git_changes(self) -> Dict[str, List[str]]:
        """Get current git changes to auto-detect what changed."""
        try:
            # Get staged and unstaged changes
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                  capture_output=True, text=True)
            
            changes = {
                'modified': [],
                'added': [],
                'deleted': [],
                'renamed': []
            }
            
            for line in result.stdout.strip().split('\n'):
                if not line:
                    continue
                    
                status = line[:2]
                filepath = line[3:]
                
                if 'M' in status:
                    changes['modified'].append(filepath)
                elif 'A' in status:
                    changes['added'].append(filepath)
                elif 'D' in status:
                    changes['deleted'].append(filepath)
                elif 'R' in status:
                    changes['renamed'].append(filepath)
            
            return changes
            
        except subprocess.CalledProcessError:
            return {'modified': [], 'added': [], 'deleted': [], 'renamed': []}

    def analyze_file_changes(self, changes: Dict[str, List[str]]) -> Set[str]:
        """Analyze git file changes and return relevant keywords."""
        keywords = set()
        
        for change_type, files in changes.items():
            if change_type == 'renamed':
                keywords.update(['rename', 'naming', 'file'])
            
            for filepath in files:
                # Analyze file paths for keywords
                if 'token' in filepath.lower():
                    keywords.add('token')
                if '.json' in filepath:
                    keywords.add('json')
                if 'documentation' in filepath.lower():
                    keywords.add('documentation')
                if 'semantic' in filepath.lower():
                    keywords.add('semantic')
                if 'primitive' in filepath.lower():
                    keywords.add('primitive')
                if 'component' in filepath.lower():
                    keywords.add('component')
                if any(layer in filepath.lower() for layer in ['l1', 'l2', 'l3']):
                    keywords.update(['l1', 'l2', 'l3'])
                if 'emphasis' in filepath.lower():
                    keywords.add('emphasis')
                if 'lightness' in filepath.lower():
                    keywords.add('lightness')
                if 'inversity' in filepath.lower():
                    keywords.add('inversity')
                    
        return keywords

    def recommend_scripts(self, keywords: Set[str]) -> Dict[str, List[Dict]]:
        """Recommend scripts based on keywords."""
        recommendations = {
            'critical': [],
            'recommended': [],
            'optional': []
        }
        
        for category, scripts in self.script_categories.items():
            for script_name, script_info in scripts.items():
                # Check if any trigger words match
                matches = keywords.intersection(set(script_info['triggers']))
                
                if matches:
                    recommendation = {
                        'script': script_name,
                        'category': category,
                        'when': script_info['when'],
                        'matches': list(matches),
                        'command': self.get_run_command(script_name)
                    }
                    
                    if script_info['critical']:
                        recommendations['critical'].append(recommendation)
                    else:
                        recommendations['recommended'].append(recommendation)
                        
        return recommendations

    def get_run_command(self, script_name: str) -> str:
        """Get the appropriate run command for a script."""
        if script_name.endswith('.py'):
            return f"python3 scripts-custom/{script_name}"
        elif script_name.endswith('.js'):
            return f"node scripts-custom/{script_name}"
        elif script_name.endswith('.sh'):
            return f"bash scripts-custom/{script_name}"
        return f"scripts-custom/{script_name}"

    def suggest_workflow(self, keywords: Set[str]) -> str:
        """Suggest a workflow based on keywords."""
        workflows = []
        
        if any(word in keywords for word in ['token', 'new', 'create', 'add']):
            workflows.append('new_tokens')
        if any(word in keywords for word in ['refactor', 'change', 'modify', 'restructure']):
            workflows.append('refactor_tokens')
        if any(word in keywords for word in ['documentation', 'doc', 'markdown']):
            workflows.append('documentation_update')
        if any(word in keywords for word in ['file', 'folder', 'organization', 'structure']):
            workflows.append('file_organization')
        if any(word in keywords for word in ['debug', 'issue', 'problem', 'error']):
            workflows.append('debug_issues')
            
        return workflows[0] if workflows else 'general'

    def interactive_mode(self):
        """Interactive mode to ask user about their changes."""
        print("🤖 INTERACTIVE SCRIPT RECOMMENDATION")
        print("=" * 50)
        print("I'll ask you a few questions to recommend the right scripts.\n")
        
        keywords = set()
        
        # Question 1: What are you doing?
        print("1. What type of work are you doing? (multiple choices allowed)")
        print("   a) Creating new tokens")
        print("   b) Modifying existing tokens") 
        print("   c) Updating documentation")
        print("   d) Reorganizing files/folders")
        print("   e) Debugging issues")
        print("   f) General maintenance")
        
        choices = input("\nEnter letters (e.g., 'a,c'): ").lower().split(',')
        
        if 'a' in choices:
            keywords.update(['token', 'new', 'create'])
        if 'b' in choices:
            keywords.update(['token', 'modify', 'refactor'])
        if 'c' in choices:
            keywords.update(['documentation', 'doc'])
        if 'd' in choices:
            keywords.update(['file', 'folder', 'organization'])
        if 'e' in choices:
            keywords.update(['debug', 'issue', 'problem'])
        if 'f' in choices:
            keywords.update(['cleanup', 'maintenance'])
            
        # Question 2: What files are involved?
        print("\n2. What types of files are you working with?")
        print("   a) Token JSON files")
        print("   b) Documentation markdown files")
        print("   c) Script files")
        print("   d) Configuration files")
        
        file_choices = input("\nEnter letters (e.g., 'a,b'): ").lower().split(',')
        
        if 'a' in file_choices:
            keywords.update(['token', 'json'])
        if 'b' in file_choices:
            keywords.update(['documentation', 'markdown'])
        if 'c' in file_choices:
            keywords.update(['script'])
        if 'd' in file_choices:
            keywords.update(['config'])
            
        # Question 3: Specific areas
        print("\n3. Any specific token layers or areas? (optional)")
        print("   a) Primitive tokens")
        print("   b) Semantic tokens (L1/L2/L3)")
        print("   c) Component tokens") 
        print("   d) Emphasis/contrast tokens")
        print("   e) None specific")
        
        area_choices = input("\nEnter letters or press enter to skip: ").lower().split(',')
        
        if 'a' in area_choices:
            keywords.add('primitive')
        if 'b' in area_choices:
            keywords.update(['semantic', 'l1', 'l2', 'l3'])
        if 'c' in area_choices:
            keywords.add('component')
        if 'd' in area_choices:
            keywords.update(['emphasis', 'contrast'])
            
        return keywords

    def print_recommendations(self, recommendations: Dict[str, List[Dict]], workflow: str = None):
        """Print script recommendations in a user-friendly format."""
        print("\n🎯 SCRIPT RECOMMENDATIONS")
        print("=" * 50)
        
        if workflow and workflow in self.workflow_recommendations:
            print(f"📋 Detected workflow: {workflow.replace('_', ' ').title()}")
            print()
        
        # Critical scripts
        if recommendations['critical']:
            print("🚨 CRITICAL SCRIPTS (Run these first):")
            for rec in recommendations['critical']:
                print(f"   ▶️  {rec['script']}")
                print(f"      💡 {rec['when']}")
                print(f"      🔧 {rec['command']}")
                print(f"      🎯 Matches: {', '.join(rec['matches'])}")
                print()
        
        # Recommended scripts  
        if recommendations['recommended']:
            print("✅ RECOMMENDED SCRIPTS:")
            for rec in recommendations['recommended']:
                print(f"   ▶️  {rec['script']}")
                print(f"      💡 {rec['when']}")
                print(f"      🔧 {rec['command']}")
                print(f"      🎯 Matches: {', '.join(rec['matches'])}")
                print()
        
        if not recommendations['critical'] and not recommendations['recommended']:
            print("ℹ️  No specific scripts recommended based on your description.")
            print("   Consider running basic validation scripts if you made changes:")
            print("   • python3 scripts-custom/detect-plural-references.py")
            print("   • python3 scripts-custom/validate-token-syntax.py")
            
        print("\n💡 PRO TIP: You can run all critical scripts with npm commands:")
        print("   npm run check:plural-references")
        print("   npm run check:token-syntax")

def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description='Get intelligent script recommendations')
    parser.add_argument('--plan', help='Describe what you plan to do')
    parser.add_argument('--done', help='Describe what you just completed') 
    parser.add_argument('--auto', action='store_true', help='Auto-detect changes from git')
    parser.add_argument('--interactive', action='store_true', help='Interactive mode')
    
    args = parser.parse_args()
    
    engine = ScriptRecommendationEngine()
    keywords = set()
    
    if args.interactive:
        keywords = engine.interactive_mode()
    elif args.plan:
        print(f"📋 Analyzing planned work: {args.plan}")
        keywords = engine.analyze_change_description(args.plan)
    elif args.done:
        print(f"✅ Analyzing completed work: {args.done}")
        keywords = engine.analyze_change_description(args.done)
    elif args.auto:
        print("🔍 Auto-detecting changes from git...")
        changes = engine.get_git_changes()
        keywords = engine.analyze_file_changes(changes)
        
        if changes['modified'] or changes['added'] or changes['deleted'] or changes['renamed']:
            print("Detected file changes:")
            for change_type, files in changes.items():
                if files:
                    print(f"  {change_type.title()}: {len(files)} files")
    else:
        # Default to interactive mode
        keywords = engine.interactive_mode()
    
    # Get recommendations
    recommendations = engine.recommend_scripts(keywords)
    workflow = engine.suggest_workflow(keywords)
    
    # Print results
    engine.print_recommendations(recommendations, workflow)

if __name__ == "__main__":
    main()
