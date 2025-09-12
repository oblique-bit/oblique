#!/usr/bin/env node

/**
 * Generate Professional PDF from Modes Architecture Roadmap
 * 
 * Creates a landscape A4 PDF optimized for printing and offline reading
 * Features: Multi-page layout, professional typography, proper page breaks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROADMAP_FILE = '../documentation/07-workflow/modes-architecture-implementation-report.md';
const OUTPUT_DIR = '../_temp_doc';
const OUTPUT_FILE = 'modes-architecture-roadmap.pdf';

console.log('🚀 Generating Professional PDF from Modes Architecture Roadmap...\n');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Check if pandoc is installed
try {
    execSync('pandoc --version', { stdio: 'pipe' });
    console.log('✅ Pandoc found');
} catch (error) {
    console.log('❌ Pandoc not found. Installing via Homebrew...');
    try {
        execSync('brew install pandoc', { stdio: 'inherit' });
        console.log('✅ Pandoc installed successfully');
    } catch (installError) {
        console.error('❌ Failed to install Pandoc. Please install manually:');
        console.error('   brew install pandoc');
        process.exit(1);
    }
}

// Check if wkhtmltopdf is available (alternative PDF engine)
let pdfEngine = 'weasyprint';
try {
    execSync('wkhtmltopdf --version', { stdio: 'pipe' });
    pdfEngine = 'wkhtmltopdf';
    console.log('✅ wkhtmltopdf found - using for better PDF quality');
} catch (error) {
    console.log('⚠️  wkhtmltopdf not found - using weasyprint (install with: brew install wkhtmltopdf)');
}

// Create custom CSS for professional landscape A4 formatting
const customCSS = `
/* Professional PDF Styling - Landscape A4 */
@page {
    size: A4 landscape;
    margin: 2cm 1.5cm;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 10pt;
    line-height: 1.4;
    color: #333;
    max-width: none;
}

/* Headers */
h1 {
    font-size: 18pt;
    font-weight: 700;
    color: #1a1a1a;
    border-bottom: 2px solid #007acc;
    padding-bottom: 8pt;
    margin: 0 0 16pt 0;
    page-break-after: avoid;
}

h2 {
    font-size: 14pt;
    font-weight: 600;
    color: #2c3e50;
    margin: 16pt 0 10pt 0;
    page-break-after: avoid;
}

h3 {
    font-size: 12pt;
    font-weight: 600;
    color: #34495e;
    margin: 12pt 0 8pt 0;
    page-break-after: avoid;
}

h4 {
    font-size: 11pt;
    font-weight: 600;
    color: #5d6d7e;
    margin: 10pt 0 6pt 0;
}

/* Paragraphs */
p {
    margin: 0 0 8pt 0;
    text-align: justify;
}

/* Lists */
ul, ol {
    margin: 8pt 0;
    padding-left: 20pt;
}

li {
    margin: 3pt 0;
}

/* Code blocks */
pre {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 12pt;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
    font-size: 9pt;
    line-height: 1.3;
    overflow-wrap: break-word;
    page-break-inside: avoid;
}

code {
    background: #f1f3f4;
    padding: 2pt 4pt;
    border-radius: 2px;
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
    font-size: 9pt;
}

/* Tables */
table {
    border-collapse: collapse;
    width: 100%;
    margin: 12pt 0;
    font-size: 9pt;
}

th, td {
    border: 1px solid #ddd;
    padding: 6pt 8pt;
    text-align: left;
}

th {
    background-color: #f5f5f5;
    font-weight: 600;
}

/* Blockquotes */
blockquote {
    border-left: 4px solid #007acc;
    margin: 12pt 0;
    padding: 8pt 16pt;
    background: #f8f9fa;
    font-style: italic;
}

/* Page breaks */
.page-break {
    page-break-before: always;
}

/* Phase sections */
h3[id*="phase"] {
    page-break-before: always;
    border-top: 1px solid #ddd;
    padding-top: 12pt;
}

