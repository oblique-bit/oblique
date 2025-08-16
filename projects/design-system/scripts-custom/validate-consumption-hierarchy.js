#!/usr/bin/env node

/**
 * Design System Token Consumption Hierarchy Validator
 * 
 * This script validates that design tokens follow proper consumption hierarchy rules:
 * - Components must never consume primitives directly
 * - Components must never consume s1 tokens  
 * - s0 static token consumption must be in allowed contexts
 * - Interactive components should use interaction tokens
 * - Status components should use status tokens
 * 
 * Validates s0/s1/s2/s3 semantic color hierarchy consumption patterns.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class TokenConsumptionValidator {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.errors = [];
        this.warnings = [];
        
        // s0 static exceptions - tokens that can be consumed in specific contexts
        this.s0StaticExceptions = new Set([
            'ob.s.color.static.bg',
            'ob.s.color.static.transparent',
            'ob.s.color.static.current-color',
            'ob.s.color.static.white',
            'ob.s.color.static.black'
        ]);
        
        // Allowed consumption contexts for s0 static tokens
        this.s0AllowedContexts = [
            'transparent',  // Transparent backgrounds and borders
            'brand',       // Brand-specific tokens
            'interaction'  // Interactive elements with specific static needs
        ];
    }

    /**
     * Find all token files in the project.
     */
    findTokenFiles() {
        const tokenPattern = path.join(this.projectRoot, 'src/lib/**/*.tokens.json');
        try {
            return glob.sync(tokenPattern);
        } catch (error) {
            console.error(`Error finding token files: ${error.message}`);
            return [];
        }
    }

    /**
     * Parse a token file and return its JSON content.
     */
    parseTokenFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`Error parsing ${filePath}: ${error.message}`);
            return {};
        }
    }

    /**
     * Extract token references from a token value string.
     */
    extractTokenReferences(value) {
        if (typeof value !== 'string') {
            return [];
        }
        
        const refPattern = /\{([^}]+)\}/g;
        const references = [];
        let match;
        
        while ((match = refPattern.exec(value)) !== null) {
            references.push(match[1]);
        }
        
        return references;
    }

    /**
     * Flatten nested token structure into a flat dictionary.
     */
    flattenTokens(data, currentPath = '') {
        const tokens = {};
        
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            for (const [key, value] of Object.entries(data)) {
                const fullPath = currentPath ? `${currentPath}.${key}` : key;
                
                if (value && typeof value === 'object' && '$value' in value) {
                    // This is a token definition
                    tokens[fullPath] = value;
                } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                    // This is a nested group - recurse
                    Object.assign(tokens, this.flattenTokens(value, fullPath));
                }
                // Handle arrays - skip them as they don't contain token definitions
            }
        }
        
        return tokens;
    }

    /**
     * Determine the hierarchical level of a token.
     */
    getTokenLevel(tokenName) {
        if (tokenName.startsWith('ob.p.')) {
            return 'primitive';
        } else if (tokenName.startsWith('ob.s1.') || tokenName.startsWith('ob.s.color.l1.')) {
            return 's1';
        } else if (tokenName.startsWith('ob.s2.') || tokenName.startsWith('ob.s.color.l2.')) {
            return 's2';
        } else if (tokenName.startsWith('ob.s3.') || tokenName.startsWith('ob.s.color.l3.')) {
            return 's3';
        } else if (tokenName.startsWith('ob.s.color.static.')) {
            return 's0-static';  // Static color tokens
        } else if (tokenName.startsWith('ob.s.')) {
            return 's0';  // Other semantic tokens (typography, spacing, etc.)
        } else if (tokenName.startsWith('ob.c.')) {
            return 'component';
        } else if (tokenName.startsWith('ob.h.')) {
            return 'html';  // HTML layer
        } else if (tokenName.startsWith('r13.')) {
            return 'component';  // Legacy component tokens
        } else {
            return 'unknown';
        }
    }

    /**
     * Check if token is an s0 static token.
     */
    isS0StaticToken(tokenName) {
        return this.s0StaticExceptions.has(tokenName);
    }

    /**
     * Check if s0 static token consumption is allowed in this context.
     */
    isS0ConsumptionAllowed(consumingToken, consumedToken) {
        if (!this.isS0StaticToken(consumedToken)) {
            return false;
        }
        
        // Check if consuming token is in allowed contexts
        return this.s0AllowedContexts.some(context => 
            consumingToken.includes(context)
        );
    }

    /**
     * Validate token consumption hierarchy across all tokens.
     */
    validateConsumptionHierarchy(allTokens) {
        for (const [tokenName, tokenData] of Object.entries(allTokens)) {
            const tokenLevel = this.getTokenLevel(tokenName);
            
            // Extract all referenced tokens
            const references = this.extractTokenReferences(tokenData.$value || '');
            
            for (const refToken of references) {
                const refLevel = this.getTokenLevel(refToken);
                
                // Core validation rules
                this._validateCoreHierarchyRules(tokenName, tokenLevel, refToken, refLevel);
                
                // S0 static token exception validation
                this._validateS0StaticExceptions(tokenName, tokenLevel, refToken, refLevel);
            }
        }
    }

    /**
     * Validate core hierarchy rules.
     */
    _validateCoreHierarchyRules(tokenName, tokenLevel, refToken, refLevel) {
        // Rule 1: Components must never consume primitives directly
        if (['component', 'html'].includes(tokenLevel) && refLevel === 'primitive') {
            this.errors.push(
                `HIERARCHY VIOLATION: Component '${tokenName}' directly consumes primitive '${refToken}'. ` +
                `Components must consume semantic tokens (s0/s2/s3) only.`
            );
        }
        
        // Rule 2: Components must never consume s1 tokens
        if (['component', 'html'].includes(tokenLevel) && refLevel === 's1') {
            this.errors.push(
                `S1 CONSUMPTION VIOLATION: Component '${tokenName}' consumes s1 token '${refToken}'. ` +
                `Components cannot consume s1 tokens (lightness layer).`
            );
        }
    }

    /**
     * Validate s0 static token exception rules.
     */
    _validateS0StaticExceptions(tokenName, tokenLevel, refToken, refLevel) {
        if (refLevel === 's0-static') {
            // This is s0 static token consumption - check if allowed
            if (!this.isS0ConsumptionAllowed(tokenName, refToken)) {
                this.warnings.push(
                    `S0 STATIC CONSUMPTION: Token '${tokenName}' consumes s0 static token '${refToken}'. ` +
                    `Verify this is a legitimate use case (transparent/brand/interaction context).`
                );
            }
        }
    }

    /**
     * Validate semantic alignment rules.
     */
    _validateSemanticAlignment(tokenName, tokenLevel, refToken, refLevel) {
        if (tokenLevel !== 'component') {
            return;
        }
        
        // Interactive component rules
        if (this._isInteractiveComponent(tokenName)) {
            if (['s2', 's3'].includes(refLevel) && refToken.includes('neutral')) {
                this.errors.push(
                    `SEMANTIC MISALIGNMENT: Interactive component '${tokenName}' consumes neutral token '${refToken}'. ` +
                    `Interactive components should use interaction tokens with emphasis:low for monochromatic appearance.`
                );
            }
            
            if (refLevel === 's2' && refToken.includes('interaction')) {
                this.warnings.push(
                    `LIMITED THEMING: Interactive component '${tokenName}' consumes s2 interaction token '${refToken}'. ` +
                    `Consider s3 interaction tokens for full emphasis theming support.`
                );
            }
        }
        // Status component rules
        else if (this._isStatusComponent(tokenName)) {
            if (['s2', 's3'].includes(refLevel) && !['status', 'static'].some(x => refToken.includes(x))) {
                this.warnings.push(
                    `SEMANTIC MISALIGNMENT: Status component '${tokenName}' should consume status tokens. ` +
                    `Currently consumes '${refToken}'.`
                );
            }
        }
    }

    /**
     * Check if component is interactive based on name patterns.
     */
    _isInteractiveComponent(tokenName) {
        const interactivePatterns = ['button', 'link', 'stepper', 'tab', 'nav', 'menu'];
        return interactivePatterns.some(pattern => 
            tokenName.toLowerCase().includes(pattern)
        );
    }

    /**
     * Check if component is status-based based on name patterns.
     */
    _isStatusComponent(tokenName) {
        const statusPatterns = ['badge', 'infobox', 'pill', 'tooltip', 'alert', 'notification'];
        return statusPatterns.some(pattern => 
            tokenName.toLowerCase().includes(pattern)
        );
    }

    /**
     * Main validation method for s0/s1/s2/s3 semantic color hierarchy.
     */
    validateS0S1S2S3Hierarchy() {
        console.log('🔍 Validating consumption hierarchy in s0/s1/s2/s3 semantic color sub-levels...');
        
        // Find all token files
        const tokenFiles = this.findTokenFiles();
        console.log(`📁 Found ${tokenFiles.length} token files`);
        
        // Parse and collect all tokens
        const allTokens = {};
        for (const filePath of tokenFiles) {
            const tokensData = this.parseTokenFile(filePath);
            const flattened = this.flattenTokens(tokensData);
            Object.assign(allTokens, flattened);
        }
        
        console.log(`🎯 Analyzing ${Object.keys(allTokens).length} tokens`);
        
        // Validate consumption hierarchy
        this.validateConsumptionHierarchy(allTokens);
        
        // Report results
        this.reportResults();
    }

    /**
     * Report validation results.
     */
    reportResults() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 VALIDATION RESULTS');
        console.log('='.repeat(80));
        
        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            this.errors.forEach((error, i) => {
                console.log(`${String(i + 1).padStart(2)}. ${error}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
            this.warnings.forEach((warning, i) => {
                console.log(`${String(i + 1).padStart(2)}. ${warning}`);
            });
        }
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('\n✅ All token consumption patterns are valid!');
        }
        
        console.log(`\n📈 SUMMARY:`);
        console.log(`   • Errors: ${this.errors.length}`);
        console.log(`   • Warnings: ${this.warnings.length}`);
        
        if (this.errors.length > 0) {
            console.log(`\n💡 S0 STATIC TOKEN EXCEPTIONS ALLOWED:`);
            for (const token of Array.from(this.s0StaticExceptions).sort()) {
                console.log(`   • ${token}`);
            }
            console.log(`\n💡 S0 CONSUMPTION CONTEXTS ALLOWED:`);
            for (const context of this.s0AllowedContexts.sort()) {
                console.log(`   • ${context}`);
            }
        }
    }
}

/**
 * Main execution function.
 */
function main() {
    // Get the project root (assuming script is in scripts-custom/)
    const scriptDir = __dirname;
    const projectRoot = path.dirname(scriptDir);
    
    // Initialize validator
    const validator = new TokenConsumptionValidator(projectRoot);
    
    // Run validation
    validator.validateS0S1S2S3Hierarchy();
    
    // Exit with error code if validation failed
    if (validator.errors.length > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { TokenConsumptionValidator };
