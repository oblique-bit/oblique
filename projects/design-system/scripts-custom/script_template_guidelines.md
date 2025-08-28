# Script Template & Guidelines

## Mandatory Script Header Template

Every new script must include this header structure and follow the maintenance guidelines:

```javascript
#!/usr/bin/env node

/**
 * [Script Name/Title]
 * 
 * [Brief description of what the script does]
 * 
 * COMMANDS:
 *     node [script-name].js [args]  - [Description of what the command does]
 *     node [script-name].js --help  - Show help message
 *     OR
 *     node [script-name].js         - [Description] (no command line arguments - runs automatically)
 *     OR  
 *     node [script-name].js         - [Description] (TO BE IMPLEMENTED)
 *     (no command line arguments - functionality pending implementation)
 * 
 * USAGE CONTEXT:
 * [5-7 sentences explaining WHY this script was created]
 * [What real problem it solves, what use case triggered its creation]
 * [Reference the ticket number if available: e.g., "Needed for OUI-4001"]
 * [Describe the specific situation/pain point that required automation]
 * [Any team workflows this supports or problems it prevents]
 * 
 * USAGE:
 *     node scripts-custom/[script-name].js [arguments]
 *     
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: [YYYY-MM-DD]
 * LAST_EDITED: [YYYY-MM-DD]
 * LAST_RUN: [YYYY-MM-DD HH:MM:SS] (Update every execution)
 */
```

## MANDATORY Maintenance Requirements

### 1. Team Portability (CRITICAL)
- ❌ **NO hardcoded absolute paths** (e.g., `/Users/username/...`)
- ❌ **NO machine-specific configurations**
- ✅ **Use relative paths** from project root
- ✅ **Use `__dirname` and `path.join()`** for path resolution
- ✅ **Check file existence** before operations
- **Violation Action**: Archive if not fixable

### 2. No Redundancy (CRITICAL)
- **Rule**: Only ONE script per functionality
- **Process**: Compare with existing scripts before creating
- **Action**: Archive duplicates, keep most comprehensive version

### 3. JavaScript Only (MANDATORY)
- **Language**: All scripts must be `.js` files
- **Runtime**: Node.js only
- **Standards**: Modern ES6+ features encouraged

### 4. Valid References (MANDATORY)
- ✅ **Current token structure**: Use S1/S2/S3 (not L1/L2/L3)
- ✅ **Existing file paths**: Verify all paths exist
- ✅ **Updated references**: Keep current with workspace changes
- **Testing**: Must work on fresh workspace clone

### 5. Template Compliance (MANDATORY)
- **All fields required**: USAGE CONTEXT, COMMANDS, dates, etc.
- **LAST_RUN updates**: Update timestamp every execution
- **Clear documentation**: Explain purpose and usage

## Guidelines for USAGE CONTEXT

**The USAGE CONTEXT section should answer:**
1. **Why** was this script needed? (What pain point?)
2. **When** was it created? (What situation triggered it?)
3. **What** specific problem does it solve?
4. **Who** benefits from this automation?
5. **How** does it fit into team workflows?

## 🚫 CRITICAL FILE NAMING RULE

**ALL .md FILES MUST USE LOWERCASE NAMES**
- ✅ `readme.md`, `script_guidelines.md`
- ❌ `README.md`, `SCRIPT_GUIDELINES.md`

**AI Assistant Rule**: When creating any .md file, ALWAYS use lowercase filenames with underscores or hyphens for word separation. This is a strict workspace standard.

**Good USAGE CONTEXT Examples:**

```
USAGE CONTEXT:
During OUI-4001 token refactoring, we changed from L1/L2/L3 to S1/S2/S3 structure and 
found many component files still referenced the old token paths, causing build failures.
Manual checking of 50+ component files was time-consuming and error-prone. This script
automates the validation of all component token references against the current S3
semantic token definitions. It prevents broken token references from reaching production
and saves developers hours of manual cross-referencing during token structure changes.
Created to support the post-refactoring validation workflow for the design system team.
```

```
USAGE CONTEXT:
After implementing new documentation structure rules (files only in subfolders, lowercase
.md extensions), manual enforcement across 100+ documentation files became impractical.
Team members kept accidentally adding files to documentation root or using uppercase
file extensions, breaking our organization standards. This script enforces both rules
automatically and can normalize existing violations. Essential for maintaining clean
documentation structure without constant manual review and correction by team leads.
```

## Bad USAGE CONTEXT Examples (avoid these):

❌ "This script validates tokens." (too vague, no context)
❌ "Created for validation purposes." (doesn't explain why needed)
❌ "Helps with tokens." (no specific use case or problem)

## Script Lifecycle Management

- **CREATED**: Set once when script is first created
- **LAST_EDITED**: Update every time script is modified
- **LAST_RUN**: Update every time script is executed (format: YYYY-MM-DD at HH:MM with optional result summary)
- **VERSION**: Increment when making significant changes
- **TICKET**: Reference the JIRA ticket that required this script

### LAST_RUN Examples:
- `LAST_RUN: 2025-08-28 at 15:42 (normalized 1550 files)`
- `LAST_RUN: 2025-08-28 at 09:15 (found 3 broken token references)`
- `LAST_RUN: 2025-08-28 at 14:30 (no issues found)`
- `LAST_RUN: Not executed yet`

## When to Create New Scripts vs Modify Existing

**Create New Script When:**
- Solving a fundamentally different problem
- Different input/output requirements
- Different target audience (developers vs designers)
- Requires different dependencies or approach

**Modify Existing Script When:**
- Extending functionality of same use case
- Fixing bugs or improving performance
- Adding new options to same workflow
- Supporting additional file formats for same validation

## Retirement Guidelines

When a script becomes obsolete:
1. Move to `_private/archived-scripts/`
2. Update `_private/archived-scripts/readme.md`
3. Remove references from main `scripts-custom/readme.md`
4. Document why it became obsolete (e.g., "Pre-OUI-4001 structure")

This prevents confusion and maintains script hygiene.
