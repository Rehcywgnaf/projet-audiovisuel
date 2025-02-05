# Guide de Développement Drive SAPAV

## Points Importants

### 1. Vérification avant modification
- **TOUJOURS** vérifier les composants existants dans le repo
- Ne pas se fier aux versions locales
- Consulter la documentation technique à jour dans `/docs/technical/drive/`

### 2. Structure des imports
- Utiliser les chemins relatifs corrects
- Vérifier l'arborescence dans `architecture.md`
- Exemples de chemins d'imports corrects :
  ```typescript
  // Depuis /components/Drive/Core/
  import { EventSystem } from '../../../core/EventSystem';
  import { ErrorHandling } from '../../../error/ErrorHandling';
  import { CacheManager } from '../../../cache/CacheManager';
  import { SomeType } from '../types';
  ```

### 3. Composants Périphériques
Les composants suivants sont partagés et NE DOIVENT PAS être recréés :
- EventSystem (`/core/EventSystem.ts`)
- ErrorHandling (`/error/ErrorHandling.ts`)
- CacheManager (`/cache/CacheManager.ts`)

### 4. Modifications et Push
- **NE JAMAIS** modifier README.md et CHANGELOG.md directement
- En cas d'erreur 32603 lors d'un push :
  1. Vérifier la présence des fichiers
  2. Vérifier l'intégrité du contenu
  3. Documenter toute anomalie
  4. Re-push si nécessaire

## Bonnes Pratiques

### 1. Modification de composants
- Vérifier les dépendances avant modification
- Maintenir la compatibilité avec les composants existants
- Respecter les interfaces existantes
- Tester toutes les intégrations

### 2. Nouveaux développements
- Suivre l'architecture existante
- Réutiliser les composants périphériques
- Respecter les conventions de nommage
- Documenter les nouveaux composants

### 3. Tests
- Maintenir une couverture > 90%
- Tester les intégrations
- Vérifier les performances
- Valider les métriques de cache

### 4. Documentation
- Mettre à jour la documentation technique
- Documenter les changements d'architecture
- Maintenir les exemples à jour
- Signaler les points d'attention

## Points de Vigilance

### 1. Gestion du Cache
- Utiliser CacheManager pour toute mise en cache
- Respecter les stratégies d'invalidation
- Maintenir les métriques de performance
- Gérer les limites de taille

### 2. Gestion des Erreurs
- Utiliser ErrorHandling pour toute gestion d'erreur
- Respecter les types d'erreurs définis
- Implémenter le retry quand approprié
- Maintenir des logs clairs

### 3. Événements
- Utiliser EventSystem pour toute communication
- Respecter les types d'événements définis
- Gérer proprement les souscriptions
- Nettoyer les listeners

### 4. Performance
- Suivre les métriques définies
- Optimiser les opérations batch
- Gérer intelligemment le cache
- Monitorer les temps de réponse

## Process de Développement

### 1. Avant de commencer
- Lire la documentation existante
- Comprendre l'architecture
- Identifier les composants impliqués
- Planifier les modifications

### 2. Pendant le développement
- Suivre les conventions de code
- Documenter au fur et à mesure
- Tester régulièrement
- Commiter fréquemment

### 3. Avant le push
- Vérifier les tests
- Valider la documentation
- Tester les intégrations
- Vérifier les performances

### 4. Après le push
- Vérifier l'intégrité (erreur 32603)
- Valider les déploiements
- Monitorer les métriques
- Documenter les changements