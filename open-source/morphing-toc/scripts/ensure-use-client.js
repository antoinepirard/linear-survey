const fs = require('fs');
const path = require('path');

const targets = [
  'dist/index.js',
  'dist/index.mjs',
  'dist/MorphingToc.js',
  'dist/MorphingToc.mjs',
];

for (const relativePath of targets) {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) continue;

  const contents = fs.readFileSync(filePath, 'utf8');
  if (contents.startsWith('"use client";') || contents.startsWith("'use client';")) continue;

  fs.writeFileSync(filePath, `"use client";\n${contents}`);
}
