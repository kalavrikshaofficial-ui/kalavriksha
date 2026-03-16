import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function getFilePath(name) {
  return path.join(dataDir, `${name}.json`);
}

export function readData(name) {
  try {
    const filePath = getFilePath(name);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeData(name, data) {
  const filePath = getFilePath(name);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
