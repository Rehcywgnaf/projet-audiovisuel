# Plan de Réorganisation SAPAV

## État Actuel

### Structure Globale
```
src/
├── components/      # Composants React
├── core/           # Système d'événements et fonctionnalités core
├── services/       # Services métier
│   ├── auth/         # Service d'authentification centralisé
│   ├── drive/        # Services Google Drive
│   └── notification/  # Service de notifications
├── cache/          # Gestion du cache
├── error/          # Gestion des erreurs
├── hooks/          # Hooks React personnalisés
├── types/          # Types TypeScript
├── monitoring/     # Système de monitoring
└── permissions/    # [Déprécié] Migration vers /services/auth/
```

### Points de Duplication Résolus
1. ~~Services Drive~~
   - Migration complète vers `/src/services/drive`
   - Intégration avec AuthService centralisé

2. ~~Gestion des Permissions~~
   - Migration vers `/services/auth/PermissionService`
   - Validation centralisée
   - Cache optimisé

### Points de Duplication Restants
1. Systèmes de Cache
   - Multiples implémentations du cache
   - Pas de stratégie centralisée

## Plan de Réorganisation

### 1. Services (Phase 1 - En cours)
- Structure actuelle :
  ```
  /src/services/
  ├── auth/                 # Service authentification centralisé
  │   ├── AuthService.ts    # Auth principal
  │   ├── PermissionService.ts
  │   ├── TokenStorage.ts
  │   ├── types/
  │   └── utils/
  ├── drive/                # Services Google Drive
  │   ├── config/
  │   ├── api/
  │   └── core/
  └── notification/         # Service de notifications
  ```

### 2. Core Systems (Phase 2)
- Centraliser les systèmes core sous `/src/core`
- Structure cible :
  ```
  /src/core/
  ├── cache/
  │   ├── CacheManager.ts
  │   └── strategies/
  ├── events/
  │   └── EventSystem.ts
  ├── error/
  └── monitoring/
  ```

### 3. Composants React (Phase 3)
- Réorganiser les composants sous `/src/components`
- Structure cible :
  ```
  /src/components/
  ├── Drive/
  │   ├── Core/
  │   └── Integration/
  ├── Veille/
  └── shared/
  ```

## Ordre de Migration

1. **Phase 1 : Services**
   - [x] Analyse des doublons
   - [x] Migration Drive Services
   - [x] Tests d'intégration
   - [x] Documentation mise à jour

2. **Phase 2 : Core**
   - [ ] Centralisation Cache
   - [ ] Migration Events
   - [ ] Unification Error Handling
   - [ ] Documentation Core Systems

3. **Phase 3 : UI**
   - [ ] Réorganisation composants
   - [ ] Tests UI
   - [ ] Documentation composants

## Points d'Attention

### Gestion des Versions
- Toute modification doit être testée avant migration
- Conserver l'historique Git
- Mettre à jour le CHANGELOG

### Tests
- Maintenir/améliorer la couverture de tests
- Tests unitaires ET d'intégration
- Valider la rétrocompatibilité

### Documentation
- Mise à jour du README
- Documentation technique à jour
- Commentaires dans le code

### Sécurité
- Validation des permissions via AuthService
- Gestion sécurisée des tokens via TokenStorage
- Audit trail complet

## Process de Push

1. **Avant chaque Push**
   - Tests complets
   - Linting
   - Build de validation

2. **Après un Push avec Erreur 32603**
   - Vérifier présence des fichiers
   - Vérifier intégrité des fichiers
   - Documenter les anomalies

## Statut de la Migration

| Composant | État | Tests | Documentation |
|-----------|------|-------|---------------|
| Services Drive | Complété | 100% | Complète |
| Auth Service | Complété | 100% | Complète |
| Core Events | Non démarré | - | - |
| UI Components | Non démarré | - | - |

## Notes de Migration

### Pour chaque Service
1. Vérifier les dépendances
2. Migrer les tests
3. Valider l'intégration
4. Mettre à jour la doc

### Pour chaque Composant
1. Vérifier les props
2. Migrer les styles
3. Valider le rendu
4. Tests E2E

## Points Bloqués Résolus
1. ~~Dépendances circulaires entre Auth et Drive~~
2. ~~Migrations asynchrones des permissions~~

## Points Bloquants Restants
1. Tests d'intégration du système de cache
2. Standardisation des stratégies de cache