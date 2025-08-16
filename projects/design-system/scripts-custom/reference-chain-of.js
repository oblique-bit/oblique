#!/usr/bin/env node

/**
 * Token Chain Helper
 * Usage: node scripts-custom/reference-chain-of.js "ob.h.button.color.fg.primary.disabled"
 * Usage: node scripts-custom/reference-chain-of.js --figma
 * Or add alias: alias "reference chain of"="node scripts-custom/reference-chain-of.js"
 */

const { spawn } = require('child_process');
const path = require('path');

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node reference-chain-of.js <token-name>');
        console.log('       node reference-chain-of.js --figma');
        console.log('Example: node reference-chain-of.js "ob.h.button.color.fg.primary.disabled"');
        console.log('Example: node reference-chain-of.js --figma');
        process.exit(1);
    }
    
    // Path to the trace-token-chain.js script
    const traceScript = path.join(__dirname, 'trace-token-chain.js');
    
    // Check if first argument is --figma
    if (args[0] === '--figma') {
        // Run with --figma flag
        const child = spawn('node', [traceScript, '--figma'], {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        child.on('exit', (code) => {
            process.exit(code || 0);
        });
    } else {
        // Combine all arguments into a single token name (in case spaces in quotes)
        const tokenName = args.join(' ');
        
        // Run the token chain tracer
        const child = spawn('node', [traceScript, tokenName], {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        child.on('exit', (code) => {
            process.exit(code || 0);
        });
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { main };
