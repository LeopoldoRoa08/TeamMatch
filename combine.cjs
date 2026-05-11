#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const miniMode = args.includes('--mini');

const srcDir = path.join(__dirname);
const outputFile = path.join(__dirname, miniMode ? 'combined-src-files.min.js' : 'combined-src-files.js');

let combinedContent = `/**
 * COMBINED SOURCE FILES FROM: ${srcDir}
 * Generated on: ${new Date().toISOString()}
 * 
 * This file contains all JavaScript files from the src directory combined into a single file.
 * Each file is clearly marked with separators and includes the original file path.
 * 
 * TABLE OF CONTENTS:
 */\n\n`;

const jsFiles = [];

function minifyCode(code) {
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*$/gm, '');
    code = code.replace(/\s+/g, ' ');
    code = code.replace(/\s*([{}();,:])\s*/g, '$1');
    code = code.replace(/\s*([=+\-*\/<>!&|])\s*/g, '$1');
    code = code.replace(/[\r\n]+/g, '');
    return code.trim();
}

function getAllJsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
                getAllJsFiles(filePath, fileList);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            const lowerFile = file.toLowerCase();
            if (!lowerFile.endsWith('.svg') &&
                !lowerFile.endsWith('.png') &&
                !lowerFile.endsWith('.jpg') &&
                !lowerFile.endsWith('.jpeg') &&
                !lowerFile.endsWith('.gif') &&
                !lowerFile.endsWith('.ico') &&
                !lowerFile.endsWith('.webp')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

console.log('Scanning for JavaScript files in src directory...');
const files = getAllJsFiles(srcDir);
console.log(`Found ${files.length} JavaScript files`);

files.sort();

const validFiles = [];

files.forEach(file => {
    const relativePath = path.relative(__dirname, file);
    const fileName = path.basename(file).toLowerCase();

    if (fileName === 'styles.js' || fileName === 'styles.jsx' || fileName === 'styles.ts' || fileName === 'styles.tsx') {
        console.log(`Skipping styles file: ${relativePath}`);
        return;
    }

    const content = fs.readFileSync(file, 'utf8');

    if (content.includes('<svg') && content.includes('</svg>')) {
        console.log(`Skipping file with SVG content: ${relativePath}`);
        return;
    }

    const litCssPatterns = [
        /from\s+['"]lit['"]/g,
        /from\s+['"]lit\/directives/g,
        /css`[\s\S]*?`/g,
        /unsafeCSS/g,
        /adoptedStyleSheets/g,
        /styles\s*=\s*css`/g,
        /export\s+const\s+styles\s*=\s*css`/g,
        /return\s+css`/g
    ];

    let cssPatternCount = 0;
    litCssPatterns.forEach(pattern => {
        const matches = content.match(pattern) || [];
        cssPatternCount += matches.length;
    });

    const styleExports = (content.match(/export\s+(const|let|var)\s+style[s]?\s*=/g) || []).length;
    const styleDefinitions = (content.match(/const\s+style[s]?\s*=\s*(css`|{)/g) || []).length;
    const cssTagTemplates = (content.match(/css`[\s\S]*?`/g) || []).length;

    const jsCodePatterns = [
        /function\s+\w+\s*\(/g,
        /class\s+\w+/g,
        /useState\s*\(/g,
        /useEffect\s*\(/g,
        /fetch\s*\(/g,
        /async\s+function/g,
        /await\s+/g,
        /\.forEach\s*\(/g,
        /\.map\s*\(/g,
        /\.filter\s*\(/g,
        /\.reduce\s*\(/g,
        /export\s+class/g,
        /export\s+function/g,
        /export\s+default\s+function/g,
        /export\s+default\s+class/g,
        /const\s+\w+\s*=\s*\(/g,
        /let\s+\w+\s*=\s*\(/g,
        /return\s+</g,
        /render\s*\(/g,
        /componentDidMount/g,
        /componentWillUnmount/g,
        /onClick/g,
        /onChange/g,
        /onSubmit/g,
        /dispatch\s*\(/g,
        /useSelector/g,
        /useDispatch/g
    ];

    let jsCodeIndicators = 0;
    jsCodePatterns.forEach(pattern => {
        const matches = content.match(pattern) || [];
        jsCodeIndicators += matches.length;
    });

    const totalStyleIndicators = cssPatternCount + styleExports + styleDefinitions;

    if (cssTagTemplates > 0 && jsCodeIndicators < 3) {
        console.log(`Skipping lit css style file: ${relativePath}`);
        return;
    }

    if (totalStyleIndicators > 5 && jsCodeIndicators < 2) {
        console.log(`Skipping style-only file: ${relativePath}`);
        return;
    }

    if (styleExports > 0 && !content.includes('export class') && !content.includes('export function') && !content.includes('export default')) {
        console.log(`Skipping file that only exports styles: ${relativePath}`);
        return;
    }

    if ((fileName.includes('style') || fileName.includes('styles') || fileName.includes('.css')) && (cssTagTemplates > 0 || totalStyleIndicators > 0)) {
        console.log(`Skipping style-focused file: ${relativePath}`);
        return;
    }

    validFiles.push(file);
});

console.log(`\nFiltered to ${validFiles.length} valid files`);
if (miniMode) {
    console.log('Mini mode enabled - removing whitespace and newlines');
}

if (!miniMode) {
    validFiles.forEach((file, index) => {
        const relativePath = path.relative(__dirname, file);
        combinedContent += ` * ${index + 1}. ${relativePath}\n`;
    });
    combinedContent += ` */\n\n`;
} else {
    combinedContent = '';
}

validFiles.forEach((file, index) => {
    const relativePath = path.relative(__dirname, file);
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file).toLowerCase();

    if (!miniMode) {
        combinedContent += `\n${'='.repeat(80)}\n`;
        combinedContent += `// FILE ${index + 1} of ${validFiles.length}\n`;
        combinedContent += `// PATH: ${relativePath}\n`;
        combinedContent += `// SIZE: ${content.length} characters\n`;
        combinedContent += `${'='.repeat(80)}\n\n`;

        const fileBaseName = path.basename(file);
        const dirName = path.basename(path.dirname(file));

        combinedContent += `/**\n`;
        combinedContent += ` * FILE: ${fileBaseName}\n`;
        combinedContent += ` * DIRECTORY: ${dirName}\n`;
        combinedContent += ` * \n`;
        combinedContent += ` * PURPOSE: This file is located in ${dirName} directory.\n`;

        if (content.includes('export default') || content.includes('module.exports')) {
            combinedContent += ` * EXPORTS: This file exports module(s) for use in other parts of the application.\n`;
        }
        if (content.includes('import React') || content.includes('from "react"') || content.includes("from 'react'")) {
            combinedContent += ` * TYPE: React component file\n`;
        }
        if (content.includes('useState') || content.includes('useEffect')) {
            combinedContent += ` * HOOKS: Uses React hooks for state and effects\n`;
        }
        if (fileName.includes('store') || fileName.includes('Store')) {
            combinedContent += ` * TYPE: State management store\n`;
        }
        if (fileName.includes('service') || fileName.includes('Service')) {
            combinedContent += ` * TYPE: Service layer for API or business logic\n`;
        }
        if (fileName.includes('util') || fileName.includes('helper')) {
            combinedContent += ` * TYPE: Utility/helper functions\n`;
        }
        if (fileName.includes('component') || fileName.includes('Component')) {
            combinedContent += ` * TYPE: UI component\n`;
        }

        combinedContent += ` */\n\n`;
    } else {
        combinedContent += `/*F:${relativePath}*/`;
    }

    const lines = content.split('\n');
    let skipIndex = 0;
    let inMultilineImport = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (inMultilineImport) {
            skipIndex = i + 1;
            if (line.includes(';') || line.includes('};')) {
                inMultilineImport = false;
            }
            continue;
        }

        if (line.startsWith('import ') ||
            (line.startsWith('const ') && line.includes('= require(')) ||
            (line.startsWith('let ') && line.includes('= require(')) ||
            (line.startsWith('var ') && line.includes('= require(')) ||
            (line.startsWith('export ') && line.includes(' from ')) ||
            line.startsWith('//') ||
            line === '') {

            if (line.startsWith('import ') && !line.includes(';') && !line.includes(' from ')) {
                inMultilineImport = true;
            }

            skipIndex = i + 1;
        } else {
            break;
        }
    }

    let contentWithoutImports = lines.slice(skipIndex).join('\n');

    contentWithoutImports = contentWithoutImports.replace(/styled\.[a-zA-Z]+`[\s\S]*?`/g, 'styled.[CSS_REMOVED]');
    contentWithoutImports = contentWithoutImports.replace(/styled\([^)]+\)`[\s\S]*?`/g, 'styled([CSS_REMOVED])');
    contentWithoutImports = contentWithoutImports.replace(/css`[\s\S]*?`/g, 'css`[CSS_REMOVED]`');
    contentWithoutImports = contentWithoutImports.replace(/makeStyles\(.*?\)\s*=>\s*\({[\s\S]*?}\)\)/g, 'makeStyles([STYLES_REMOVED])');
    contentWithoutImports = contentWithoutImports.replace(/useStyles\s*=\s*makeStyles\(.*?\)\s*=>\s*\({[\s\S]*?}\)\)/g, 'useStyles = makeStyles([STYLES_REMOVED])');
    contentWithoutImports = contentWithoutImports.replace(/const\s+styles?\s*=\s*{[\s\S]*?^}/gm, 'const styles = {[STYLES_REMOVED]}');
    contentWithoutImports = contentWithoutImports.replace(/style\s*=\s*{{[^}]*}}/g, 'style={{[INLINE_STYLES_REMOVED]}}');
    contentWithoutImports = contentWithoutImports.replace(/sx\s*=\s*{{[\s\S]*?}}/g, 'sx={{[SX_STYLES_REMOVED]}}');
    contentWithoutImports = contentWithoutImports.replace(/className\s*=\s*["']([^"']*\s+[^"']*)+["']/g, (match) => {
        if (match.includes(' ') && (match.includes('-') || match.includes(':'))) {
            return 'className="[TAILWIND_CLASSES_REMOVED]"';
        }
        return match;
    });

    if (miniMode) {
        contentWithoutImports = minifyCode(contentWithoutImports);
    }

    combinedContent += contentWithoutImports;

    if (!miniMode) {
        combinedContent += `\n\n${'='.repeat(80)}\n`;
        combinedContent += `// END OF FILE: ${relativePath}\n`;
        combinedContent += `${'='.repeat(80)}\n\n`;
    }
});

if (!miniMode) {
    combinedContent += `\n\n/**\n`;
    combinedContent += ` * END OF COMBINED FILES\n`;
    combinedContent += ` * Total files processed: ${validFiles.length}\n`;
    combinedContent += ` * Total size: ${combinedContent.length} characters\n`;
    combinedContent += ` */\n`;
}

fs.writeFileSync(outputFile, combinedContent);

console.log(`\nSuccess! Combined ${validFiles.length} files into: ${outputFile}`);
console.log(`Output file size: ${(combinedContent.length / 1024).toFixed(2)} KB`);