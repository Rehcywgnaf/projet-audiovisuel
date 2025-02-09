# Composants Dashboard SAPAV

## GlobalDashboard

### Objectif
Point d'entrée principal de l'application qui présente une vue d'ensemble consolidée des données.

### Caractéristiques
- Statistiques globales
- Intégration RSS
- Liste des projets récents
- Métriques de performance

### Architecture
```typescript
interface GlobalDashboardProps {
  aiService?: AIServiceManager;
  cache?: CacheSystem;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  rssSourcesCount: number;
}
```

### Performance
- Cache : 15 minutes TTL
- Temps de réponse < 100ms
- Lazy loading des données
- Optimisation des renders

## TeamDashboard

### Objectif
Gestion et suivi des équipes en temps réel avec métriques personnalisées.

### Caractéristiques
- Vue par équipe
- KPIs spécifiques
- Disponibilités
- Attribution des projets

### Architecture
```typescript
interface TeamDashboardProps {
  teamManager: TeamManager;
  selectedTeamId?: string;
}

interface TeamMetrics {
  availableMembers: number;
  activeProjects: number;
  completionRate: number;
}
```

### Performance
- Cache : 5 minutes TTL
- Préchargement des données fréquentes
- Optimisation des filtres
- Gestion des états de chargement

## ProjectDashboard

### Objectif
Suivi détaillé des projets avec focus sur les documents et deadlines.

### Caractéristiques
- Suivi des documents
- Gestion des deadlines
- Intégration Drive
- Validation en temps réel

### Architecture
```typescript
interface ProjectDashboardProps {
  projectId: string;
  driveIntegration: DriveProvider;
}

interface Document {
  id: number;
  name: string;
  status: 'present' | 'missing' | 'outdated';
  driveLink: string | null;
  deadline: string;
}
```

### Performance
- Cache : 2 minutes TTL
- Validation optimisée
- Lazy loading des documents
- Gestion efficace de l'état

## Interactions Communes

### AIServiceManager
Tous les dashboards utilisent l'AIServiceManager pour :
- Analyse des données
- Suggestions contextuelles
- Optimisation des performances
- Validation intelligente

### Cache System
Stratégie de cache adaptée à chaque composant :
- Priorité selon l'usage
- Invalidation intelligente
- Préchargement sélectif
- Monitoring des performances

### Tests et Qualité
- Tests unitaires complets
- Tests d'intégration
- Validation des performances
- Documentation à jour

## Points d'Attention

### Sécurité
- Validation des permissions
- Audit des actions
- Protection des données
- Traçabilité

### Maintenance
- Logs structurés
- Monitoring actif
- Documentation claire
- Procédures de rollback

## Future Évolutions

### Court Terme
- Amélioration cache
- Nouvelles métriques
- UX optimisée

### Long Terme
- IA avancée
- Analyses prédictives
- Personnalisation étendue