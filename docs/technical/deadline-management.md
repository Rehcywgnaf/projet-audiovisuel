# Gestion des Deadlines dans SAPAV

## Architecture

### Structure des Services
- `deadlineTypes.ts` : Définition des types centraux
- `deadlineTrackingService.ts` : Logique de suivi des deadlines
- `aiDeadlineService.ts` : Enrichissement IA des deadlines
- `useDeadlineManager.ts` : Hook principal de gestion

### Composant Principal
- `UnifiedDeadlineManager.tsx` : Interface utilisateur centralisée

## Types de Données

### Deadline
```typescript
interface Deadline {
  id: string;
  projectName: string;
  description: string;
  date: string;
  daysLeft: number;
  team: string;
  priority: 'low' | 'medium' | 'high';
  source?: 'RSS' | 'Manual' | 'AI';
  aiEnriched?: boolean;
  aiSuggestion?: AIDeadlineSuggestion;
  history?: DeadlineHistoryEntry[];
}
```

### Fonctionnalités Clés
- Tracking automatique des délais
- Calcul dynamique de la priorité
- Historique des modifications
- Enrichissement IA contextuel

## Processus d'Enrichissement IA

### Critères d'Enrichissement
- Deadlines avec moins de 20 jours restants
- Non encore enrichies
- Priorité variable

### Suggestions Générées
- Insights contextuels
- Actions recommandées
- Priorisation dynamique

## Performances et Optimisation
- Filtrage intelligent des deadlines
- Enrichissement par lot
- Gestion du cache intégrée

## Points d'Amélioration Future
- Intégration avec AIServiceManager
- Optimisation des requêtes IA
- Personnalisation des suggestions
