const execSync = require('child_process').execSync;

execSync('ts-node ./scripts/find-and-replace.ts');
execSync('ts-node ./scripts/adapt-package-json.ts');
