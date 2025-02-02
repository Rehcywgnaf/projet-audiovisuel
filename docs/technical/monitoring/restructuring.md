# Restructuration du Monitoring - Documentation Technique

## Phase 1 - Core & Dashboard Principal (En cours)

### Structure Cible
```
src/monitoring/
  /core
    /metrics/
      - baseMetrics.ts      ✓
      - queueMetrics.ts     ✓
      - longTermMetrics.ts  ✓
    /priority/
      - PriorityManager.ts  (Phase 2)
    - MonitoringService.ts  ✓
  /components
    /dashboard/
      - MonitoringDashboard.tsx   (En cours)
      - ProjectMetricsView.tsx    (Phase 2)
      - AIPerformanceView.tsx     (Phase 2)
    /drive/
      - DriveMetricsView.tsx      ✓
    /metrics/
      - LongTermMetricsView.tsx   ✓
```

### Migrations Effectuées
1. Core
- ✓ BaseMetricsManager
- ✓ QueueMetricsManager
- ✓ LongTermMetricsManager
- ✓ MonitoringService
- ✓ Types centralisés

2. Composants UI
- ✓ DriveMetricsView
- ✓ LongTermMetricsView
- En cours : MonitoringDashboard

### Points d'Attention
1. Imports
- Utiliser @/monitoring/... pour tous les nouveaux imports
- Éviter les imports circulaires
- Centraliser les types dans /types

2. Tests
- Migrer les tests avec leurs composants
- Adapter les imports dans les tests
- Maintenir la couverture actuelle

3. Documentation
- Mettre à jour README.md pour chaque composant
- Documenter les changements dans CHANGELOG.md
- Maintenir cette documentation de restructuration

## Phases Suivantes

### Phase 2 - Dashboards Spécifiques
- Migration AIPerformanceDashboard
- Migration ProjectDashboard
- Mise à jour des routes et layouts

### Phase 3 - Système de Priorité
- Migration PriorityManager
- Migration des tests associés
- Intégration avec nouveau MonitoringService

### Phase 4 - Analytics
- Migration composants analytics
- Centralisation métriques
- Unification reporting

### Phase 5 - Nettoyage & Documentation
- Suppression anciens composants
- Mise à jour documentation globale
- Tests d'intégration finaux