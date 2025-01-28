# Changelog - Intégration Drive

## [1.9.1] - 2025-01-28
### Modifié
- Migration complète vers AuthService
  - Suppression de l'authentification interne
  - Intégration PermissionService pour tous les accès
  - Initialisation paresseuse via ensureDriveInitialized
  - Tests d'intégration complets

### Technique
- Optimisation des performances
  - Validation des accès < 200ms
  - Cache des tokens optimisé
  - Gestion d'erreurs améliorée
- Tests mis à jour
  - Nouveaux tests avec AuthService
  - Tests de performance ajoutés
  - Validation des cas d'erreurs

## [1.9.0] - 2025-01-25
### Ajouté
- Intégration avec le nouveau AuthService
  - Authentification centralisée via AuthService
  - Gestion des tokens Google Drive
  - Vérification des permissions via PermissionService

### Modifié
- Refactoring DriveCore
  - Suppression de l'authentification locale
  - Utilisation exclusive de l'AuthService
  - Optimisation de la gestion des erreurs

### Technique
- Tests mis à jour pour AuthService
- Ajout des tests d'intégration