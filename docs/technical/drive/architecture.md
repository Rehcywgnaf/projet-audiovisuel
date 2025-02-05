# Architecture Drive SAPAV

## Vue d'ensemble

L'architecture Drive de SAPAV est organisée en modules distincts avec une séparation claire client/serveur.

### Structure des dossiers
```
/src/
├── app/
│   └── api/
│       └── drive/              # Routes API Drive
│           ├── operation/
│           ├── sync/
│           └── metrics/
├── core/
│   ├── EventSystem.ts         # Système d'événements global
│   └── permissions/           # Gestion centralisée des permissions
│       ├── PermissionManager.ts
│       └── types.ts
├── error/                     # Gestion des erreurs
│   └── ErrorHandling.ts
├── cache/                     # Système de cache
│   └── CacheManager.ts
├── components/Drive/
│   ├── types.ts              # Types partagés Drive
│   ├── Core/
│   │   ├── DriveCore.ts      # Point d'entrée des opérations serveur
│   │   ├── DriveConfig.ts    # Configuration Drive unifiée
│   │   ├── DriveSync.ts      # Synchronisation temps réel
│   │   ├── DrivePerms.ts     # Gestion permissions Drive
│   │   └── index.ts          # Export unifié
│   ├── Auth/
│   │   ├── DriveAuth.tsx     # Interface d'authentification
│   │   └── DriveAuthProvider.tsx
│   └── Integration/
│       ├── DriveIntegration.tsx   # Composant client principal
│       ├── driveClient.ts        # Client API pour composants UI
│       ├── DrivePermissionsUI.tsx
│       └── DriveSyncUI.tsx
### Relations et imports
```typescript
// Depuis DriveCore.ts
import { ErrorHandling } from '../../../error/ErrorHandling';
import { CacheManager } from '../../../cache/CacheManager';
import { DriveOperation, FileMetadata } from '../types';
// Depuis DrivePerms.ts
import { EventSystem } from '../../../core/EventSystem';
import { Permission, PermissionLevel } from '../types';
```
## Composants Principaux
### EventSystem (/core/EventSystem.ts)
- Singleton pour la gestion des événements
- Types d'événements:
  - roleChanged
  - permissionChanged
  - driveFileUpdated
  - driveFolderUpdated
### ErrorHandling (/error/ErrorHandling.ts)
- Gestion centralisée des erreurs
- Support de retry automatique
- Logging structuré
- Types d'erreurs spécifiques
### CacheManager (/cache/CacheManager.ts)
- Gestion du cache pour les fichiers et métadonnées
- Invalidation intelligente
- Métriques de performance
- Cache hiérarchique (fichiers, dossiers, métadonnées)
### DriveCore (Composant)
- Interface unifiée pour les opérations Drive
- Gestion intelligente du cache via CacheManager
- Gestion des erreurs via ErrorHandling
- Support complet MIME types
- Monitoring des performances
### DrivePerms (Composant)
- Gestion des permissions Drive
- Intégration avec EventSystem
- Support des rôles et équipes
- Héritage des permissions
### DriveService (Service)
- Interface simplifiée pour l'utilisation de Drive
- Utilisation de DriveCore pour les opérations
- Gestion de l'authentification
### DrivePermissionsUI (Interface)
- Gestion visuelle des permissions
- Utilisation de DrivePerms
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
- Centralisée via DrivePerms
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
- Cache par composant via CacheManager
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
