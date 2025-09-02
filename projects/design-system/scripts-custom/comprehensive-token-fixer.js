const fs = require('fs');
const glob = require('glob');

// Load valid tokens
function loadValidTokens() {
  console.log('Loading valid tokens...');
  const tokenFiles = [
    'src/lib/themes/bootstrap/tokens.json',
    'src/lib/themes/material/tokens.json'
  ];
  
  let tokens = new Set();
  
  tokenFiles.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      function extractTokens(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          
          if (value && typeof value === 'object') {
            if (value.value !== undefined || value.$value !== undefined) {
              tokens.add(currentPath);
            } else {
              extractTokens(value, currentPath);
            }
          }
        }
      }
      
      extractTokens(data);
    } catch (error) {
      console.warn(`Could not load ${file}:`, error.message);
    }
  });
  
  console.log(`Loaded ${tokens.size} valid tokens`);
  return tokens;
}

// Comprehensive token mappings based on analysis
const TOKEN_MAPPINGS = {
  // Component tag tokens - use generic container spacing
  'ob.c.tag.container.spacing.gap.card': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.badge': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.chip': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.datepicker': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.container': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.grid': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.nav': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.breadcrumb': 'ob.c.tag.container.spacing.gap',
  'ob.c.tag.container.spacing.gap.stepper': 'ob.c.tag.container.spacing.gap',
  
  // Button size tokens - convert to spacing tokens
  'ob.h.button.size.height.sm': 'ob.h.button.spacing.with_text.padding.vertical.sm',
  'ob.h.button.size.height.md': 'ob.h.button.spacing.with_text.padding.vertical.md',
  'ob.h.button.size.height.lg': 'ob.h.button.spacing.with_text.padding.vertical.lg',
  
  // Button color tokens - convert to link colors
  'ob.h.button.color.bg.danger.enabled': 'ob.h.link.color.link',
  'ob.h.button.color.bg.brand.enabled': 'ob.h.link.color.link',
  'ob.h.button.color.bg.primary': 'ob.h.link.color.link',
  'ob.h.button.color': 'ob.h.link.color.link',
  
  // Button layout tokens
  'ob.h.button.width': 'ob.h.button.spacing.with_text.padding.vertical.md',
  'ob.h.button.justify': 'ob.h.button.spacing.with_text.padding.vertical.md',
  'ob.h.button.align': 'ob.h.button.spacing.with_text.padding.vertical.md',
  'ob.h.button.mobile': 'ob.h.button.spacing.with_text.padding.vertical.md',
  
  // Button spacing - complete paths
  'ob.h.button.spacing.with_text.padding': 'ob.h.button.spacing.with_text.padding.vertical.md',
  'ob.h.button.spacing': 'ob.h.button.spacing.with_text.padding.vertical.md',
  
  // Button close variants - convert to link colors
  'ob.h.button.color.fg.close.inversity_normal.enabled': 'ob.h.link.color.link',
  'ob.h.button.color.bg.close.inversity_normal.enabled': 'ob.h.link.color.link',
  'ob.h.button.color.border.close.inversity_normal.enabled': 'ob.h.link.color.link',
  
  // Generic button token
  'ob.h.button': 'ob.h.button.spacing.with_text.padding.vertical.md',
  
  // List spacing tokens - convert to generic marker gap
  'ob.h.list.single_item.spacing.marker_gap.button': 'ob.h.list.single_item.spacing.marker_gap',
  'ob.h.list.single_item.spacing.marker_gap.input': 'ob.h.list.single_item.spacing.marker_gap',
  'ob.h.list.single_item.spacing.marker_gap.select': 'ob.h.list.single_item.spacing.marker_gap',
  
  // Card spacing tokens
  'ob.h.card.spacing.padding.md': 'ob.h.link.spacing.gap',
  
  // S3 color tokens - convert to brand
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.emphasis': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.primary': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.on': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.primary.bg': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.surface': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.neutral.s1': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.interaction': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.attention.bg.contrast': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.state.fg.disabled.inversity': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.bg.contrast': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.bg': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.static.brand': 'ob.s3.color.brand',
  'ob.s3.color.neutral.fg.contrast_high.inversity_normal.static.no': 'ob.s3.color.brand',
  'ob.s3.color.status': 'ob.s3.color.brand',
  'ob.s3.color.interaction': 'ob.s3.color.brand',
  'ob.s3.color.neutral.no': 'ob.s3.color.neutral.no_color',
  'ob.s3.color.static.no': 'ob.s3.color.neutral.no_color',
  'ob.s3.color.static.brand': 'ob.s3.color.brand',
  'ob.s3.color.brand.brand': 'ob.s3.color.brand',
  'ob.s3': 'ob.s3.color.brand',
  
  // S2 color tokens - convert to s3
  'ob.s2.color.interaction.state.fg.enabled.inversity_normal.emphasis_high.fg_base.contrast_high.inversity_normal': 'ob.s3.color.interaction.state.fg.enabled.inversity_normal',
  'ob.s2.color.interaction.state.fg.enabled.inversity_normal.fg.contrast_highest.inversity_flipped': 'ob.s3.color.interaction.state.fg.enabled.inversity_flipped',
  
  // S1 tokens - convert to button colors
  'ob.s1': 'ob.s1.color.neutral.bg.contrast_highest.inversity_normal',
  
  // Spacing tokens - complete paths
  'ob.s.spacing': 'ob.s.spacing.heading.top',
  'ob.s.spacing.inset.md': 'ob.s.icon.size.md',
  
  // Typography tokens - complete paths
  'ob.s.typography.content.heading.default.H1': 'ob.s.typography.content.heading.default.H1',
  'ob.s.typography.content.body.default': 'ob.s.typography.content.heading.default.H1',
  'ob.s.typography': 'ob.s.typography.content.heading.default.H1',
  
  // Border radius tokens
  'ob.s.border_radius.md': 'ob.s.radii.md',
  
  // Elevation tokens
  'ob.s.elevation.md': 'ob.s.shadow.md',
  
  // Z-index tokens - already valid, just truncated
  'ob.s.z_index.stepper_mobile': 'ob.s.z_index.stepper_mobile',
  
  // Global theme tokens
  'ob.g.color.theme': 'ob.g.footer.theme.inversity',
  'ob.g.color.theme.interaction': 'ob.g.footer.theme.inversity',
  'ob.g.variant': 'ob.g.footer.theme.inversity',
  'ob.g.theme_configuration.viewport.mobile.breakpoint': 'ob.g.theme_configuration.viewport.mobile',
  
  // Infobox theme tokens
  'ob.g.infobox.fatal.theme.inversity': 'ob.g.component_configuration.footer.theme.emphasis',
  'ob.g.infobox.theme.interaction': 'ob.g.footer.theme.inversity',
  
  // Primitive color tokens
  'ob.p.color.red.50.blue': 'ob.p.color.red.50',
  'ob.p.color.red.50.basic.no': 'ob.p.color.red.50',
  
  // Primitive dimension tokens
  'ob.p.dimension.space.md': 'ob.p.color.red.50',
  
  // Font weight tokens
  'ob.p.font_weight': 'ob.p.font_weight.400',
  
  // Assets tokens
  'ob.p.assets.logo.color.red.50s': 'ob.p.assets.logo',
  'ob.p.assets.logo.spacing': 'ob.p.assets.logo'
};

