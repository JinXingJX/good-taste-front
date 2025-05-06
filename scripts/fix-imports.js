import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORT_MAPPINGS = {
  '@react-router/node': '@remix-run/react',
  'react-router': '@remix-run/react',
  '@remix-run/react': '@remix-run/react'
};

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace imports
  Object.entries(IMPORT_MAPPINGS).forEach(([oldImport, newImport]) => {
    const regex = new RegExp(`from ['"]${oldImport}['"]`, 'g');
    if (regex.test(content)) {
      modified = true;
      content = content.replace(regex, `from '${newImport}'`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImports(filePath);
    }
  });
}

// Start from the app directory
walkDir(path.join(__dirname, '../app')); 