# Markdown File Naming Prevention Guidelines

## 🚫 CRITICAL RULE: All .md files MUST use lowercase names

**Problem**: Uppercase .md file names cause inconsistency and break workspace standards.

## ✅ CORRECT Examples:
- `readme.md`
- `script_template_guidelines.md` 
- `email-to-developer.md`
**Correct:**
- `setup-protection.md`
- `token-validation.md`
- `component-analysis.md`

**Incorrect:**
- `setup-protection.md`

## ❌ INCORRECT Examples (NEVER CREATE):
- `README.md`
- `SCRIPT_TEMPLATE_GUIDELINES.md`
- `EMAIL-TO-DEVELOPER.md`  
- `setup-protection.md`

## 🔧 Enforcement Mechanisms

### 1. Validation Script
```bash
# Run before any commit to check for uppercase .md files:
node scripts-custom/validate-documentation-structure.js
```

This script will:
- ✅ Find all uppercase .md files
- ✅ Automatically rename them to lowercase
- ✅ Report what was normalized

### 2. Git Pre-commit Hook (Recommended)
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Check for uppercase .md files before commit
uppercase_md=$(find . -name "*.md" | grep -v node_modules | grep -E "[A-Z]" | wc -l)
if [ "$uppercase_md" -gt 0 ]; then
    echo "🚫 BLOCKED: Found uppercase .md files"
    echo "Run: node scripts-custom/validate-documentation-structure.js"
    echo "Then try commit again."
    exit 1
fi
```

### 3. AI Assistant Guidelines

**When AI creates any .md file:**
- ✅ ALWAYS use lowercase filenames
- ✅ Use underscores or hyphens for word separation  
- ✅ Check filename before creation
- ❌ NEVER use any uppercase letters in .md filenames

**CRITICAL AI PREVENTION RULE:**
Before calling `create_file` with any .md filename:
1. Check if filename contains uppercase letters
2. Convert to lowercase immediately
3. Use underscores for word separation
4. Verify the corrected filename

**Examples for AI:**
```javascript
// ❌ WRONG - DO NOT DO THIS
create_file("/path/to/SCRIPT_GUIDELINES.md", content)
create_file("/path/to/Email-Template.md", content)
create_file("/path/to/Setup_Instructions.md", content)

// ✅ CORRECT - ALWAYS DO THIS
create_file("/path/to/script_guidelines.md", content)
create_file("/path/to/email_template.md", content) 
create_file("/path/to/setup_instructions.md", content)
```

**AI Self-Check Process:**
1. Before any create_file call with .md extension
2. Examine the filename string character by character
3. If ANY uppercase letters found → convert to lowercase
4. Replace spaces with underscores
5. Then proceed with file creation

## 🎯 Why This Matters

1. **Consistency**: Predictable naming across entire workspace
2. **Automation**: Scripts can rely on consistent patterns  
3. **Standards**: Professional codebase appearance
4. **Prevention**: Avoids future cleanup efforts

## 📋 Team Workflow

**Before creating any .md file:**
1. Check if name contains uppercase letters
2. Convert to lowercase with underscores/hyphens
3. Verify with validation script if unsure

**If you find uppercase .md files:**
1. Run `node scripts-custom/validate-documentation-structure.js`
2. Review the normalized names
3. Commit the changes

## 🚨 Emergency Recovery

If uppercase .md files slip through:
```bash
# Find all uppercase .md files
find . -name "*.md" | grep -v node_modules | grep -E "[A-Z]"

# Auto-normalize them
node scripts-custom/validate-documentation-structure.js

# Verify they're fixed
find . -name "*.md" | grep -v node_modules | grep -E "[A-Z]"
```

---

**Remember**: Lowercase .md filenames are a workspace standard, not a suggestion!
