# 🚀 Quick Validation Commands

**For Token Maintainers (Non-Developers)**

> **Location:** `documentation/03-design-tokens/99-workflows/maintainers/quick-validation-commands.md`

## 📍 Before Every Token Handoff

**Essential Command:**
```bash
npm run validate:tokens-build
```

**What this does:** 
- Tests if Style Dictionary can build your tokens
- Same validation your developer colleagues encounter
- ✅ = Safe to handoff tokens
- ❌ = Fix broken references first

---

## 🔍 When You Need to Investigate Problems

**Deep Analysis Command:**
```bash
node scripts-custom/check-broken-token-chains.js
```

**What this shows:**
- Exactly which token references are broken
- Which themes have issues
- Detailed diagnostic information

---

## 📂 How to Run These Commands

1. **Open Terminal in VS Code:** `Terminal` → `New Terminal`
2. **Copy and paste** the command
3. **Press Enter**
4. **Read the results:**
   - ✅ Green = Good to go
   - ❌ Red = Need to fix something

---

## 🆘 Emergency Quick Reference

**Token validation failing?**
1. Run: `npm run validate:tokens-build`
2. If it fails, run: `node scripts-custom/check-broken-token-chains.js`
3. Look for ❌ broken references
4. Fix the token paths shown in red
5. Run step 1 again to confirm fix

---

## 📱 Keep This File Handy

- **Location:** `documentation/03-design-tokens/99-workflows/maintainers/`
- **Filename:** `quick-validation-commands.md`
- **Purpose:** Token maintainer command cheat sheet

**Remember:** Always run validation before handing off tokens to developers!