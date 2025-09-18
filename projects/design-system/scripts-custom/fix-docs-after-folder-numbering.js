#!/usr/bin/env node
/**
 * Fix Documentation After Folder Numbering & Token Changes
 * Comprehensive fixer for documentation references after:
 * - Folder numbering (global → 01_global, semantic → 03_semantic, etc.)
 * - Dimension conflict resolution
 * - Copilot description token cleanup
 */

const fs = require('fs');
const path = require('path');

const DOC_ROOT = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/documentation';

// Folder renames from recent numbering
const FOLDER_MAPPINGS = {
  'global/': '01_global/',
  'primitive/': '02_primitive/',
  'semantic/': '03_semantic/', 
  'component/': '04_component/',
  'html/': '05_html/',
  
  // Also handle without trailing slash
  'global': '01_global',
  'primitive': '02_primitive', 
  'semantic': '03_semantic',
  'component': '04_component',
  'html': '05_html'
};

// Token path updates from folder renaming
const TOKEN_PATH_MAPPINGS = {
  // Examples of common token path references that need updating
  'themes/global/': 'themes/01_global/',
  'themes/primitive/': 'themes/02_primitive/',
  'themes/semantic/': 'themes/03_semantic/',
  'themes/component/': 'themes/04_component/',
  'themes/html/': 'themes/05_html/',
  
  // Specific file references  
  'semantic/dimension.json': '03_semantic/dimension/static.json',
  'semantic/dimension/': '03_semantic/dimension/',
  'dimension.json': 'dimension/static.json'
};

class DocumentationFixer {
  constructor() {
    this.fixedReferences = 0;
    this.fixedFiles = 0;
    this.processedFiles = 0;
  }

  async fixAllDocumentation() {
    console.log('🔧 FIXING DOCUMENTATION REFERENCES AFTER FOLDER NUMBERING');
    console.log('========================================================');
    
    await this.processDirectory(DOC_ROOT);
    
    console.log('\n📊 SUMMARY');
    console.log('==========');
    console.log(`Files processed: ${this.processedFiles}`);
    console.log(`Files modified: ${this.fixedFiles}`);
    console.log(`References fixed: ${this.fixedReferences}`);
    
    return {
      processed: this.processedFiles,
      modified: this.fixedFiles,
      fixed: this.fixedReferences
    };
  }

  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.')) {
        await this.processDirectory(fullPath);
      } else if (item.name.endsWith('.md')) {
        await this.fixDocumentationFile(fullPath);
      }
    }
  }

  async fixDocumentationFile(filePath) {
    try {
      this.processedFiles++;
      const relativePath = path.relative(DOC_ROOT, filePath);
      console.log(`📄 Processing: ${relativePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      let changesInThisFile = 0;

      // Fix folder references in markdown links and paths
      for (const [oldFolder, newFolder] of Object.entries(FOLDER_MAPPINGS)) {
        // Fix markdown links [text](path/oldFolder/file)
        const linkRegex = new RegExp(`\\]\\([^)]*${oldFolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        const linkMatches = content.match(linkRegex);
        if (linkMatches) {
          content = content.replace(new RegExp(oldFolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newFolder);
          changesInThisFile += linkMatches.length;
        }

        // Fix code blocks and file paths
        const pathRegex = new RegExp(`/${oldFolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        const pathMatches = content.match(pathRegex);
        if (pathMatches) {
          content = content.replace(pathRegex, `/${newFolder}`);
          changesInThisFile += pathMatches.length;
        }

        // Fix theme file references
        const themeRegex = new RegExp(`themes/${oldFolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        const themeMatches = content.match(themeRegex);
        if (themeMatches) {
          content = content.replace(themeRegex, `themes/${newFolder}`);
          changesInThisFile += themeMatches.length;
        }
      }

      // Fix token path references
      for (const [oldPath, newPath] of Object.entries(TOKEN_PATH_MAPPINGS)) {
        const tokenRegex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const tokenMatches = content.match(tokenRegex);
        if (tokenMatches) {
          content = content.replace(tokenRegex, newPath);
          changesInThisFile += tokenMatches.length;
        }
      }

      // Fix common token reference patterns that might be broken
      const tokenPatterns = [
        // Token Studio sync references
        { pattern: /Token Studio.*semantic\/dimension\.json/g, replacement: 'Token Studio 03_semantic/dimension/static.json' },
        
        // File path references in documentation
        { pattern: /src\/lib\/themes\/semantic\/dimension\.json/g, replacement: 'src/lib/themes/03_semantic/dimension/static.json' },
        { pattern: /src\/lib\/themes\/global\//g, replacement: 'src/lib/themes/01_global/' },
        { pattern: /src\/lib\/themes\/primitive\//g, replacement: 'src/lib/themes/02_primitive/' },
        { pattern: /src\/lib\/themes\/semantic\//g, replacement: 'src/lib/themes/03_semantic/' },
        { pattern: /src\/lib\/themes\/component\//g, replacement: 'src/lib/themes/04_component/' },
        { pattern: /src\/lib\/themes\/html\//g, replacement: 'src/lib/themes/05_html/' },
        
        // Documentation examples referring to old structure
        { pattern: /`global\/`/g, replacement: '`01_global/`' },
        { pattern: /`primitive\/`/g, replacement: '`02_primitive/`' },
        { pattern: /`semantic\/`/g, replacement: '`03_semantic/`' },
        { pattern: /`component\/`/g, replacement: '`04_component/`' },
        { pattern: /`html\/`/g, replacement: '`05_html/`' }
      ];

      for (const { pattern, replacement } of tokenPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          content = content.replace(pattern, replacement);
          changesInThisFile += matches.length;
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixedFiles++;
        this.fixedReferences += changesInThisFile;
        console.log(`✅ Fixed ${changesInThisFile} references in ${relativePath}`);
      } else {
        console.log(`   No changes needed`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
}

// CLI execution
if (require.main === module) {
  const fixer = new DocumentationFixer();
  fixer.fixAllDocumentation()
    .then(results => {
      console.log('\n🎉 Documentation fixing complete!');
      if (results.modified > 0) {
        console.log('💡 Please review the changes and commit when ready.');
      }
    })
    .catch(console.error);
}

module.exports = { DocumentationFixer };
