// (Contenu précédent du fichier...)

// Ajout à la fin de la classe RSSProjectService
async discoverAndAddSources(): Promise<number> {
  try {
    // Utilisation du service de découverte
    const discoveredSources = await sourceDiscoveryService.discoverSources();
    
    let addedSourcesCount = 0;
    
    for (const source of discoveredSources) {
      // Tenter d'ajouter chaque source découverte
      const added = await this.addSource(source.url);
      if (added) {
        addedSourcesCount++;
        
        // Log via le service de logging
        this.loggingService.info('Nouvelle source ajoutée', { 
          url: source.url, 
          type: source.type, 
          confidence: source.confidence 
        });
      }
    }

    return addedSourcesCount;
  } catch (error) {
    this.loggingService.error('Erreur lors de la découverte de sources', { 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
    return 0;
  }
}
