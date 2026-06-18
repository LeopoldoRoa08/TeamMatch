const fs = require('fs');
const path = require('path');
const dir = 'src/components/teammatch';

let changedFiles = 0;
fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.tsx')) return;
    const filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');
    
    let lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes('text-secondary') && 
            !line.includes('text-secondary-foreground') && 
            !line.includes('bg-primary') && 
            !line.includes('bg-secondary') && 
            !line.includes('bg-muted') && 
            !line.includes('bg-accent')) {
            lines[i] = line.replace(/text-secondary/g, 'text-foreground');
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
        changedFiles++;
    }
});
console.log('Fixed text-secondary contrast in ' + changedFiles + ' files.');
