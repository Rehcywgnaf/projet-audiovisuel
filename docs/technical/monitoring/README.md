# Documentation Technique - Système de Monitoring SAPAV

## Architecture du Système

### Composants Principaux
1. **MonitoringService**
   - Singleton centralisant la gestion du monitoring
   - Interface entre le monitoring et les composants métier
   - Gestion des abonnements aux événements
   - Rétention d'historique limitée à 50 entrées

2. **QueueMonitor**
   - Surveillance des files d'attente par priorité
   - Génération d'alertes basée sur des seuils
   - Métriques en temps réel des tailles de files
   - Surveillance des temps d'attente

3. **ErrorRecoveryManager**
   - Gestion des stratégies de reprise
   - Historique des erreurs et reprises
   - Back-off exponentiel pour les tentatives
   - Limite de 3 tentatives par tâche

4. **MonitoringDashboard**
   - Interface utilisateur temps réel
   - Visualisation des métriques
   - Affichage des alertes actives
   - Historique des erreurs et reprises

## Flux de Données

### Monitoring des Files
1. Les métriques sont collectées par QueueMonitor
2. MonitoringService agrège et distribue les données
3. Le dashboard s'abonne aux mises à jour
4. Les alertes sont générées selon les seuils définis

### Gestion des Erreurs
1. ErrorRecoveryManager détecte les erreurs
2. Application des stratégies de reprise
3. Émission d'événements de monitoring
4. Mise à jour de l'historique

## Configuration

### Seuils d'Alerte
```typescript
const alertThresholds = {
  high: { size: 10, waitTime: 300 },     // 5 minutes
  standard: { size: 20, waitTime: 900 },  // 15 minutes
  low: { size: 30, waitTime: 1800 }      // 30 minutes
};
```

### Gestion des Reprises
```typescript
const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000,  // 1 seconde
  maxDelay: 3600000 // 1 heure
};
```

## Événements du Système

### Événements Monitoring
- `metricUpdate` : Mise à jour des métriques
- `newAlert` : Nouvelle alerte générée
- `alertResolved` : Alerte résolue
- `queueThresholdExceeded` : Seuil dépassé

### Événements Erreur
- `taskRetry` : Nouvelle tentative de tâche
- `taskFatalError` : Échec définitif d'une tâche
- `retryStrategyUpdated` : Mise à jour stratégie

## Intégration

### Utilisation de MonitoringService
```typescript
const monitoring = MonitoringService.getInstance();

// Abonnement aux métriques
const unsubscribe = monitoring.onMetricsUpdate((metrics) => {
  // Traitement des nouvelles métriques
});

// Abonnement aux alertes
monitoring.onAlertsUpdate((alerts) => {
  // Gestion des alertes actives
});

// Nettoyage
unsubscribe();
```

### Ajout de Stratégies de Reprise
```typescript
const customStrategy: RetryStrategy = {
  shouldRetry: async (task, record) => {
    // Logique de décision
    return record.retryCount < 3;
  }
};

errorManager.registerStrategy('NetworkError', customStrategy);
```

## Maintenance

### Points de Surveillance
- Taille de l'historique (limité à 50 entrées)
- Expiration des alertes (5 minutes)
- État des abonnements aux événements
- Performances du dashboard

### Backoff Exponentiel
- Première tentative : 1s
- Deuxième tentative : 2s
- Troisième tentative : 4s
- Maximum : 1h

## Métriques Clés

### Performance
- Temps de réponse du dashboard < 200ms
- Latence des alertes < 100ms
- Précision des métriques temps réel
- Utilisation mémoire limitée

### Fiabilité
- Taux de perte d'événements < 0.1%
- Disponibilité du monitoring > 99.9%
- Cohérence des données > 99.99%
- Délai maximum de reprise : 1h

## Tests

### Tests Unitaires
- QueueMonitor : Seuils et alertes
- ErrorRecoveryManager : Stratégies
- MonitoringService : Événements

### Tests d'Intégration
- Circuit complet de monitoring
- Scénarios de reprise
- Performance sous charge
- Gestion des erreurs