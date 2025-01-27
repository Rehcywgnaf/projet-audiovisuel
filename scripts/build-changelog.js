const fs = require('fs');
const path = require('path');

// Configuration
const VERSIONS_DIR = path.join(__dirname, '../changelog/versions');
const OUTPUT_FILE = path.join(__dirname, '../CHANGELOG.md');

// Lecture des fichiers de version
const versions = fs.readdirSync(VERSIONS_DIR)
  .filter(file => file.endsWith('.md'))
  .sort((a, b) => {
    // Tri par version (le plus récent en premier)
    const vA = a.replace('.md', '').split('.');
    const vB = b.replace('.md', '').split('.');
    for (let i = 0; i < 3; i++) {
      if (vA[i] !== vB[i]) {
        return Number(vB[i]) - Number(vA[i]);
      }
    }
    return 0;
  });

// Génération du CHANGELOG
let changelog = '# Changelog\n\n';

// Ajout de chaque version
versions.forEach(version => {
  const content = fs.readFileSync(
    path.join(VERSIONS_DIR, version),
    'utf-8'
  );
  changelog += content + '\n';
});

// Écriture du fichier final
fs.writeFileSync(OUTPUT_FILE, changelog);