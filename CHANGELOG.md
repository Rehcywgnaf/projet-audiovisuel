# Changelog

## [Non publié]

### Ajouté
- Composant VersionManager pour la gestion des versions de documents
  - Interface utilisateur pour visualiser l'historique des versions
  - Fonctionnalité de restauration des versions précédentes
  - Création de nouvelles versions
  - Indicateurs de statut de synchronisation avec Google Drive
  - Gestion des erreurs et notifications utilisateur

### Modifié
- Intégration de la synchronisation Google Drive directement dans le composant VersionManager
- Amélioration de l'interface utilisateur avec des indicateurs visuels d'état

### Technique
- Utilisation des composants shadcn/ui pour l'interface
- Simulation des appels API Google Drive pour les tests
- Gestion d'état avec React hooks