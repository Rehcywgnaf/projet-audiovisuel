# Architecture Drive SAPAV

## Structure des composants

```
Drive/
├── driveExports.ts              # Point d'entrée principal des exports
├── Core/
│   ├── coreExports.ts          # Exports des composants Core
│   ├── DriveCore.ts            # Gestion des opérations Drive (5.6KB)
│   └── DrivePerms.ts           # Gestion des permissions (3.2KB)
├── Auth/
│   ├── authExports.ts          # Exports des composants Auth
│   ├── DriveAuth.tsx           # Composant Auth UI (0.9KB)
│   └── DriveAuthProvider.tsx   # Provider Auth (2.8KB)
└── Integration/
    ├── integrationExports.ts   # Exports des composants Integration
    └── DriveIntegration.tsx    # Integration Drive (0.4KB)
```

## Composants Core

### DriveCore
- Singleton pour les opérations Drive
- Gestion cache et erreurs
- Support complet MIME types
- Implémente CRUD complet

### DrivePerms
- Gestion permissions ressources
- Intégration EventSystem
- Support rôles et équipes
- Validation autorisations

## Composants Auth

### DriveAuth
- Interface authentification
- Support OAuth2
- Gestion tokens

### DriveAuthProvider
- Context React
- Gestion état auth
- Refresh automatique tokens

## Intégration

### DriveIntegration
- Point d'entrée unifié
- Synchronisation deux sens
- Gestion conflits
- Validation intégrité

## Exports

Structure exports en cascade pour éviter conflits nommage :
```typescript
// Drive/driveExports.ts
export * from './Core/coreExports';
export * from './Auth/authExports';
export * from './Integration/integrationExports';
```

## Points d'attention

### Sécurité
- Validation stricte permissions
- Audit trail complet
- Tokens sécurisés
- Encryption données sensibles

### Performance
- Cache intelligent
- Validation parallèle
- Préchargement sélectif
- Métriques temps réel

### Maintenance
- Tests unitaires (~90% coverage)
- Documentation inline
- Logs structurés
- Circuit breakers