# Changelog

## [0.5.0] - 2025-01-06
### Added
- PreviewManager: Nouveau composant pour la visualisation en temps réel
  - Support des modes d'affichage Web et Print
  - Intégration avec DocumentVersionManager existant
  - Système de synchronisation des versions en temps réel
  - Navigation entre versions avec prévisualisation
  - Contrôles de zoom et mise en page
- Documentation technique du PreviewManager
  - Guide d'intégration détaillé
  - Diagrammes d'architecture
  - Spécifications des interfaces

### Changed
- Amélioration de l'intégration avec le système de versionning existant
- Optimisation des performances de rendu en temps réel
- Documentation: Mise à jour pour inclure PreviewManager

## [0.4.9] - 2025-01-05
### Added
- DocumentGenerator/DocumentVersionManager: Nouveau composant pour la gestion des versions
  - Validation automatique
    - Vérification orthographique et grammaticale
    - Contrôle des documents requis
    - Validation de format
  - Validation humaine
    - Interface de validation finale
    - Système de commentaires
    - Workflow d'approbation/rejet
- Système de versioning intégré
  - Historique des versions
  - Visualisation des changements
  - Restauration de versions
- TODO détaillé pour futures améliorations
  - Critères de qualité supplémentaires
  - Intégration Google Drive planifiée
  - Système de règles personnalisables

### Technical
- Ajout dans le dossier DocumentGenerator
- Structure modulaire pour évolutions futures
- Préparation intégration Drive

[Suite du CHANGELOG avec tout l'historique précédent jusqu'à la version 0.1.0]