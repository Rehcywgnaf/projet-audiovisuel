# Changelog

## [1.2.7] - 2025-01-07
### Fixed
- Implémentation complète VeilleManager
  - Analyse intelligente des flux RSS
  - Extraction automatique des dates limites
  - Détection du budget et des critères
- Implémentation TeamTracking
  - Gestion des états de chargement
  - Affichage des disponibilités
  - Calcul de charge par membre

### Technical
- Suppression des placeholders de code
- Amélioration de la gestion d'erreurs
- Documentation des interfaces

## [1.2.6] - 2025-01-07
### Added
- Fusion des composants Drive dupliqués
  - Nouveau DriveCore unifié
  - Intégration des fonctionnalités de synchronisation
  - Système de permissions consolidé
  - Gestion d'erreurs centralisée
- Consolidation système de veille
  - VeilleManager TypeScript
  - Service RSS unifié
  - Système de notification intégré
- Migration TeamTracking
  - Composant React TypeScript
  - Service dédié
  - Intégration notifications

### Changed
- Migration vers TypeScript des composants Drive, Veille et Teams
- Optimisation des appels Google Drive API
- Unification de la gestion des erreurs
- Refonte du système de notification
- Amélioration interface TeamTracking

### Technical
- Création branche 'integration'
- Suppression des doublons
- Mise à jour documentation technique

## [1.2.5] - 2025-01-07
### Added
- Refonte complète du système de versions
  - Nouveau composant VersionManager.ts pour la gestion centralisée
  - RollbackManager.ts dédié aux opérations de retour arrière
  - VersionStore optimisé pour les performances et la fiabilité
  - Interfaces VersionHistory.tsx et VersionControl.tsx
- Documentation technique détaillée du nouveau système
  - Architecture et composants
  - Workflows et intégrations
  - Tests et sécurité
  - Roadmap d'évolution

[Reste du CHANGELOG conservé à l'identique]