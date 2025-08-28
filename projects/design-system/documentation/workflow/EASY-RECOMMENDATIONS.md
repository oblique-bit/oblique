# 🤖 EASY SCRIPT RECOMMENDATIONS

The **EASIEST** ways to know which scripts to run:

## 🚀 **SUPER SIMPLE USAGE**

### **🎯 When you're about to do something:**
```bash
npm run recommend:plan "I want to add new color tokens"
npm run recommend:plan "I'm refactoring the emphasis layer"
npm run recommend:plan "I need to debug some token issues"
```

### **✅ When you just finished something:**
```bash
npm run recommend:done "I just renamed token files"
npm run recommend:done "I updated the documentation"
npm run recommend:done "I added new semantic tokens"
```

### **🔍 Auto-detect what changed:**
```bash
npm run recommend:auto
```

### **💬 Interactive questions (easiest for beginners):**
```bash
npm run recommend
```

### **⚡ Just run the most important checks:**
```bash
npm run validate:quick
```

---

## 🎯 **COMMON SCENARIOS**

| **What you're doing** | **Quick command** |
|---------------------|------------------|
| Adding new tokens | `npm run recommend:plan "new tokens"` |
| Fixing token issues | `npm run recommend:plan "debug token issues"` |
| Renaming files | `npm run recommend:done "renamed files"` |
| Updating docs | `npm run recommend:done "updated documentation"` |
| After any change | `npm run recommend:auto` |
| Quick check | `npm run validate:quick` |
| Not sure? | `npm run recommend` |

---

## 💡 **SMART FEATURES**

✅ **Automatically detects** what scripts you need based on:
- Keywords in your description
- File changes in git
- Type of work you're doing

✅ **Prioritizes scripts** by importance:
- 🚨 **Critical** - Run these first (quality/safety)
- ✅ **Recommended** - Run these for best practices
- ℹ️ **Optional** - Run if you have specific needs

✅ **Gives you the exact commands** to copy-paste

---

## 🔧 **EXAMPLE OUTPUT**

```
🚨 CRITICAL SCRIPTS (Run these first):
   ▶️  validate-all.js
      💡 Comprehensive validation covering circular references, semantic mirroring, and consumption hierarchy
      🔧 node scripts-custom/validate-all.js

✅ RECOMMENDED SCRIPTS:
   ▶️  validate-all-components.js
      💡 After editing token files or adding new component token references
      🔧 node scripts-custom/validate-all-components.js
```

Just copy-paste the commands! 🎯

---

## 🏆 **WORKFLOW RECOMMENDATIONS**

**Best practice:** Use this flow for any changes:

1. **Before starting:** `npm run recommend:plan "what I want to do"`
2. **After finishing:** `npm run recommend:auto` or `npm run validate:quick`
3. **Copy-paste the recommended commands**
4. **Done!** ✅
