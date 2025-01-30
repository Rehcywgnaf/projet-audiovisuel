# Système de Permissions SAPAV

## Architecture Globale

### Structure
```
src/core/permissions/
├── PermissionManager.ts     # Gestionnaire principal (~60 lignes)
├── types.ts                 # Types et interfaces partagés
└── handlers/               
    ├── FilePermissionHandler.ts    # Permissions fichiers (~70 lignes)
    └── AuthPermissionHandler.ts    # Permissions auth (~70 lignes)
```

### Niveaux de Permission
```typescript
enum PermissionLevel {
  NONE = 0,
  READ = 1,
  COMMENT = 2,
  EDIT = 3,
  SHARE = 4,
  MANAGE = 5,
  OWNER = 6
}
```

## Composants

### PermissionManager
- Point d'entrée unique pour toutes les vérifications
- Délégation aux handlers spécialisés
- Interface unifiée et simple
- Support des permissions fichiers et auth
- Extensible pour nouveaux types

### Handlers Spécialisés
- FilePermissionHandler
  * Gestion des permissions fichiers
  * Héritage des permissions
  * Support du versioning
- AuthPermissionHandler
  * Permissions d'authentification
  * Gestion des expirations
  * Nettoyage automatique

## Points Forts

### Modularité
- Composants légers (<100 lignes)
- Séparation claire des responsabilités
- Facile à tester et maintenir
- Extension simple pour nouveaux types

### Performance
- Cache intégré par handler
- Validations rapides
- Nettoyage automatique
- Gestion optimisée de la mémoire

### Sécurité
- Validation stricte des niveaux
- Support des permissions temporaires
- Audit des modifications
- Nettoyage sécurisé

## Utilisation

### Vérification Simple
```typescript
const allowed = await permissionManager.checkPermission({
  type: 'file',
  resourceId: 'doc123',
  action: 'read',
  userId: 'user456'
});
```

### Attribution Permission
```typescript
await permissionManager.setPermission({
  type: 'file',
  fileId: 'doc123',
  userId: 'user456',
  level: PermissionLevel.EDIT
});
```

## Tests

### Tests Unitaires
- Tests par composant
- Couverture >90%
- Tests d'intégration
- Validation des cas limites

### Points Testés
- Vérification des permissions
- Héritage
- Expirations
- Nettoyage
- Cas d'erreur

## Maintenance

### Monitoring
- Logs structurés par composant
- Métriques de performance
- Alertes sur erreurs
- Suivi des modifications

### Documentation
- Types commentés
- JSDoc sur les méthodes principales
- Exemples d'utilisation
- Guide de débogage

## Roadmap

### Court Terme
- Ajout support templates
- Amélioration monitoring
- Tests de charge

### Moyen Terme
- Cache distribué
- Permissions par équipe
- API publique

### Long Terme
- Interface admin
- Audit avancé
- Règles complexes