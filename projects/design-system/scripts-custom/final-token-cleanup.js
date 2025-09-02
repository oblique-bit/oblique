const fs = require('fs');
const glob = require('glob');

function finalTokenCleanup() {
  console.log('Starting final token cleanup...');
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
      
      // Fix duplicated segments in tokens
      
      // Fix s3.color.brand with extra segments
      content = content.replace(/ob\.s3\.color\.brand\.brand\b/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.50\b/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.enabled\b/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.fg\b/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.top\.inset\.md\b/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.spacing\.heading\.top\.inset\.md\b/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.with_text\.padding\.vertical\.md\.spacing\.with_text\.padding\.vertical\.md\b/g, 'ob.h.button.spacing.with_text.padding.vertical.md');
      
      // Fix color.brand repetition patterns
      content = content.replace(/ob\.s3\.color\.brand\.color\.brand/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.brand\.color\.brand\.bg/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.color\.neutral\.no_color/g, 'ob.s3.color.neutral.no_color');
      content = content.replace(/ob\.s3\.color\.brand\.brand\.color\.neutral\.no_color/g, 'ob.s3.color.neutral.no_color');
      content = content.replace(/ob\.s3\.color\.brand\.neutral\.no_color_color/g, 'ob.s3.color.neutral.no_color');
      
      // Fix complex nested tokens
      content = content.replace(/ob\.s3\.color\.brand\.color\.brand\.color\.brand/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.color\.brand\.color\.neutral\.fg\.contrast_high\.inversity_normal/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.color\.neutral\.fg\.contrast_high\.inversity_normal/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.color\.neutral\.bg\.contrast_highest\.inversity_normal/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.color\.neutral\.bg\.contrast_lowest\.inversity_normal/g, 'ob.s3.color.brand');
      content = content.replace(/ob\.s3\.color\.brand\.color\.red\.50/g, 'ob.s3.color.brand');
      
      // Fix s3 interaction tokens
      content = content.replace(/ob\.s3\.color\.brand\.interaction\.state\.fg\.enabled\.inversity_flipped/g, 'ob.s3.color.interaction.state.fg.enabled.inversity_flipped');
      
      // Fix h.link token patterns
      content = content.replace(/ob\.h\.link\.color\.link\.md\.vertical\.md/g, 'ob.h.link.spacing.gap');
      content = content.replace(/ob\.h\.link\.color\.link\.inversity_normal\.enabled/g, 'ob.h.link.color.link');
      content = content.replace(/ob\.h\.link\.color\.link\.md/g, 'ob.h.link.spacing.gap');
      content = content.replace(/ob\.h\.link\.color\.link\.size\.md/g, 'ob.h.link.spacing.gap');
      content = content.replace(/ob\.h\.link\.color\.link\.size\.lg/g, 'ob.h.link.spacing.gap');
      content = content.replace(/ob\.h\.link\.color\.link\.surface\.size\.md/g, 'ob.h.link.spacing.gap');
      
      // Fix button color variants - simplify to just color
      content = content.replace(/ob\.h\.link\.color\.link\.fg\.[a-z_]+\.inversity_normal\.enabled/g, 'ob.h.link.color.link');
      content = content.replace(/ob\.h\.link\.color\.link\.bg\.[a-z_]+\.inversity_normal\.enabled/g, 'ob.h.link.color.link');
      content = content.replace(/ob\.h\.link\.color\.link\.border\.[a-z_]+\.inversity_normal\.enabled/g, 'ob.h.link.color.link');
      
      // Fix s1 color patterns
      content = content.replace(/ob\.s1\.color\.neutral\.bg\.contrast_highest\.inversity_normal\.color\.neutral\.bg\.contrast_highest\.inversity_normal/g, 'ob.s1.color.neutral.bg.contrast_highest.inversity_normal');
      
      // Fix typography duplication
      content = content.replace(/ob\.s\.typography\.content\.heading\.default\.H1\.content\.heading\.default\.H1/g, 'ob.s.typography.content.heading.default.H1');
      
      // Fix spacing tokens
      content = content.replace(/ob\.s\.spacing\.heading\.top\.md/g, 'ob.s.spacing.heading.top');
      content = content.replace(/ob\.s\.spacing\.heading\.top\.xs/g, 'ob.s.spacing.heading.top');
      content = content.replace(/ob\.s\.spacing\.heading\.top\.sm/g, 'ob.s.spacing.heading.top');
      content = content.replace(/ob\.s\.spacing\.heading\.top\.lg/g, 'ob.s.spacing.heading.top');
      content = content.replace(/ob\.s\.spacing\.heading\.top\.xl/g, 'ob.s.spacing.heading.top');
      content = content.replace(/ob\.s\.spacing\.heading\.top\.inset\.md/g, 'ob.s.spacing.heading.top');
      
      // Fix c.tag patterns
      content = content.replace(/ob\.c\.tag\.container\.spacing\.gap\.single_item\.spacing\.marker_gap/g, 'ob.c.tag.container.spacing.gap');
      content = content.replace(/ob\.c\.tag\.container\.spacing\.gap\.stepperMobile/g, 'ob.c.tag.container.spacing.gap');
      content = content.replace(/ob\.c\.tag\.container\.spacing\.gap\.logo/g, 'ob.c.tag.container.spacing.gap');
      content = content.replace(/ob\.c\.tag\.container\.spacing\.gap\.list\.single_item\.spacing\.marker_gap/g, 'ob.c.tag.container.spacing.gap');
      
      // Fix font weight patterns
      content = content.replace(/ob\.p\.font_weight\.400\.([0-9]+)/g, 'ob.p.font_weight.$1');
      
      // Fix g.footer patterns
      content = content.replace(/ob\.g\.footer\.theme\.inversity\.interaction/g, 'ob.g.footer.theme.inversity');
      
      // Count changes made in this file
      const newContent = content;
      if (newContent !== originalContent) {
        const changes = originalContent.length - newContent.length;
        if (changes !== 0 || newContent !== originalContent) {
          fileReplacements = 1; // At least one replacement was made
          totalReplacements++;
        }
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        if (fileReplacements > 0) {
          console.log(`${file.replace(process.cwd(), '.')}: cleaned up`);
        }
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  console.log(`\n=== FINAL TOKEN CLEANUP COMPLETE ===`);
  console.log(`Files processed: ${files.length}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total cleanup operations: ${totalReplacements}`);
}

// Run the cleanup
finalTokenCleanup();