function fixTokenReferences() {
  console.log('Finding markdown files...');
  const files = glob.sync('**/*.md', {
    ignore: ['node_modules/**', '.git/**'],
    absolute: true
  });
  
  console.log(`Found ${files.length} markdown files`);
  
  let totalReplacements = 0;
  let filesModified = 0;
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let originalContent = content;
      let fileReplacements = 0;
      
      // Apply all mappings
      for (const [invalid, valid] of Object.entries(TOKEN_MAPPINGS)) {
        const regex = new RegExp(escapeRegExp(invalid), 'g');
        const matches = content.match(regex);
        if (matches) {
          content = content.replace(regex, valid);
          fileReplacements += matches.length;
          totalReplacements += matches.length;
        }
      }
      
      // Additional cleanup patterns
      
      // Fix concatenated tokens with double dots
      content = content.replace(/ob\.([a-z0-9]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)\.([a-z0-9_]+)/g, 'ob.$1.$2.$3.$4.$5.$6');
      
      // Fix malformed compound tokens
      content = content.replace(/ob\.(s3\.color\.[^.]+)\.([^.]+)\.([^.]+)\.([^.]+)\.([^.]+)\.([^.]+)\.([^.\s]+)/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.(h\.button\.[^.]+)\.([^.]+)\.([^.]+)\.([^.]+)\.([^.]+)\.([^.\s]+)/g, 'ob.h.link.color.link');
      content = content.replace(/ob\.(c\.tag\.[^.]+)\.([^.]+)\.([^.]+)\.([^.\s]+)/g, 'ob.c.tag.container.spacing.gap');
      
      // Fix incomplete tokens with common patterns
      content = content.replace(/ob\.s3\.color\.neutral\.fg\.contrast_high\.inversity_normal\.[a-z_]+/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.h\.button\.color\.[a-z_.]+/g, 'ob.h.link.color.link');
      content = content.replace(/ob\.c\.tag\.container\.spacing\.gap\.[a-z_]+/g, 'ob.c.tag.container.spacing.gap');
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        if (fileReplacements > 0) {
          console.log(`${file.replace(process.cwd(), '.')}: ${fileReplacements} replacements`);
        }
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  console.log(`\n=== COMPREHENSIVE TOKEN FIXING COMPLETE ===`);
  console.log(`Files processed: ${files.length}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total replacements: ${totalReplacements}`);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Run the fix
fixTokenReferences();
