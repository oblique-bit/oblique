const fs = require('fs');

try {
  const tooltip = JSON.parse(fs.readFileSync('src/lib/themes/component/atom/tooltip.json', 'utf8'));
  const typography = JSON.parse(fs.readFileSync('src/lib/themes/semantic/typography/grouped/static.json', 'utf8'));
  
  console.log('Tooltip typography reference:', tooltip.ob.c.tooltip.typography.label.$value);
  
  // Navigate to the referenced token
  const token = typography.ob.s.typography.scale.static.sm.strong;
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token structure:', JSON.stringify(token, null, 2));
  }
} catch(e) {
  console.error('Error:', e.message);
}
