# Migration du Système de Monitoring

## Phase 1 - Core & Dashboard Principal (Terminé)

### Nouvelle Structure
```
src/monitoring/
  /core              # Logique métier
    /metrics         # Gestionnaires de métriques
    /priority        # Système de priorité
    /analytics      # Services d'analyse
  /components       # Interface utilisateur
    /dashboard      # Composants dashboard
    /metrics        # Visualisations métriques
    /drive          # Monitoring drive
    /analytics     # Visualisations analytics
  /types           # Types partagés
  /utils           # Utilitaires
```

### Éléments Migrés Phase 1
✅ Types de base (metrics.types.ts)
✅ BaseMetricsManager
✅ LongTermMetricsManager
✅ MonitoringService
✅ MonitoringDashboard principal
✅ Documentation technique Phase 1

## Phase 2 - Dashboards Spécifiques (Terminé)
✅ Nouvelle architecture pour les pages monitoring
  - MonitoringOverviewPage.tsx
  - AIMonitoringPage.tsx
  - ProjectsMonitoringPage.tsx
✅ Système de navigation dynamique 
✅ Layout unifié avec routage
✅ Tests unitaires complets
✅ Documentation mise à jour
✅ Nommage et structure clarifiés

### Structure Actuelle des Pages
```
src/app/monitoring/
├── MonitoringOverviewPage.tsx   # Dashboard principal
├── layout.tsx                   # Layout commun avec navigation
├── ai/
│   └── AIMonitoringPage.tsx    # Vue performance IA
└── projects/
    └── ProjectsMonitoringPage.tsx # Vue projets
```

### Phases Suivantes

#### Phase 3 - Système de Priorité
- Migration PriorityManager
- Migration tests priorité
- Documentation priorité

#### Phase 4 - Analytics & Performance
- Migration composants analytics
- Migration métriques performance
- Documentation performance

## Convention de Commit
- feat(monitoring): Nouveaux composants
- refactor(monitoring): Réorganisation
- fix(monitoring): Corrections
- docs(monitoring): Documentation

## Conventions de Nommage
- Pages : `[Section]MonitoringPage.tsx`
- Composants : `[Feature]View.tsx`
- Tests : `[Component].test.tsx`
- Types : `[Feature].types.ts`

## Tests
- Chaque composant migré doit avoir ses tests
- Maintenir >90% de couverture
- Tests d'intégration pour les workflows critiques
- Validation des routes et navigation

## Points d'Attention Spécifiques
1. Compatibilité
   - Maintenir compatibilité descendante
   - Vérifier imports dans les composants existants
   - Tester toutes les routes

2. Performance
   - Temps de réponse <100ms pour les vues
   - Optimisation des états et renders
   - Lazy loading quand approprié

3. Sécurité
   - Validation des routes
   - Gestion des permissions
   - Logs de navigation

4. Documentation
   - Mise à jour README
   - Documentation composants
   - Guide de nommage
   - Historique des migrations

## Validation et Déploiement
- Vérifier intégrité après chaque push
- Tests complets avant/après migration
- Documenter chaque étape
- Plan de rollback disponible