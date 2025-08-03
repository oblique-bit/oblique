#!/bin/bash

# Setup Script for Empty File Prevention System
# Installs and configures all prevention mechanisms

set -euo pipefail

PROJECT_ROOT="/Users/davorradisic/vc git repo bit/oblique/projects/design-system"
PLIST_FILE="$PROJECT_ROOT/_private/automation/com.oblique.designsystem.empty-file-cleanup.plist"
LAUNCHAGENTS_DIR="$HOME/Library/LaunchAgents"

echo "🛡️  EMPTY FILE PREVENTION SYSTEM SETUP"
echo "======================================="
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$PROJECT_ROOT/_private/logs"
mkdir -p "$LAUNCHAGENTS_DIR"

# Test scripts
echo "🧪 Testing cleanup scripts..."

# Test Python script
if python3 "$PROJECT_ROOT/scripts-custom/prevent-empty-files.py" --cleanup-now; then
    echo "   ✅ Python monitor script works"
else
    echo "   ❌ Python monitor script failed"
    exit 1
fi

# Test shell script
if "$PROJECT_ROOT/scripts-custom/auto-cleanup-empty-files.sh"; then
    echo "   ✅ Shell cleanup script works"
else
    echo "   ❌ Shell cleanup script failed"
    exit 1
fi

# Setup LaunchAgent for automatic cleanup
echo "⚙️  Setting up automatic cleanup..."

# Copy plist to LaunchAgents
cp "$PLIST_FILE" "$LAUNCHAGENTS_DIR/"
echo "   ✅ Copied plist to LaunchAgents"

# Load the LaunchAgent
if launchctl load "$LAUNCHAGENTS_DIR/com.oblique.designsystem.empty-file-cleanup.plist" 2>/dev/null; then
    echo "   ✅ LaunchAgent loaded successfully"
else
    echo "   ⚠️  LaunchAgent may already be loaded"
fi

# Verify LaunchAgent status
if launchctl list | grep -q "com.oblique.designsystem.empty-file-cleanup"; then
    echo "   ✅ LaunchAgent is active"
else
    echo "   ❌ LaunchAgent failed to start"
    exit 1
fi

# Add NPM scripts for easy access
echo "📦 Adding NPM scripts..."

# Check if package.json exists
if [ -f "$PROJECT_ROOT/package.json" ]; then
    # Backup package.json
    cp "$PROJECT_ROOT/package.json" "$PROJECT_ROOT/package.json.backup"
    
    # Add scripts using Node.js
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (!pkg.scripts) pkg.scripts = {};
        
        pkg.scripts['clean:empty-files'] = 'python3 scripts-custom/prevent-empty-files.py --cleanup-now';
        pkg.scripts['monitor:empty-files'] = 'python3 scripts-custom/prevent-empty-files.py --watch';
        pkg.scripts['analyze:scripts'] = 'python3 scripts-custom/analyze-script-redundancy.py';
        
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    " && echo "   ✅ Added NPM scripts to package.json"
else
    echo "   ⚠️  No package.json found - skipping NPM scripts"
fi

echo ""
echo "✅ SETUP COMPLETE!"
echo "=================="
echo ""
echo "🔧 Available Commands:"
echo "   npm run clean:empty-files    # Clean empty files now"
echo "   npm run monitor:empty-files  # Start continuous monitoring"
echo "   npm run analyze:scripts      # Analyze script redundancy"
echo ""
echo "🤖 Automatic Protection:"
echo "   • Pre-commit hook blocks empty files in commits"
echo "   • GitHub Actions prevents empty files in PRs"
echo "   • LaunchAgent cleans up every 5 minutes"
echo "   • File system monitor available for development"
echo ""
echo "📊 Monitoring:"
echo "   • Logs: _private/logs/"
echo "   • LaunchAgent status: launchctl list | grep oblique"
echo "   • Disable auto-cleanup: launchctl unload ~/Library/LaunchAgents/com.oblique.designsystem.empty-file-cleanup.plist"
echo ""
echo "🎯 Your empty file problem is now SOLVED! 🎉"
