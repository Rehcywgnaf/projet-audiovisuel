# Architecture Drive SAPAV

## Vue d'ensemble

L'architecture Drive de SAPAV est organisée en modules distincts avec une séparation claire des responsabilités.

### Structure des dossiers
```
/src/
├── core/
│   └── permissions/           # Gestion centralisée des permissions
│       ├── PermissionManager.ts
│       └── types.ts
├── components/Drive/
│   ├── Core/
│   │   ├── DriveCore.ts       # Point d'entrée des opérations
│   │   ├── DriveConfig.ts     # Configuration Drive unifiée
│   │   └── DriveSync.ts       # Synchronisation temps réel
│   ├── Auth/
│   │   ├── DriveAuth.tsx      # Interface d'authentification
│   │   └── DriveAuthProvider.tsx
│   └── Integration/
│       ├── DriveIntegration.tsx
│       └── DrivePermissionsUI.tsx
└── services/
    └── drive/
        └── driveService.ts     # Interface simplifiée
```

## Composants Principaux

### PermissionManager (Core)
- Singleton pour la gestion centralisée des permissions
- Gestion des droits utilisateurs
- Vérification des opérations
- Cache des permissions
- Support des règles globales

### DriveCore (Composant)
- Interface unifiée pour les opérations Drive
- Gestion intelligente du cache
- Utilisation du PermissionManager
- Support complet MIME types
- Monitoring des performances

### DriveService (Service)
- Interface simplifiée pour l'utilisation de Drive
- Utilisation de DriveCore pour les opérations
- Gestion de l'authentification

### DrivePermissionsUI (Interface)
- Gestion visuelle des permissions
- Utilisation du PermissionManager
- Support des règles globales
- Interface utilisateur intuitive

## Flux d'authentification

1. Initialisation :
   - Config Drive centralisée
   - Vérification credentials
   - Initialisation auth context

2. Authentification :
   - DriveAuthProvider gère l'état
   - DriveAuth fournit l'UI
   - DriveConfig gère les tokens
   - OAuth2 avec Google

## Sécurité

### Gestion des Permissions
- Centralisée via PermissionManager
- Vérification systématique
- Cache intelligent
- Validation multi-niveaux

### Règles Globales
- Héritage automatique
- Restrictions de partage
- Protection des versions
- Configuration flexible

## Gestion du Cache

### Stratégie
- Cache par composant
- Priorités configurables
- Préchargement intelligent
- Invalidation ciblée

### Métriques Cibles
- Hit rate > 95%
- Temps de validation < 200ms
- Latence sync < 500ms

## Tests et Validation

### Tests Unitaires
- Couverture > 90% core
- Tests d'intégration
- Scénarios d'erreur
- Tests de sécurité

### Tests de Performance
- Validation temps réponse
- Tests charge (50 docs/60s)
- Mesures hit rate cache
- Validation latence sync

## Points d'attention

### Performance
- Cache stratifié
- Optimisation batch
- Préchargement intelligent
- Métriques temps réel

### Sécurité
- Permissions centralisées
- Audit complet
- Validation stricte
- Circuit breakers

### Maintenance
- Documentation à jour
- Logs structurés
- Tests automatisés
- Monitoring proactif