# Plan de Réorganisation SAPAV

## État Actuel

### Structure Globale
```
src/
├── components/      # Composants React
├── core/           # Système d'événements et fonctionnalités core
├── services/       # Services métier
├── cache/          # Gestion du cache
├── error/          # Gestion des erreurs
├── hooks/          # Hooks React personnalisés
├── types/          # Types TypeScript
├── monitoring/     # Système de monitoring
└── permissions/    # Gestion des permissions
```

### Points de Duplication Identifiés
1. Services Drive
   - `/services/drive`
   - `/src/services/drive`
   - Fichiers en doublon: `driveConfig.ts`, `tokenStorage.ts`

2. Systèmes de Cache
   - Multiples implémentations du cache
   - Pas de stratégie centralisée

3. Gestion des Permissions
   - Implémentations dispersées
   - Manque de cohérence dans la validation

## Plan de Réorganisation

### 1. Services (Phase 1)
- Centraliser les services sous `/src/services`
- Structure cible :
  ```
  /src/services/
  ├── drive/
  │   ├── config/
  │   │   ├── driveConfig.ts
  │   │   └── tokenStorage.ts
  │   ├── api/
  │   │   ├── files.ts
  │   │   └── permissions.ts
  │   └── auth/
  │       └── index.ts
  ├── notification/
  └── veille/
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
  │   ├── Auth/
  │   ├── Core/
  │   └── Integration/
  ├── Veille/
  └── shared/
  ```

## Ordre de Migration

1. **Phase 1 : Services**
   - [x] Analyse des doublons
   - [ ] Migration Drive Services
   - [ ] Tests d'intégration
   - [ ] Documentation mise à jour

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
- Validation des permissions
- Gestion sécurisée des tokens
- Audit trail

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
| Services Drive | En cours | - | - |
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

## Points Bloquants
1. Dépendances circulaires à gérer
2. Migrations asynchrones à coordonner
3. Tests d'intégration à maintenir