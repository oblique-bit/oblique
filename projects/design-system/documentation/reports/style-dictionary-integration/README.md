# Token Change Tracking System

This system monitors changes to tokens that are hardcoded in your style dictionary, providing automated detection and reporting when these critical references are modified or removed.

## 🎯 Purpose

Protects developers who have hardcoded token paths in their style dictionary by:
- Tracking specific tokens that should not change without notice
- Detecting renames, deletions, and modifications
- Generating professional reports for impact analysis
- Supporting both manual and automated workflows

## 🚀 Quick Start

### 1. Setup & Validation
```bash
# Initial setup and validation
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py setup

# Or use npm script
npm run track:token-changes
```

### 2. Add Tokens to Track
```bash
# Interactive tool to add new tracked tokens
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py add-token
```

### 3. Automated Monitoring
```bash
# Setup daily cron job
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py cron

# Setup git pre-commit hook
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py git-hook
```

## 📋 Available Commands

### NPM Scripts
```bash
# Manual tracking (with terminal output)
npm run track:token-changes

# Automated tracking (for cron/CI)
npm run track:token-changes-auto

# Validation of consumption hierarchy
npm run check:token-consumption
```

### Setup Utility
```bash
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py [command]

Commands:
  setup      - Initial setup and configuration validation
  validate   - Validate configuration and tracked tokens
  add-token  - Interactive tool to add new tracked tokens
  cron       - Show cron job setup instructions
  git-hook   - Setup git pre-commit hook
  help       - Show help message
```

## 📂 File Structure

```
documentation/reports/token-changes/
|-- scripts/
|   |-- track-token-changes.py      # Main tracking script
|   +-- setup-token-tracking.py    # Setup & maintenance utility
|-- tracked-tokens-config.json     # Configuration for tracked tokens
+-- YYYY/
    +-- MM/
        +-- YYYYMMDD-HHMM-token-changes-report.md  # Generated reports
```

## ⚙️ Configuration

Edit `tracked-tokens-config.json` to:
- Add new token categories
- Specify which token paths to track
- Configure watch patterns for file scanning
- Define breaking change rules

### Example Configuration Structure
```json
{
  "trackedTokens": {
    "color": {
      "description": "Color tokens hardcoded in style dictionary",
      "paths": [
        "ob.s.color.neutral.no-color",
        "ob.s.color.brand",
        "ob.s1.color.primary.default"
      ]
    }
  },
  "watchPatterns": {
    "includes": ["src/lib/themes/**/*.json", "src/lib/themes/**/*.js"]
  }
}
```

## 📊 Reports

### Generated Reports Include:
- **Change Detection**: Token renames, deletions, modifications
- **Impact Analysis**: Which files and lines are affected
- **Migration Guidance**: Suggestions for handling changes
- **Professional Format**: Both Markdown and JSON outputs

### Report Locations:
- Manual runs: `documentation/reports/token-changes/YYYY/MM/`
- Timestamped format: `YYYYMMDD-HHMM-token-changes-report.md`

## 🔄 Automation Options

### Daily Cron Job
```bash
# Add to crontab (crontab -e)
0 2 * * * cd /path/to/project && npm run track:token-changes-auto
```

### Git Pre-commit Hook
```bash
# Setup automatically
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py git-hook
```

### CI/CD Integration
```yaml
# Example GitHub Actions step
- name: Track Token Changes
  run: npm run track:token-changes-auto
```

## 🚨 Breaking Change Detection

The system identifies breaking changes as:
- **Token Deletion**: Tracked token completely removed
- **Token Rename**: Tracked token path changed
- **Value Change**: Token value modified (configurable)

When breaking changes are detected:
- Exit code 1 (for CI/CD blocking)
- Detailed impact analysis in reports
- Migration suggestions provided

## 🛠️ Maintenance

### Regular Tasks:
1. **Review tracked tokens** - Remove obsolete, add new ones
2. **Update watch patterns** - Include new file locations
3. **Check reports** - Review generated change reports
4. **Validate config** - Run setup validation periodically

### Monthly Review:
```bash
# Validate entire system
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py validate

# Check recent reports
ls -la documentation/reports/token-changes/$(date +%Y)/$(date +%m)/
```

## 🔍 Integration with Consumption Hierarchy

This tracking system works alongside the consumption hierarchy validation:

```bash
# Check both systems
npm run check:token-consumption    # Validate s0/s1/s2/s3 hierarchy
npm run track:token-changes       # Track hardcoded token changes
```

## 💡 Best Practices

1. **Start Small**: Begin with critical tokens only
2. **Regular Updates**: Add new tokens as they're hardcoded
3. **Team Coordination**: Share configuration changes
4. **Report Review**: Check generated reports before releases
5. **Automation**: Use cron jobs for continuous monitoring

## 🚀 Getting Help

Run the setup utility for guidance:
```bash
python3 documentation/reports/token-changes/scripts/setup-token-tracking.py help
```

Or review the configuration file for examples and documentation.
