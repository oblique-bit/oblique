module.exports = {
  source: ['src/lib/themes/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/tokens/css/',
      files: [{
        destination: 'design-tokens.css',
        format: 'css/variables',
        options: {
          showFileHeader: true,
          outputReferences: true
        }
      }]
    },
    scss: {
      transformGroup: 'scss', 
      buildPath: 'dist/tokens/scss/',
      files: [{
        destination: '_design-tokens.scss',
        format: 'scss/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    json: {
      transformGroup: 'web',
      buildPath: 'dist/tokens/json/',
      files: [{
        destination: 'design-tokens.json',
        format: 'json/flat'
      }]
    }
  },
  // Custom transform to preserve underscores in compound units
  transform: {
    'name/cti/underscore': {
      type: 'name',
      transformer: function(prop) {
        // Join path with hyphens but preserve underscores within compound units
        return prop.path.join('-');
      }
    }
  }
};