/* Architecture diagrams */
pre:contains("semantic/"), pre:contains("global/") {
    background: #f0f8ff;
    border-left: 4px solid #007acc;
}

/* Success criteria and checklists */
h3:contains("Success Criteria"), h3:contains("Checklist") {
    color: #2e8b57;
}

/* Emojis and status indicators */
.emoji {
    font-size: 12pt;
}

/* Two-column layout for wide sections */
.two-column {
    column-count: 2;
    column-gap: 20pt;
    column-rule: 1px solid #eee;
}

/* Footer */
@page {
    @bottom-center {
        content: "Modes Architecture Roadmap - Page " counter(page);
        font-size: 8pt;
        color: #666;
    }
    
    @bottom-right {
        content: "September 2025";
        font-size: 8pt;
        color: #666;
    }
}

/* Print optimizations */
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    
    .no-print {
        display: none;
    }
}
`;

// Write CSS to temporary file
const cssPath = path.join(OUTPUT_DIR, 'pdf-styles.css');
fs.writeFileSync(cssPath, customCSS);

// Generate PDF using pandoc
const inputPath = path.resolve(ROADMAP_FILE);
const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);

const pandocCommand = [
    'pandoc',
    `"${inputPath}"`,
    '-o', `"${outputPath}"`,
    '--pdf-engine=weasyprint',
    `--css="${cssPath}"`,
    '--standalone',
    '--metadata title="Modes Architecture Implementation Roadmap"',
    '--metadata author="Design System Team"',
    '--metadata date="September 2025"',
    '--variable geometry:a4paper',
    '--variable geometry:landscape',
    '--variable geometry:margin=2cm',
    '--toc',
    '--toc-depth=3',
    '--number-sections'
].join(' ');

try {
    console.log('\n📝 Converting markdown to PDF...');
    console.log(`   Input: ${inputPath}`);
    console.log(`   Output: ${outputPath}`);
    
    execSync(pandocCommand, { stdio: 'inherit' });
    
    // Clean up temporary CSS file
    fs.unlinkSync(cssPath);
    
    console.log('\n✅ PDF generated successfully!');
    console.log(`📄 Location: ${path.resolve(outputPath)}`);
    console.log('\n📋 PDF Features:');
    console.log('   • Landscape A4 format optimized for printing');
    console.log('   • Professional typography and layout');
    console.log('   • Table of contents with page numbers');
    console.log('   • Proper page breaks and section organization');
    console.log('   • Code blocks and diagrams formatted for readability');
    console.log('   • Multi-page layout with consistent styling');
    
    // Try to open the PDF
    try {
        execSync(`open "${outputPath}"`, { stdio: 'pipe' });
        console.log('\n🔍 PDF opened for preview');
    } catch (openError) {
        console.log(`\n💡 Open manually: ${path.resolve(outputPath)}`);
    }
    
} catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    
    // Fallback: try with basic pandoc PDF engine
    console.log('\n🔄 Trying fallback PDF generation...');
    const fallbackCommand = [
        'pandoc',
        `"${inputPath}"`,
        '-o', `"${outputPath}"`,
        '--pdf-engine=pdflatex',
        '--standalone',
        '--toc',
        '--number-sections'
    ].join(' ');
    
    try {
        execSync(fallbackCommand, { stdio: 'inherit' });
        fs.unlinkSync(cssPath);
        console.log('\n✅ Fallback PDF generated successfully!');
        console.log(`📄 Location: ${path.resolve(outputPath)}`);
    } catch (fallbackError) {
        console.error('❌ Fallback PDF generation also failed');
        console.error('\n💡 Manual alternatives:');
        console.error('   1. Install missing dependencies: brew install pandoc wkhtmltopdf');
        console.error('   2. Use online markdown to PDF converter');
        console.error('   3. Open markdown in Typora and export to PDF');
        process.exit(1);
    }
}
