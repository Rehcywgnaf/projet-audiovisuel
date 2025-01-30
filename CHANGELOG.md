# Changelog

## [1.9.2] - 2025-01-30
### Added
- Système de cache stratifié pour DriveCore
  - CacheManager : Gestion intelligente du cache mémoire et persistant
  - Configuration flexible avec TTL et patterns de préchargement
  - Intégration dans DriveCore pour optimisation des performances
  - Documentation technique complète

### Technical
- Cache mémoire : Limite 100 documents
- Cache persistant : Limite 1000 documents
- TTL configurable (défaut: 1h)
- Préchargement intelligent des templates et documents récents

# Changelog

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

[Le reste du CHANGELOG reste inchangé]