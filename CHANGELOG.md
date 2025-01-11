# Changelog

## [1.2.9] - 2025-01-11
### Changed
- Migration complète du système de permissions Drive
  - Nouveau DrivePermissionManager déployé
  - Migration de 150 ressources
  - Archivage de l'ancien système DrivePerms
  - Documentation de migration archivée
- Optimisation de la gestion des permissions
  - Séparation des responsabilités
  - Amélioration de l'audit des accès
  - Simplification de la gestion des équipes

### Technical
- Documentation d'archive créée pour l'ancien système
- Tests complets du nouveau système
- Sauvegarde des données historiques
- Vérification post-migration réussie

## [1.2.8] - 2025-01-10
### Added
- DriveAuth : Nouveau composant d'authentification
  - Integration avec Google OAuth
  - Gestion des tokens
  - Refresh automatique
  - Gestion des erreurs améliorée
- Mise à jour de l'architecture Drive
  - Refactoring des imports NextJS
  - Optimisation des variables d'environnement
  - Service index centralisé

### Technical
- Migration des composants vers l'architecture Next.js
- Centralisation des services Drive
- Tests d'intégration complets

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
## [En cours] Integration DriveCore
- Analyse de la compatibilité avec DriveAuth
- Préparation de l'intégration des composants Drive

### Technical
- Suppression des placeholders de code
- Amélioration de la gestion d'erreurs
- Documentation des interfaces