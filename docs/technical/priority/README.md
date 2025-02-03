# Documentation Technique - Système de Priorités SAPAV

## Vue d'ensemble

Le système de priorités SAPAV est conçu pour gérer efficacement la priorisation des tâches avec un focus particulier sur les appels à projets (AAP) et appels d'offres (AO).

### Architecture
```
src/components/monitoring/core/priority/
├── PriorityManager.ts         # Gestionnaire central des priorités
└── __tests__/                 # Tests unitaires et d'intégration
    └── PriorityManager.test.ts
```

## Composants

### PriorityManager
Classe centrale gérant toute la logique de priorité.

#### Caractéristiques principales
- Gestion des niveaux de priorité (CRITICAL à LOW)
- Système de scoring numérique (0-100)
- Tracking des changements de priorité
- Support pour deadlines et budgets
- Cache optimisé pour les performances

#### Méthodes principales
```typescript
calculatePriority(task: Task): TaskPriority
getPriorityScore(task: Task): number
private calculateNewPriority(task: Task): TaskPriority
private trackPriorityChange(taskId: string, newPriority: TaskPriority)
```

## Système de Priorités

### Niveaux
1. **CRITICAL** (Score : 80-100)
   - Tâches super urgentes (<24h)
   - Tâches urgentes avec haute valeur
   - Priorité maximale, attention immédiate requise

2. **HIGH** (Score : 60-79)
   - Tâches urgentes (<48h)
   - Projets haute valeur (>100k€)
   - Attention rapide nécessaire

3. **STANDARD** (Score : 40-59)
   - Opérations AAP/AO normales
   - Suivi régulier

4. **LOW** (Score : 0-39)
   - Tâches non critiques
   - Suivi standard

### Calcul du Score
Le score final (0-100) est calculé selon trois critères :

1. **Urgence** (0-40 points)
   - Super urgent (<24h) : 40 points
   - Urgent (<48h) : 30 points
   - Normal : 0 points

2. **Valeur** (0-40 points)
   ```typescript
   Math.min(40, (budget / HIGH_VALUE_THRESHOLD) * 40)
   ```

3. **Type** (0-20 points)
   - AAP/AO : 20 points
   - Autres : 0 points

## Performance

### Métriques
- Temps de calcul priorité : <5ms
- Hit rate cache : >95%
- Mise à jour priorité : <10ms

### Cache
- Stratégie LRU
- Invalidation sélective sur changements
- Préchargement intelligent

## Tests

### Tests Unitaires
- Validation calcul priorités
- Vérification scoring
- Test des changements d'état
- Couverture >90%

### Tests d'Intégration
- Interaction avec autres composants
- Scénarios complexes
- Tests de charge

## Intégrations

### Composants liés
- MonitoringService
- DocumentManager
- TaskManager

### Points d'intégration
- API de priorité unifiée
- Events de changement de priorité
- Webhooks de notification

## Maintenance

### Tâches Quotidiennes
- Vérification des priorités CRITICAL
- Monitoring performances
- Validation cache

### Tâches Hebdomadaires
- Analyse patterns de priorité
- Optimisation seuils
- Revue performances

## Roadmap

### Court terme
1. Amélioration algorithme scoring
2. Optimisation cache
3. Interface admin priorités

### Long terme
1. Machine learning pour prédictions
2. Analyses tendances avancées
3. Automatisation ajustements