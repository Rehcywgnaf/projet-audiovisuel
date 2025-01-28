# Service d'Authentification Centralisé

## Vue d'ensemble

Le service d'authentification centralisé fournit un point d'entrée unique pour toute la gestion de l'authentification et des permissions dans SAPAV.

### Architecture
```
src/services/auth/
├── AuthService.ts         # Service d'authentification principal
├── PermissionService.ts   # Gestion des permissions
├── TokenStorage.ts        # Stockage sécurisé des tokens
├── types/
│   └── Auth.ts           # Types et interfaces
└── utils/
    └── encryption.ts      # Utilitaires de chiffrement
```

## Composants Principaux

### AuthService
- Pattern Singleton pour gestion centralisée
- Gestion des tokens avec refresh automatique
- Support multi-tokens avec chiffrement
- Gestion d'état complète

### PermissionService
- Validation fine des droits d'accès
- Cache optimisé (5 minutes)
- Validation parallèle des permissions
- Support multi-niveaux

### TokenStorage
- Stockage sécurisé des tokens
- Support multi-tokens
- Rotation automatique
- Chiffrement local

## Performances

### Métriques Clés
- Validation des permissions : < 200ms
- Hit rate du cache : > 95%
- Temps de refresh token : < 500ms

### Optimisations
- Cache intelligent par composant
- Validation parallèle des permissions
- Préchargement intelligent

## Intégration

### Points d'Entrée
```typescript
// Obtenir l'instance d'AuthService
const auth = AuthService.getInstance();

// Authentification
const token = await auth.authenticate();

// Vérification des permissions
const permService = new PermissionService();
const canAccess = await permService.checkPermission(resourceId, 'read');
```

### Composants Intégrés
- DriveCore : Authentification Google Drive
- TemplateManager : Gestion des accès templates
- DocumentManager : Contrôle versions

## Sécurité

### Mesures Implémentées
- Chiffrement des tokens stockés
- Validation systématique des permissions
- Rotation automatique des tokens
- Audit trail complet

### Points d'Attention
- Toujours utiliser les services centralisés
- Ne pas stocker les tokens en clair
- Valider les permissions avant chaque opération

## Tests

### Tests Unitaires
- AuthService : 100% couverture
- PermissionService : 100% couverture
- TokenStorage : 100% couverture

### Tests d'Intégration
- Validation multi-services
- Tests de charge
- Simulation pannes