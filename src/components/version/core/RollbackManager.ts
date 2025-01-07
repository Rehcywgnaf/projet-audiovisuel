class RollbackManager {
  constructor(versionManager) {
    this.versionManager = versionManager;
    this.rollbackHistory = [];
    this.maxRollbackHistory = 10;
  }

  // Effectue un rollback vers une version spécifique
  async rollbackToVersion(versionId) {
    try {
      // Sauvegarder l'état actuel avant le rollback
      const currentState = await this.versionManager.loadVersionStore();
      
      // Sauvegarder dans l'historique de rollback
      this.saveToRollbackHistory(currentState);

      // Restaurer la version demandée
      const targetVersion = await this.versionManager.restoreVersion(versionId);
      
      // Créer une nouvelle version pour tracer le rollback
      const rollbackVersion = await this.versionManager.createVersion(
        targetVersion.document,
        {
          title: `Rollback vers ${targetVersion.metadata.title}`,
          description: `Restauration de la version du ${new Date(targetVersion.timestamp).toLocaleDateString()}`,
          type: 'rollback',
          originalVersion: versionId,
          author: 'Système'
        }
      );

      return rollbackVersion;
    } catch (error) {
      console.error('Erreur lors du rollback:', error);
      throw new Error('Échec du rollback');
    }
  }

  // Sauvegarde l'état dans l'historique de rollback
  saveToRollbackHistory(state) {
    this.rollbackHistory.unshift({
      state,
      timestamp: new Date().toISOString()
    });

    // Limiter la taille de l'historique
    if (this.rollbackHistory.length > this.maxRollbackHistory) {
      this.rollbackHistory.pop();
    }
  }

  // Annule le dernier rollback si possible
  async undoLastRollback() {
    if (this.rollbackHistory.length === 0) {
      throw new Error('Pas d\'historique de rollback disponible');
    }

    try {
      // Récupérer le dernier état
      const lastState = this.rollbackHistory[0];
      
      // Restaurer cet état
      await this.versionManager.saveToStore(lastState.state);
      
      // Retirer de l'historique
      this.rollbackHistory.shift();

      return lastState.state;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rollback:', error);
      throw new Error('Échec de l\'annulation du rollback');
    }
  }

  // Vérifie si une version peut faire l'objet d'un rollback
  async canRollbackTo(versionId) {
    try {
      const targetVersion = await this.versionManager.restoreVersion(versionId);
      
      // Vérifier si la version existe et est valide
      if (!targetVersion) {
        return { 
          possible: false, 
          reason: 'Version introuvable' 
        };
      }

      // Vérifier si la version n'est pas trop ancienne
      const ageInDays = this.getVersionAgeInDays(targetVersion);
      if (ageInDays > 30) {
        return { 
          possible: false, 
          reason: 'Version trop ancienne (> 30 jours)' 
        };
      }

      // Vérifier les dépendances
      const dependencies = await this.checkVersionDependencies(targetVersion);
      if (dependencies.hasMissingDependencies) {
        return { 
          possible: false, 
          reason: 'Dépendances manquantes' 
        };
      }

      return { 
        possible: true 
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du rollback:', error);
      return { 
        possible: false, 
        reason: 'Erreur lors de la vérification' 
      };
    }
  }

  // Calcule l'âge d'une version en jours
  getVersionAgeInDays(version) {
    const versionDate = new Date(version.timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - versionDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Vérifie les dépendances d'une version
  async checkVersionDependencies(version) {
    // À implémenter selon les besoins spécifiques
    return { 
      hasMissingDependencies: false,
      dependencies: []
    };
  }

  // Récupère l'historique des rollbacks
  getRollbackHistory() {
    return this.rollbackHistory.map(entry => ({
      timestamp: entry.timestamp,
      versionInfo: {
        id: entry.state.current,
        title: entry.state.versions[entry.state.current]?.metadata.title
      }
    }));
  }
}

export default RollbackManager;
