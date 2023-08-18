const fs = require("fs");
const path = require("path");
function buildObjectFromDirectory(directoryPath) {
  const obj = {};
  const files = fs.readdirSync(directoryPath);
  for (const file of files) {
    if (file !== 'node_modules') {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        obj[file] = { directory: buildObjectFromDirectory(filePath) };
      } else if (stats.isFile()) {
        obj[file] = { file: { contents: fs.readFileSync(filePath, "utf8") } };
      }
    }
  }
  return obj;
} // Användningsexempel: const directoryPath = '/path/to/directory'; const result = buildObjectFromDirectory(directoryPath); console.log(result)

console.log(buildObjectFromDirectory(
    process.cwd() + '/webcontainer'
))