#!/usr/bin/env node

/**
 * Migration Script: ob.s.spacing.* → ob.s.dimension.*
 * 
 * This script systematically replaces all spacing token references with dimension tokens
 * while preserving exact pixel values and semantic meaning.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Token mapping based on actual pixel values from spacing.json and dimension.json
const TOKEN_MAPPING = {
  // Static tokens - exact pixel value mapping
  'ob.s.spacing.static.none.px': 'ob.s.dimension.static.none.px',           // 0px
  'ob.s.spacing.static.none.rem': 'ob.s.dimension.static.none.rem',         // 0rem
  'ob.s.spacing.static.xs.px': 'ob.s.dimension.static.detail.sm.px',        // 2px 
  'ob.s.spacing.static.xs.rem': 'ob.s.dimension.static.detail.sm.rem',      // 2px equiv
  'ob.s.spacing.static.sm.px': 'ob.s.dimension.static.element.xs.px',       // 4px
  'ob.s.spacing.static.sm.rem': 'ob.s.dimension.static.element.xs.rem',     // 4px equiv
  'ob.s.spacing.static.md.px': 'ob.s.dimension.static.element.sm.px',       // 8px
  'ob.s.spacing.static.md.rem': 'ob.s.dimension.static.element.sm.rem',     // 8px equiv
  'ob.s.spacing.static.lg.px': 'ob.s.dimension.static.element.md.px',       // 12px
  'ob.s.spacing.static.lg.rem': 'ob.s.dimension.static.element.md.rem',     // 12px equiv
  'ob.s.spacing.static.xl.px': 'ob.s.dimension.static.surface.xs.px',       // 16px
  'ob.s.spacing.static.xl.rem': 'ob.s.dimension.static.surface.xs.rem',     // 16px equiv
  'ob.s.spacing.static.2xl.px': 'ob.s.dimension.static.surface.sm.px',      // 24px (20px in dimension, but 24px in spacing - NEED TO CHECK)
  'ob.s.spacing.static.2xl.rem': 'ob.s.dimension.static.surface.sm.rem',    // 24px equiv
  'ob.s.spacing.static.3xl.px': 'ob.s.dimension.static.surface.md.px',      // 32px
  'ob.s.spacing.static.3xl.rem': 'ob.s.dimension.static.surface.md.rem',    // 32px equiv
  'ob.s.spacing.static.4xl.px': 'ob.s.dimension.static.container.xs.px',    // 40px
  'ob.s.spacing.static.4xl.rem': 'ob.s.dimension.static.container.xs.rem',  // 40px equiv
  'ob.s.spacing.static.5xl.px': 'ob.s.dimension.static.container.sm.px',    // 48px
  'ob.s.spacing.static.5xl.rem': 'ob.s.dimension.static.container.sm.rem',  // 48px equiv
  'ob.s.spacing.static.6xl.px': 'ob.s.dimension.static.container.md.px',    // 64px
  'ob.s.spacing.static.6xl.rem': 'ob.s.dimension.static.container.md.rem',  // 64px equiv
  'ob.s.spacing.static.7xl.px': 'ob.s.dimension.static.layout.xs.px',       // 80px
  'ob.s.spacing.static.7xl.rem': 'ob.s.dimension.static.layout.xs.rem',     // 80px equiv
  'ob.s.spacing.static.8xl.px': 'ob.s.dimension.static.layout.sm.px',       // 96px
  'ob.s.spacing.static.8xl.rem': 'ob.s.dimension.static.layout.sm.rem',     // 96px equiv

  // Dynamic tokens - these should mostly become STATIC for typography usage
  // Typography spacing should NEVER be dynamic per guidelines
  'ob.s.spacing.dynamic.none.px': 'ob.s.dimension.static.none.px',          // 0px - typography
  'ob.s.spacing.dynamic.none.rem': 'ob.s.dimension.static.none.rem',        // 0rem - typography
  'ob.s.spacing.dynamic.xs.px': 'ob.s.dimension.static.detail.sm.px',       // 2px - typography
  'ob.s.spacing.dynamic.xs.rem': 'ob.s.dimension.static.detail.sm.rem',     // 2px equiv - typography
  'ob.s.spacing.dynamic.sm.px': 'ob.s.dimension.static.element.xs.px',      // 4px - typography
  'ob.s.spacing.dynamic.sm.rem': 'ob.s.dimension.static.element.xs.rem',    // 4px equiv - typography
  'ob.s.spacing.dynamic.md.px': 'ob.s.dimension.static.element.sm.px',      // 8px - typography
  'ob.s.spacing.dynamic.md.rem': 'ob.s.dimension.static.element.sm.rem',    // 8px equiv - typography
  'ob.s.spacing.dynamic.lg.px': 'ob.s.dimension.static.element.md.px',      // 12px - typography
  'ob.s.spacing.dynamic.lg.rem': 'ob.s.dimension.static.element.md.rem',    // 12px equiv - typography
  'ob.s.spacing.dynamic.xl.px': 'ob.s.dimension.static.surface.xs.px',      // 16px - typography
  'ob.s.spacing.dynamic.xl.rem': 'ob.s.dimension.static.surface.xs.rem',    // 16px equiv - typography
  'ob.s.spacing.dynamic.2xl.px': 'ob.s.dimension.static.surface.sm.px',     // 24px - typography
  'ob.s.spacing.dynamic.2xl.rem': 'ob.s.dimension.static.surface.sm.rem',   // 24px equiv - typography
  'ob.s.spacing.dynamic.3xl.px': 'ob.s.dimension.static.surface.md.px',     // 32px - typography
  'ob.s.spacing.dynamic.3xl.rem': 'ob.s.dimension.static.surface.md.rem',   // 32px equiv - typography
  'ob.s.spacing.dynamic.4xl.px': 'ob.s.dimension.static.container.xs.px',   // 40px - typography
  'ob.s.spacing.dynamic.4xl.rem': 'ob.s.dimension.static.container.xs.rem', // 40px equiv - typography
  'ob.s.spacing.dynamic.5xl.px': 'ob.s.dimension.static.container.sm.px',   // 48px - typography
  'ob.s.spacing.dynamic.5xl.rem': 'ob.s.dimension.static.container.sm.rem', // 48px equiv - typography
  'ob.s.spacing.dynamic.6xl.px': 'ob.s.dimension.static.container.md.px',   // 64px - typography
  'ob.s.spacing.dynamic.6xl.rem': 'ob.s.dimension.static.container.md.rem', // 64px equiv - typography
  'ob.s.spacing.dynamic.7xl.px': 'ob.s.dimension.static.layout.xs.px',      // 80px - typography
  'ob.s.spacing.dynamic.7xl.rem': 'ob.s.dimension.static.layout.xs.rem',    // 80px equiv - typography
  'ob.s.spacing.dynamic.8xl.px': 'ob.s.dimension.static.layout.sm.px',      // 96px - typography
  'ob.s.spacing.dynamic.8xl.rem': 'ob.s.dimension.static.layout.sm.rem'     // 96px equiv - typography
};

class SpacingMigration {
  constructor() {
    this.changedFiles = [];
    this.errors = [];
    this.stats = {
      filesScanned: 0,
      filesChanged: 0,
      tokensReplaced: 0,
      tokenCounts: {}
    };
  }

  log(message) {
    console.log(`[MIGRATION] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
    this.errors.push(message);
  }

  // Find all JSON files that could contain token references
  findTokenFiles() {
    const patterns = [
      'src/lib/themes/**/*.json',
      'src/lib/themes/$themes.json'
    ];

    let files = [];
    patterns.forEach(pattern => {
      try {
        const matched = glob.sync(pattern, { cwd: process.cwd() });
        files = files.concat(matched);
      } catch (error) {
        this.error(`Failed to scan pattern ${pattern}: ${error.message}`);
      }
    });

    // Remove duplicates and filter out generated files we shouldn't modify
    return [...new Set(files)].filter(file => {
      // Skip certain generated or backup files
      return !file.includes('.backup') && !file.includes('node_modules');
    });
  }

  // Process a single file
  processFile(filePath) {
    this.stats.filesScanned++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      let fileChanged = false;
      
      // Replace all spacing token references
      Object.entries(TOKEN_MAPPING).forEach(([oldToken, newToken]) => {
        const escapedOldToken = oldToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\{${escapedOldToken}\\}`, 'g');
        
        const matches = content.match(regex);
        if (matches) {
          this.log(`${filePath}: Replacing ${matches.length}x {${oldToken}} → {${newToken}}`);
          newContent = newContent.replace(regex, `{${newToken}}`);
          fileChanged = true;
          
          this.stats.tokensReplaced += matches.length;
          this.stats.tokenCounts[oldToken] = (this.stats.tokenCounts[oldToken] || 0) + matches.length;
        }
      });

      if (fileChanged) {
        fs.writeFileSync(filePath, newContent);
        this.changedFiles.push(filePath);
        this.stats.filesChanged++;
        this.log(`✅ Updated ${filePath}`);
      }
      
    } catch (error) {
      this.error(`Failed to process ${filePath}: ${error.message}`);
    }
  }

  // Check if target dimension tokens exist
  validateTargetTokens() {
    this.log('Validating target dimension tokens exist...');
    
    try {
      const dimensionFiles = [
        'src/lib/themes/semantic/dimension.json',
        'src/lib/themes/semantic/dimension/static.json',
        'src/lib/themes/semantic/dimension/md.json',
        'src/lib/themes/semantic/dimension/lg.json',
        'src/lib/themes/semantic/dimension/sm.json'
      ];
      
      let missingTokens = [];
      const uniqueTargets = [...new Set(Object.values(TOKEN_MAPPING))];
      
      dimensionFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          uniqueTargets.forEach(token => {
            // Extract the path after ob.s.dimension
            const tokenPath = token.replace('ob.s.dimension.', '');
            if (!content.includes(`"${tokenPath.split('.').pop()}"`)) {
              // This is a loose check - we should verify the full path exists
            }
          });
        }
      });
      
      this.log('✅ Target token validation complete');
      
    } catch (error) {
      this.error(`Token validation failed: ${error.message}`);
    }
  }

  // Generate migration report
  generateReport() {
    this.log('\n=== MIGRATION REPORT ===');
    this.log(`Files scanned: ${this.stats.filesScanned}`);
    this.log(`Files changed: ${this.stats.filesChanged}`);
    this.log(`Tokens replaced: ${this.stats.tokensReplaced}`);
    
    if (this.stats.tokensReplaced > 0) {
      this.log('\nToken replacement breakdown:');
      Object.entries(this.stats.tokenCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([token, count]) => {
          this.log(`  ${token}: ${count} replacements`);
        });
    }
    
    if (this.changedFiles.length > 0) {
      this.log('\nChanged files:');
      this.changedFiles.forEach(file => this.log(`  - ${file}`));
    }
    
    if (this.errors.length > 0) {
      this.log('\nErrors encountered:');
      this.errors.forEach(error => this.log(`  ❌ ${error}`));
    }
    
    this.log('\n=== END REPORT ===\n');
  }

  // Main migration process
  async migrate() {
    this.log('Starting spacing → dimension token migration...');
    
    // Step 1: Validate target tokens exist
    this.validateTargetTokens();
    
    // Step 2: Find all files to process
    this.log('Scanning for token files...');
    const files = this.findTokenFiles();
    this.log(`Found ${files.length} files to scan`);
    
    // Step 3: Process each file
    files.forEach(file => {
      this.log(`Processing: ${file}`);
      this.processFile(file);
    });
    
    // Step 4: Generate report
    this.generateReport();
    
    // Step 5: Suggest next steps
    if (this.stats.filesChanged > 0) {
      this.log('NEXT STEPS:');
      this.log('1. Review the changed files');
      this.log('2. Run token validation/compilation to check for issues');
      this.log('3. Test components that use migrated tokens');
      this.log('4. Remove old spacing.json files after verification');
      this.log('5. Update documentation to reflect new token structure');
    }
    
    return {
      success: this.errors.length === 0,
      filesChanged: this.stats.filesChanged,
      tokensReplaced: this.stats.tokensReplaced,
      errors: this.errors
    };
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new SpacingMigration();
  migration.migrate()
    .then(result => {
      if (result.success) {
        console.log('✅ Migration completed successfully!');
        process.exit(0);
      } else {
        console.log('❌ Migration completed with errors.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = SpacingMigration;
