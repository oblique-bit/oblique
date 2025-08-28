
# Style Dictionary Configuration for Underscore Compound Units

## Installation

```bash
npm install --save-dev style-dictionary
```

## Configuration

Create `style-dictionary.config.js` in your project root:

```javascript
module.exports = {
  source: ['src/lib/themes/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'design-tokens.css',
        format: 'css/variables',
        options: {
          showFileHeader: true
        }
      }]
    },
    scss: {
      transformGroup: 'scss', 
      buildPath: 'dist/scss/',
      files: [{
        destination: '_design-tokens.scss',
        format: 'scss/variables'
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
```

## Package.json Scripts

Add to your package.json:

```json
{
  "scripts": {
    "tokens:build": "style-dictionary build",
    "tokens:clean": "style-dictionary clean"
  }
}
```

## Usage

```bash
npm run tokens:build
```

This will generate CSS variables like:
```css
:root {
  --ob-s-color-alert_notification-fg-contrast_high: #ffffff;
  --ob-s-color-button-bg-inversity_normal: #0066cc;
}
```

## Key Points

1. **Underscores are preserved** in compound units
2. **Dots become hyphens** between token parts  
3. **No camelCase transformation** needed
4. **Consistent naming** across all platforms

## Testing

After building, verify that:
- Compound units use underscores: `contrast_high`, `alert_notification`
- Token parts use hyphens: `ob-s-color-button`
- No camelCase transformations occur
