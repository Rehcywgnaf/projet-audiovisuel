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

## Architecture Auth
### Ajouté
- Nouveau service AuthService dans /src/services/auth/
- Gestionnaire de permissions avec PermissionService
- Tests unitaires pour AuthService et PermissionService
- Tests d'intégration TeamPermissions

### Modifié
- Migration du stockage des tokens vers /src/services/auth/tokenStorage
- Centralisation de la gestion des permissions

[Le contenu existant du CHANGELOG jusqu'à la version 0.1.0 se trouve ici...]