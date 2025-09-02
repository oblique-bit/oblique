const fs = require('fs');
const glob = require('glob');

function updateStepperMobileReferences() {
  console.log('Updating stepperMobile to stepper_mobile references...');
  
  // Find all markdown files
  const files = glob.sync('**/*.md', {
    ignore: ['node_modules/**', '.git/**'],
    absolute: true
  });
  
  console.log(`Found ${files.length} markdown files to check`);
  
  let totalReplacements = 0;
  let filesModified = 0;
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let originalContent = content;
      let fileReplacements = 0;
      
      // Replace stepperMobile with stepper_mobile in all token references
      const regex = /stepperMobile/g;
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, 'stepper_mobile');
        fileReplacements = matches.length;
        totalReplacements += matches.length;
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        console.log(`${file.replace(process.cwd(), '.')}: ${fileReplacements} replacements`);
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  console.log(`\n=== STEPPER MOBILE TOKEN UPDATE COMPLETE ===`);
  console.log(`Files processed: ${files.length}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total replacements: ${totalReplacements}`);
}

// Run the update
updateStepperMobileReferences();
