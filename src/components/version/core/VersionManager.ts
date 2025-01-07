import Papa from 'papaparse';

class VersionManager {
  constructor() {
    this.currentVersion = null;
    this.versionHistory = [];
    this.maxHistoryLength = 50; // Limite de l'historique
  }

  // Crée une nouvelle version
  async createVersion(document, metadata) {
    const versionId = this.generateVersionId();
    const timestamp = new Date().toISOString();
    
    const version = {
      id: versionId,
      timestamp,
      document,
      metadata: {
        ...metadata,
        author: metadata.author || 'unknown',
        type: this.determineChangeType(metadata.changes),
        title: metadata.title || `Version ${versionId}`,
        description: metadata.description || ''
      }
    };

    // Ajouter à l'historique
    this.versionHistory.unshift(version);
    
    // Limiter la taille de l'historique
    if (this.versionHistory.length > this.maxHistoryLength) {
      const removed = this.versionHistory.pop();
      await this.archiveVersion(removed);
    }

    this.currentVersion = version;
    await this.saveToStore(version);
    
    return version;
  }

  // Détermine le type de changement (major, minor, patch)
  determineChangeType(changes) {
    if (!changes) return 'patch';
    
    const changeTypes = {
      structure: 'major',
      content: 'minor',
      formatting: 'patch'
    };
    
    return changes.reduce((type, change) => {
      const changeImportance = changeTypes[change.type] || 'patch';
      return this.compareChangeTypes(type, changeImportance);
    }, 'patch');
  }

  // Compare les types de changements
  compareChangeTypes(current, new_type) {
    const priority = { major: 3, minor: 2, patch: 1 };
    return priority[new_type] > priority[current] ? new_type : current;
  }

  // Génère un ID unique pour la version
  generateVersionId() {
    return `v${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Sauvegarde dans le VersionStore
  async saveToStore(version) {
    try {
      const store = await this.loadVersionStore();
      store.versions[version.id] = version;
      store.current = version.id;
      
      await window.fs.writeFile(
        'version-store.json',
        JSON.stringify(store, null, 2)
      );
    } catch (error) {
      console.error('Error saving version:', error);
      throw new Error('Failed to save version');
    }
  }

  // Charge le VersionStore
  async loadVersionStore() {
    try {
      const data = await window.fs.readFile('version-store.json');
      return JSON.parse(new TextDecoder().decode(data));
    } catch {
      return { versions: {}, current: null };
    }
  }

  // Archive une ancienne version
  async archiveVersion(version) {
    try {
      const archive = await this.loadArchive();
      archive[version.id] = version;
      
      await window.fs.writeFile(
        'version-archive.json',
        JSON.stringify(archive, null, 2)
      );
    } catch (error) {
      console.error('Error archiving version:', error);
    }
  }

  // Charge les versions archivées
  async loadArchive() {
    try {
      const data = await window.fs.readFile('version-archive.json');
      return JSON.parse(new TextDecoder().decode(data));
    } catch {
      return {};
    }
  }

  // Restaure une version spécifique
  async restoreVersion(versionId) {
    try {
      const store = await this.loadVersionStore();
      const version = store.versions[versionId];
      
      if (!version) {
        const archive = await this.loadArchive();
        if (!archive[versionId]) {
          throw new Error('Version not found');
        }
        return archive[versionId];
      }
      
      return version;
    } catch (error) {
      console.error('Error restoring version:', error);
      throw new Error('Failed to restore version');
    }
  }

  // Compare deux versions et retourne les différences
  async compareVersions(versionId1, versionId2) {
    const version1 = await this.restoreVersion(versionId1);
    const version2 = await this.restoreVersion(versionId2);
    
    return {
      metadata: this.compareMetadata(version1.metadata, version2.metadata),
      content: this.compareContent(version1.document, version2.document)
    };
  }

  // Compare les métadonnées
  compareMetadata(meta1, meta2) {
    const changes = {};
    Object.keys({ ...meta1, ...meta2 }).forEach(key => {
      if (meta1[key] !== meta2[key]) {
        changes[key] = {
          from: meta1[key],
          to: meta2[key]
        };
      }
    });
    return changes;
  }

  // Compare le contenu des documents
  compareContent(doc1, doc2) {
    // Implémentation basique pour le moment
    return {
      added: {},
      removed: {},
      modified: {}
    };
  }
}

export default VersionManager;
