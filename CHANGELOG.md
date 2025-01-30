# Changelog

## [1.9.5] - 2025-01-30
### Optimisé
- DriveSync: Intégration complète avec le nouveau CacheManager
  - Utilisation du système de priorité pour les opérations Drive
  - Cache optimisé pour les opérations fréquentes
  - Gestion intelligente du cache avec validation contenu
  - Monitoring des performances via getStats()

### Technique
- DriveSync refactorisé pour suivre le pattern Singleton
- Intégration complète avec le système de cache à priorités
- Optimisation de la gestion de la mémoire

## [1.9.4] - 2025-01-30
### Amélioré
- CacheManager : Ajout système de priorité pour optimisation performance
- CacheManager : Implémentation stratégie LRU améliorée
- CacheManager : Nouvelles métriques de performance détaillées

### Technique
- Réduction empreinte mémoire du cache
- Amélioration temps de réponse moyen
- Optimisation gestion des ressources

[Le reste du CHANGELOG précédent reste inchangé]