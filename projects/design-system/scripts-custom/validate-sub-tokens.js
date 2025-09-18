const fs = require('fs');

try {
  // Load all relevant token files
  const typography = JSON.parse(fs.readFileSync('src/lib/themes/semantic/typography/grouped/static.json', 'utf8'));
  const staticTokens = JSON.parse(fs.readFileSync('src/lib/themes/semantic/typography/single/static.json', 'utf8'));
  
  const smStrong = typography.ob.s.typography.scale.static.sm.strong.$value;
  
  console.log('Validating sub-tokens for ob.s.typography.scale.static.sm.strong:');
  console.log('');
  
  // Check each sub-token
  Object.entries(smStrong).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
    
    if (typeof value === 'string' && value.includes('{') && value.includes('}')) {
      // Extract token reference
      const tokenRef = value.match(/\{([^}]+)\}/)[1];
      const tokenPath = tokenRef.split('.');
      
      // Try to find the token
      let found = false;
      try {
        if (tokenPath[0] === 'ob' && tokenPath[1] === 's' && tokenPath[2] === 'static') {
          // Check in static tokens
          let current = staticTokens;
          for (let part of tokenPath) {
            if (current && current[part]) {
              current = current[part];
            } else {
              current = null;
              break;
            }
          }
          found = !!current;
        }
      } catch (e) {
        found = false;
      }
      
      console.log(`  → Token exists: ${found ? '✅' : '❌'}`);
    }
    console.log('');
  });
  
} catch(e) {
  console.error('Error:', e.message);
}
