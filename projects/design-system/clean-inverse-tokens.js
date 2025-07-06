// Script to clean up legacy '-inverse' keys in $themes.json
// Usage: node clean-inverse-tokens.js

const fs = require('fs');
const path = require('path');

const THEMES_PATH = path.join(__dirname, 'src/lib/themes/$themes.json');
const BACKUP_PATH = path.join(__dirname, 'src/lib/themes/$themes.json.bak-cleanup');

function fixInverseKey(key) {
  // Only fix if '-inverse' is not at the end
  if (/\-inverse(?!$)/.test(key)) {
    // Move '-inverse' to the end, preserving the rest
    return key.replace(/\-inverse/g, '') + '-inverse';
  }
  return null;
}

function processObject(obj) {
  let changed = false;
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const fixedKey = fixInverseKey(key);
    if (fixedKey) {
      newObj[fixedKey] = value;
      changed = true;
    } else {
      newObj[key] = value;
    }
  }
  return changed ? newObj : obj;
}

function processThemes(themes) {
  let changed = false;
  for (const theme of themes) {
    if (theme.$figmaStyleReferences) {
      const newRefs = processObject(theme.$figmaStyleReferences);
      if (newRefs !== theme.$figmaStyleReferences) {
        theme.$figmaStyleReferences = newRefs;
        changed = true;
      }
    }
    if (theme.$figmaVariableReferences) {
      const newVars = processObject(theme.$figmaVariableReferences);
      if (newVars !== theme.$figmaVariableReferences) {
        theme.$figmaVariableReferences = newVars;
        changed = true;
      }
    }
  }
  return changed;
}

function main() {
  if (!fs.existsSync(THEMES_PATH)) {
    console.error('Could not find $themes.json');
    process.exit(1);
  }
  const raw = fs.readFileSync(THEMES_PATH, 'utf8');
  const data = JSON.parse(raw);
  // Backup
  fs.writeFileSync(BACKUP_PATH, raw);
  const changed = processThemes(data);
  if (changed) {
    fs.writeFileSync(THEMES_PATH, JSON.stringify(data, null, 2));
    console.log('Cleaned up legacy -inverse keys. Backup saved to', BACKUP_PATH);
  } else {
    console.log('No legacy -inverse keys found. No changes made.');
  }
}

main();
