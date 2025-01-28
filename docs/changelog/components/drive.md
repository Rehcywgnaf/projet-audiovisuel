# Changelog - Intégration Drive

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