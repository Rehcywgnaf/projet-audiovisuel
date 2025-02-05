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

[Reste du fichier inchangé]