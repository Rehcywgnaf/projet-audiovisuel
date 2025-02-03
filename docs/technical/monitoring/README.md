# Documentation Technique - Système de Monitoring SAPAV

## Architecture

### Structure du Projet
```
src/components/monitoring/
├── dashboard/                # Interface monitoring
├── core/
│   └── priority/            # Système de priorités
│       ├── PriorityManager.ts
│       └── __tests__/
├── metrics/                  # Gestion des métriques
└── types/                   # Types et interfaces
```

### Composants Principaux
1. **MonitoringDashboard**
   - Vue temps réel des métriques
   - Graphiques de performance
   - État du cache
   - Alertes système

2. **MetricsCollector**
   - Collecte en temps réel
   - Agrégation données
   - Historisation
   - Format standardisé

3. **PriorityManager**
   - Gestion des priorités (CRITICAL à LOW)
   - Système de scoring (0-100)
   - Tracking des changements
   - Cache optimisé

## Système de Priorités

### Niveaux de Priorité
1. **CRITICAL**
   - Tâches super urgentes (<24h)
   - Tâches urgentes + haute valeur
   - Score : 80-100

2. **HIGH**
   - Tâches urgentes (<48h)
   - Tâches haute valeur (>100k€)
   - Score : 60-79

3. **STANDARD**
   - Opérations AAP/AO normales
   - Score : 40-59

4. **LOW**
   - Tâches non critiques
   - Score : 0-39

### Scoring
- **Urgence** : 0-40 points
  - Super urgent (<24h) : 40 points
  - Urgent (<48h) : 30 points
- **Valeur** : 0-40 points
  - Score proportionnel au budget
- **Type** : 0-20 points
  - AAP/AO : 20 points
  - Autres : 0 points

[Le reste du fichier reste inchangé à partir de "## Métriques Surveillées"]