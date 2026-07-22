const fs = require('fs');
let content = fs.readFileSync('./src/components/Hyperspeed.jsx', 'utf-8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\${/g, '${');
fs.writeFileSync('./src/components/Hyperspeed.jsx', content);
console.log('Fixed file');
