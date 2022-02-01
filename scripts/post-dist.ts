const {execSync} = require('child_process');

execSync('ts-node ./scripts/find-and-replace.ts');
execSync('ts-node ./scripts/adapt-package-json.ts');
execSync('ts-node ./scripts/generate-component-styles.ts');
