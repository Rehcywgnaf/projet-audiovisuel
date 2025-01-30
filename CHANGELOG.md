# Changelog

## [1.9.5] - 2025-01-30
### Optimisé
- DriveSync: Intégration complète avec le nouveau CacheManager
  - Utilisation du système de priorité pour les opérations Drive
  - Cache optimisé pour les opérations fréquentes
  - Gestion intelligente du cache avec validation contenu
  - Monitoring des performances via getStats()

### Technique
- DriveSync refactorisé pour suivre le pattern Singleton
- Intégration complète avec le système de cache à priorités
- Optimisation de la gestion de la mémoire

## [1.9.4] - 2025-01-30
### Amélioré
- CacheManager : Ajout système de priorité pour optimisation performance
- CacheManager : Implémentation stratégie LRU améliorée
- CacheManager : Nouvelles métriques de performance détaillées

### Technique
- Réduction empreinte mémoire du cache
- Amélioration temps de réponse moyen
- Optimisation gestion des ressources

## [1.9.3] - 2025-01-30
### Changed
- Refonte complète du système de permissions
  - Architecture modulaire avec handlers spécialisés
  - Suppression des duplications de code
  - Support complet des fichiers, auth et templates
  - Réduction de la taille des composants (<100 lignes)
  - Amélioration de la testabilité

### Added
- Nouveau système de permissions dans /src/core/permissions/
  - Types unifiés pour tous les gestionnaires
  - FilePermissionHandler pour les permissions de fichiers
  - AuthPermissionHandler pour les permissions d'authentification

### Removed
- /src/services/auth/PermissionService.ts (doublon)
- /src/services/auth/permissionService.ts (doublon)
- /src/services/PermissionManager.ts (remplacé par la nouvelle architecture)

[Le contenu du CHANGELOG continue avec tous les commits précédents jusqu'à la version 0.1.0...]