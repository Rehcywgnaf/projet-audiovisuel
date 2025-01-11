const fs = require('fs');
const path = require('path');

// Configuration
const CRITICAL_FILES = [
  'tests/auth/AuthManager.test.ts',
  'tests/drive/DrivePermissionManager.test.ts',
  'src/components/AuthManager.ts',
  'src/components/DrivePermissionManager.ts'
];

const MIN_FILE_SIZE = 100;
const REQUIRED_PATTERNS = {
  'test.ts': ['describe', 'test', 'expect'],
  '.ts': ['export', 'class']
};

async function verifyFileIntegrity() {
  let hasError = false;

  for (const file of CRITICAL_FILES) {
    try {
      if (!fs.existsSync(file)) {
        console.error(`❌ Erreur: ${file} est manquant`);
        hasError = true;
        continue;
      }

      const stats = fs.statSync(file);
      if (stats.size < MIN_FILE_SIZE) {
        console.error(`❌ Erreur: ${file} semble incomplet (taille: ${stats.size} octets)`);
        hasError = true;
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const ext = path.extname(file);
      const patterns = REQUIRED_PATTERNS[ext] || REQUIRED_PATTERNS[path.basename(file)];
      
      if (patterns) {
        for (const pattern of patterns) {
          if (!content.includes(pattern)) {
            console.error(`❌ Erreur: ${file} ne contient pas le pattern requis "${pattern}"`);
            hasError = true;
          }
        }
      }

      console.log(`✅ Fichier ${file} validé`);

    } catch (error) {
      console.error(`❌ Erreur lors de la vérification de ${file}:`, error);
      hasError = true;
    }
  }

  if (process.env.CI && hasError) {
    console.log('🔍 Vérification supplémentaire pour erreur 32603...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    for (const file of CRITICAL_FILES) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`📊 Re-vérification ${file}: ${stats.size} octets`);
      }
    }
  }

  if (hasError) {
    console.error('❌ Vérification d\'intégrité échouée');
    process.exit(1);
  }

  console.log('✅ Vérification d\'intégrité réussie');
}

verifyFileIntegrity().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
