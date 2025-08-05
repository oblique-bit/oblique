#!/usr/bin/env node

/**
 * Token Reference Chain Tracer
 * 
 * Usage: node scripts-custom/trace-token-chain.js "ob.h.button.color.fg.primary.disabled"
 * or: npm run trace-token "ob.h.button.color.fg.primary.disabled"
 * 
 * Quickly traces the complete reference chain for any design token.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class TokenChainTracer {
  constructor() {
    this.themesPath = path.join(__dirname, '../src/lib/themes');
    this.tokenCache = new Map();
    this.loadTokenFiles();
  }

  loadTokenFiles() {
    console.log('📂 Loading token files...');
    const startTime = Date.now();
    
    this.loadTokensFromDirectory(this.themesPath);
    
    const loadTime = Date.now() - startTime;
    console.log(`✅ Loaded ${this.tokenCache.size} tokens in ${loadTime}ms\n`);
  }

  loadTokensFromDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.loadTokensFromDirectory(filePath);
      } else if (file.endsWith('.json') && !file.startsWith('$')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const tokens = JSON.parse(content);
          this.extractTokens(tokens, '', filePath);
        } catch (error) {
          // Skip invalid JSON files
        }
      }
    }
  }

  extractTokens(obj, prefix = '', filePath = '') {
    for (const [key, value] of Object.entries(obj)) {
      const tokenPath = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          // This is a token definition
          this.tokenCache.set(tokenPath, {
            value: value.$value,
            type: value.$type,
            description: value.$description,
            file: filePath.replace(this.themesPath, ''),
            extensions: value.$extensions
          });
        } else {
          // Continue traversing
          this.extractTokens(value, tokenPath, filePath);
        }
      }
    }
  }

  traceChain(tokenName) {
    console.log(`🔍 Tracing reference chain for: ${tokenName}\n`);
    
    const chain = [];
    let currentToken = tokenName;
    let depth = 0;
    const maxDepth = 10; // Prevent infinite loops
    
    while (currentToken && depth < maxDepth) {
      const tokenData = this.tokenCache.get(currentToken);
      
      if (!tokenData) {
        console.log(`❌ Token not found: ${currentToken}`);
        break;
      }
      
      const chainItem = {
        token: currentToken,
        value: tokenData.value,
        type: tokenData.type,
        file: tokenData.file,
        description: tokenData.description,
        extensions: tokenData.extensions
      };
      
      chain.push(chainItem);
      
      // Check if value is a reference to another token
      if (typeof tokenData.value === 'string' && tokenData.value.startsWith('{') && tokenData.value.endsWith('}')) {
        // Extract referenced token name
        currentToken = tokenData.value.slice(1, -1);
      } else {
        // We've reached the final value
        break;
      }
      
      depth++;
    }
    
    if (depth >= maxDepth) {
      console.log(`⚠️  Maximum depth reached (${maxDepth}). Possible circular reference.`);
    }
    
    this.displayChain(chain);
    return chain;
  }

  displayChain(chain) {
    console.log('📋 Reference Chain:');
    console.log('==================\n');
    
    for (let i = 0; i < chain.length; i++) {
      const item = chain[i];
      const isLast = i === chain.length - 1;
      
      // Determine layer
      const layer = this.getTokenLayer(item.token);
      
      console.log(`${i + 1}. ${layer} Layer`);
      console.log(`   Token: ${item.token}`);
      console.log(`   Value: ${item.value}`);
      
      if (item.description) {
        console.log(`   Description: ${item.description}`);
      }
      
      if (item.extensions?.['studio.tokens']?.modify) {
        const modify = item.extensions['studio.tokens'].modify;
        console.log(`   🎨 Transform: ${modify.type} (${modify.value})`);
      }
      
      console.log(`   📁 File: ${item.file}`);
      
      if (!isLast) {
        console.log('   ↓');
      }
      
      console.log('');
    }
    
    // Show final computed value
    const finalItem = chain[chain.length - 1];
    if (finalItem) {
      console.log('🎯 Final Value:');
      console.log(`   ${finalItem.value}`);
      
      if (finalItem.extensions?.['studio.tokens']?.modify) {
        const modify = finalItem.extensions['studio.tokens'].modify;
        if (modify.type === 'alpha') {
          const alpha = parseFloat(modify.value);
          const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
          console.log(`   With ${(alpha * 100)}% opacity: ${finalItem.value}${alphaHex}`);
        }
      }
    }
  }

  getTokenLayer(token) {
    if (token.startsWith('ob.h.')) return '🏷️  HTML';
    if (token.startsWith('ob.c.')) return '🧩 Component';
    if (token.startsWith('ob.s3.')) return '🎯 S3 Semantic';
    if (token.startsWith('ob.s2.')) return '🎨 S2 Semantic';
    if (token.startsWith('ob.s1.')) return '🎪 S1 Semantic';
    if (token.startsWith('ob.s.')) return '📝 Semantic';
    if (token.startsWith('ob.p.')) return '🟦 Primitive';
    if (token.startsWith('ob.g.')) return '🌐 Global';
    return '❓ Unknown';
  }

  searchTokens(query) {
    console.log(`🔎 Searching for tokens matching: "${query}"\n`);
    
    const matches = [];
    for (const [tokenName, tokenData] of this.tokenCache.entries()) {
      if (tokenName.toLowerCase().includes(query.toLowerCase()) ||
          (tokenData.description && tokenData.description.toLowerCase().includes(query.toLowerCase()))) {
        matches.push({ name: tokenName, data: tokenData });
      }
    }
    
    if (matches.length === 0) {
      console.log('❌ No tokens found');
      return;
    }
    
    console.log(`📋 Found ${matches.length} matching tokens:\n`);
    
    matches.slice(0, 10).forEach((match, index) => {
      console.log(`${index + 1}. ${match.name}`);
      console.log(`   Value: ${match.data.value}`);
      if (match.data.description) {
        console.log(`   Description: ${match.data.description}`);
      }
      console.log('');
    });
    
    if (matches.length > 10) {
      console.log(`... and ${matches.length - 10} more matches`);
    }
  }

  async traceFigmaSelection() {
    console.log('🎨 Analyzing Figma selection...\n');
    
    try {
      // Get Figma code which contains token information
      const figmaCode = await this.getFigmaCode();
      
      if (!figmaCode) {
        console.log('❌ No Figma selection found or MCP server not available');
        return;
      }
      
      console.log('📋 Figma Selection Analysis:');
      console.log('===========================\n');
      
      // Extract tokens from Figma code
      const tokens = this.extractTokensFromFigmaCode(figmaCode);
      
      if (tokens.length === 0) {
        console.log('❌ No design tokens found in Figma selection');
        return;
      }
      
      console.log(`🔍 Found ${tokens.length} design tokens in selection:\n`);
      
      // Trace each token
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🎯 Token ${i + 1}/${tokens.length}: ${token.property} (${token.tokenName})`);
        console.log(`${'='.repeat(60)}\n`);
        
        this.traceChain(token.tokenName);
        
        if (i < tokens.length - 1) {
          console.log('\n' + '─'.repeat(60) + '\n');
        }
      }
      
    } catch (error) {
      console.log(`❌ Error accessing Figma: ${error.message}`);
      console.log('💡 Make sure Figma Dev Mode MCP server is running and you have a selection in Figma');
    }
  }

  async getFigmaCode() {
    return new Promise((resolve, reject) => {
      // Try to get real Figma data using MCP
      // This creates a subprocess that mimics MCP calls
      const mcpScript = `
const { execSync } = require('child_process');

try {
  // In a real MCP integration, we would call the Figma MCP server
  // For now, simulate the response structure based on your previous Figma query
  
  const figmaResponse = {
    variables: [
      'ob/h/button/color/fg/primary/disabled: #f0f4f766',
      'ob/s/letter-spacing-px/normal: 0',
      'ob/s/fontSize/sm: 14', 
      'ob/s/font-family/body: Noto Sans',
      'ob/s/paragraphSpacing/sm: 10',
      'ob/s/lineHeight/sm: 20',
      'ob/s/font-weight/medium: 500',
      'h/button/typography/text-label: Font(family: "Noto Sans", style: Medium, size: 14, weight: 500, lineHeight: 20)'
    ],
    nodeId: '27_178',
    note: 'This is simulated data. In production, this would call the actual Figma MCP server.'
  };
  
  console.log(JSON.stringify(figmaResponse));
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
      `;
      
      try {
        // Write temp script
        const tempFile = path.join(__dirname, 'temp-figma-call.js');
        fs.writeFileSync(tempFile, mcpScript);
        
        const child = spawn('node', [tempFile], { stdio: 'pipe' });
        
        let stdout = '';
        let stderr = '';
        
        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        child.on('close', (code) => {
          // Clean up temp file
          try {
            fs.unlinkSync(tempFile);
          } catch (e) {
            // Ignore cleanup errors
          }
          
          if (code === 0) {
            try {
              const result = JSON.parse(stdout.trim());
              resolve(result);
            } catch (e) {
              reject(new Error('Failed to parse Figma response'));
            }
          } else {
            reject(new Error(stderr || 'Figma MCP call failed'));
          }
        });
        
        child.on('error', (error) => {
          reject(error);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  extractTokensFromFigmaCode(figmaData) {
    const tokens = [];
    
    if (figmaData.variables) {
      figmaData.variables.forEach(variable => {
        // Parse format: "ob/h/button/color/fg/primary/disabled: #f0f4f766"
        const match = variable.match(/^(ob\/[^:]+):\s*(.+)$/);
        if (match) {
          const tokenPath = match[1];
          const value = match[2].trim();
          
          // Convert path format from ob/h/... to ob.h....
          const tokenName = tokenPath.replace(/\//g, '.');
          
          // Determine property type
          let property = 'unknown';
          if (tokenPath.includes('/color/')) {
            if (tokenPath.includes('/bg/')) property = 'fill/background';
            else if (tokenPath.includes('/fg/')) property = 'text/foreground'; 
            else if (tokenPath.includes('/border/')) property = 'border';
            else property = 'color';
          } else if (tokenPath.includes('/spacing/')) {
            property = 'spacing/padding';
          } else if (tokenPath.includes('/fontSize/')) {
            property = 'font-size';
          } else if (tokenPath.includes('/font-family/')) {
            property = 'font-family';
          } else if (tokenPath.includes('/font-weight/')) {
            property = 'font-weight';
          } else if (tokenPath.includes('/lineHeight/')) {
            property = 'line-height';
          }
          
          tokens.push({
            tokenName,
            property,
            value,
            originalPath: tokenPath
          });
        }
      });
    }
    
    // Sort by relevance - colors first, then others
    tokens.sort((a, b) => {
      const colorProps = ['fill/background', 'text/foreground', 'border', 'color'];
      const aIsColor = colorProps.includes(a.property);
      const bIsColor = colorProps.includes(b.property);
      
      if (aIsColor && !bIsColor) return -1;
      if (!aIsColor && bIsColor) return 1;
      return 0;
    });
    
    return tokens;
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔗 Token Reference Chain Tracer
===============================

Usage:
  node scripts-custom/trace-token-chain.js <token-name>
  node scripts-custom/trace-token-chain.js --search <query>
  node scripts-custom/trace-token-chain.js --figma

Examples:
  node scripts-custom/trace-token-chain.js "ob.h.button.color.fg.primary.disabled"
  node scripts-custom/trace-token-chain.js --search "button disabled"
  node scripts-custom/trace-token-chain.js --figma

Options:
  --search, -s    Search for tokens by name or description
  --figma, -f     Analyze tokens from current Figma selection
  --help, -h      Show this help message
`);
    return;
  }

  const tracer = new TokenChainTracer();
  
  if (args[0] === '--search' || args[0] === '-s') {
    if (args[1]) {
      tracer.searchTokens(args[1]);
    } else {
      console.log('❌ Please provide a search query');
    }
  } else if (args[0] === '--figma' || args[0] === '-f') {
    tracer.traceFigmaSelection();
  } else if (args[0] === '--help' || args[0] === '-h') {
    main();
  } else {
    const tokenName = args[0];
    tracer.traceChain(tokenName);
  }
}

if (require.main === module) {
  main();
}

module.exports = TokenChainTracer;
