# Architecture Drive SAPAV

## Vue d'ensemble

L'architecture Drive de SAPAV est organisée en modules distincts pour une meilleure séparation des responsabilités et une maintenance simplifiée.

### Structure des dossiers
```
/src/services/
├── drive/
│   ├── config/
│   │   ├── driveConfig.ts       # Configuration principale
│   │   └── tokenStorage.ts      # Gestion sécurisée des tokens
│   ├── api/
│   │   ├── files.ts            # Opérations sur les fichiers
│   │   └── permissions.ts      # Gestion des permissions
│   └── auth/
│       └── index.ts            # Authentification centralisée
```

## Composants Principaux

### DriveConfig
- Singleton pour la gestion de la configuration Drive
- Gestion du cycle de vie de l'authentification
- Support modes online/offline
- Gestion automatique du refresh token

### TokenStorage
- Chiffrement des tokens avec CryptoJS
- Gestion sécurisée des accès
- Vérification d'expiration des tokens
- Support de clés d'encryption configurables

### Authentification
- Support complet OAuth2
- Gestion des sessions
- Vérification automatique des permissions
- Refresh automatique des tokens expirés

## Flux d'authentification

1. Initialisation :
   - Vérification des credentials
   - Configuration de l'environnement
   - Initialisation du stockage sécurisé

2. Authentification :
   - Génération URL d'authentification
   - Traitement du code d'autorisation
   - Stockage sécurisé des tokens

3. Utilisation :
   - Vérification automatique d'expiration
   - Refresh automatique si nécessaire
   - Gestion des erreurs d'authentification

## Sécurité

### Stockage des Tokens
- Chiffrement AES des tokens
- Clé d'encryption configurable
- Validation de l'intégrité
- Nettoyage automatique des tokens expirés

### Gestion des Permissions
- Validation systématique des accès
- Logging des opérations sensibles
- Isolation des contextes utilisateur
- Révocation automatique si nécessaire

## Tests et Validation

### Tests Unitaires
- Couverture complète des composants
- Mocking des appels Google Drive
- Validation des scénarios d'erreur
- Tests de sécurité

### Tests d'Intégration
- Validation des flux complets
- Tests de performance
- Scénarios de récupération
- Validation des timeouts

## Points d'attention

1. Sécurité :
   - Vérification systématique des tokens
   - Validation des permissions
   - Logging sécurisé
   - Gestion des erreurs

2. Performance :
   - Cache optimisé
   - Minimisation des appels API
   - Gestion efficace de la mémoire
   - Optimisation des refreshs

3. Maintenance :
   - Documentation à jour
   - Logs détaillés
   - Monitoring des opérations
   - Alertes configurables