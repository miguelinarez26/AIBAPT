const fs = require('fs');
const path = 'c:/Users/Personal/Documents/CarMiDev/AIBAPT/src/app/socios/page.tsx';

let content = fs.readFileSync(path, 'utf8');
// Remove all dark: classes (like dark:bg-black/30, dark:text-white, dark:hover:bg-gray-800, etc)
content = content.replace(/\bdark:[a-zA-Z0-9\-\/]+\b/g, '');
// Clean up double spaces created by the removal
content = content.replace(/  +/g, ' ');

fs.writeFileSync(path, content, 'utf8');
console.log('Removed dark mode classes');
