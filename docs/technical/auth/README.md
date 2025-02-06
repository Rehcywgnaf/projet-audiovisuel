# Service d'Authentification Centralisé

## Vue d'ensemble

Le service d'authentification centralisé fournit un point d'entrée unique pour toute la gestion de l'authentification et des permissions dans SAPAV.

### Architecture
```
src/core/drive/
├── DriveConfig.ts         # Configuration et authentification Google Drive
├── TokenStorage.ts        # Stockage sécurisé des tokens avec support SSR
└── types/
    └── Auth.ts           # Types et interfaces

src/services/auth/
├── AuthService.ts         # Service d'authentification principal
├── PermissionService.ts   # Gestion des permissions
└── utils/
    └── encryption.ts      # Utilitaires de chiffrement
```

## Composants Principaux

### DriveConfig
- Pattern Singleton pour gestion centralisée
- Initialisation flexible avec/sans vérification de token
- Gestion des tokens avec refresh automatique
- Support SSR complet

### TokenStorage
- Stockage sécurisé des tokens avec gestion SSR
- Détection automatique client/serveur
- Validation d'expiration des tokens
- Gestion sécurisée du localStorage

### PermissionService
- Validation fine des droits d'accès
- Cache optimisé (5 minutes)
- Validation parallèle des permissions
- Support multi-niveaux

## Variables d'Environnement

### Configuration Requise
```bash
# Google OAuth Configuration  
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_client_id
NEXT_PUBLIC_GOOGLE_API_KEY=votre_api_key
GOOGLE_REDIRECT_URI=http://localhost:3000/drive/auth/callback
NEXT_PUBLIC_GOOGLE_CHAT_SCOPE=https://www.googleapis.com/auth/chat.spaces

# Google Service Account
GOOGLE_APPLICATION_CREDENTIALS=chemin_vers_votre_fichier_credentials.json
```

## Performances

### Métriques Clés
- Validation des permissions : < 200ms
- Hit rate du cache : > 95%
- Temps de refresh token : < 500ms

### Optimisations
- Support SSR avec détection automatique
- Gestion des erreurs robuste
- Logs détaillés pour le debugging

## Intégration

### Points d'Entrée
```typescript
// Obtenir l'instance de DriveConfig
const drive = DriveConfig.getInstance();

// Initialisation
await drive.initialize({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

// Authentification
await drive.authenticate(authCode);
```

### Composants Intégrés
- API Routes : Gestion des opérations Drive
- Status Route : Vérification d'authentification
- Auth Route : Processus d'authentification

## Sécurité

### Mesures Implémentées
- Détection environnement client/serveur
- Vérification des credentials
- Gestion sécurisée des tokens
- Logs détaillés des erreurs

### Points d'Attention
- Toujours vérifier la disponibilité des variables d'environnement
- Gérer les cas d'erreur côté serveur
- Valider l'intégrité des tokens

## Tests

### Tests Unitaires
- DriveConfig : 100% couverture
- TokenStorage : 100% couverture
- API Routes : 100% couverture

### Tests d'Intégration
- Tests SSR
- Tests de charge
- Simulation erreurs réseau