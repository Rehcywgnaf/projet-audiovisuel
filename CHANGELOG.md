# Changelog

## [1.9.2] - 2025-01-30
### Changed
- Correction duplication CacheManager
  - Suppression du CacheManager redondant dans src/components/Drive/Core/
  - Utilisation du CacheManager existant dans src/cache/
  - Mise à jour de la documentation technique
  - Optimisation des imports

## [1.9.1] - 2025-01-28
### Auth & Drive Integration
- Intégration complète AuthService avec DriveCore
  - Migration de l'authentification Drive vers AuthService
  - Ajout vérification permissions via PermissionService
  - Initialisation paresseuse du drive
  - Tests d'intégration complets
- Optimisation performances
  - Validation des droits d'accès < 200ms
  - Cache intelligent des tokens
  - Gestion des erreurs améliorée
  
### Documentation
- Nouvelle structure de documentation changelog
  - Organisation par composants sous /docs/changelog/
  - Vue détaillée par module
  - Historique préservé et enrichi

# [v1.9.0] - 2025-01-25