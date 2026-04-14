const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');
function fixQuotes(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fixQuotes(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\u201C/g, '"');
      content = content.replace(/\u201D/g, '"');
      content = content.replace(/\u2018/g, "'");
      content = content.replace(/\u2019/g, "'");
      content = content.replace(/\u201E/g, '"');
      content = content.replace(/\u201F/g, '"');
      content = content.replace(/\u2033/g, '"');
      content = content.replace(/\u2032/g, "'");
      content = content.replace(/\u2026/g, '...');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed quotes in: ' + file);
    }
  });
}
fixQuotes(srcDir);
console.log('All smart quotes fixed!');
