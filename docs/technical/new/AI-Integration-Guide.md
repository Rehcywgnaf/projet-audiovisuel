# Guide d'Intégration IA - SAPAV

## Vue d'ensemble

L'intelligence artificielle dans SAPAV est gérée par un service centralisé (AIServiceManager) qui utilise l'API Claude-3 Sonnet d'Anthropic. Cette architecture assure une gestion efficace des coûts et des performances.

## Architecture

### AIServiceManager

Point d'entrée unique pour toutes les interactions IA :

```typescript
const aiManager = AIServiceManager.getInstance();
const response = await aiManager.processRequest(
  'rss-analyzer',
  content,
  options
);
```

#### Configuration par Composant
- RSS-IA : Cache 1h, priorité haute
- Editor : Cache 5min, priorité moyenne
- Template : Cache 24h, priorité basse
- Validator : Cache 10min, priorité moyenne

### Gestion des Coûts

Budget et seuils :
- Maximum : 15$ par mois
- Alerte principale : 10$
- Alertes progressives : 5$ et 8$

### Composants Intégrés

1. RSS-IA
```typescript
// Exemple d'intégration dans RSS-IA
const analyzeContent = async (content: string) => {
  return await aiManager.processRequest('rss-analyzer', content, {
    maxTokens: 1000,
    temperature: 0.3
  });
};
```

2. AIEnhancedEditor
```typescript
// Exemple dans l'éditeur
const getSuggestions = async (text: string) => {
  return await aiManager.processRequest('editor', text, {
    maxTokens: 2000,
    stream: true
  });
};
```

3. TemplateManager
```typescript
// Exemple de sélection de template
const selectTemplate = async (requirements: string) => {
  return await aiManager.processRequest('template', requirements, {
    cache: true
  });
};
```

## Optimisations

### Cache
- Stratégie par composant
- TTL configurable
- Invalidation intelligente
```typescript
const cacheConfig = {
  rss: { ttl: 3600, maxSize: 100 },
  editor: { ttl: 300, maxSize: 50 },
  template: { ttl: 86400, maxSize: 200 }
};
```

### Gestion des Coûts
- Tracking par composant
- Rapports d'utilisation
- Alertes configurables

## Monitoring

### Métriques Disponibles
1. Par composant :
   - Utilisation (tokens/coût)
   - Cache hits/misses
   - Temps de réponse

2. Global :
   - Budget restant
   - Alertes actives
   - Statistiques d'utilisation

### Dashboard
```typescript
const stats = aiManager.getGlobalStats();
console.log(Stats : ${JSON.stringify(stats, null, 2)});
```

## Tests

### Tests d'Intégration
- Workflow complet
- Performance
- Gestion des erreurs
- Monitoring des coûts

### Mocks pour Tests
```typescript
jest.mock('../../components/AIServiceManager', () => ({
  AIServiceManager: {
    getInstance: jest.fn(() => ({
      processRequest: jest.fn(),
      getComponentStats: jest.fn()
    }))
  }
}));
```

## Bonnes Pratiques

1. Gestion des Coûts
   - Utiliser le cache quand possible
   - Optimiser la taille des requêtes
   - Monitorer l'utilisation

2. Performance
   - Limiter la taille des inputs
   - Utiliser le streaming quand approprié
   - Batching des requêtes similaires

3. Sécurité
   - Validation des inputs
   - Rate limiting par composant
   - Logs d'audit

## Exemple Complet

```typescript
// Exemple d'utilisation complète
class DocumentAnalyzer {
  private aiManager: AIServiceManager;

  constructor() {
    this.aiManager = AIServiceManager.getInstance();
  }

  async analyzeDocument(content: string): Promise<AnalysisResult> {
    try {
      // Vérifier le budget disponible
      const stats = await this.aiManager.getComponentStats('analyzer');
      if (stats.usage > stats.config.budget) {
        throw new Error('Budget exceeded');
      }

      // Procéder à l'analyse
      const response = await this.aiManager.processRequest(
        'analyzer',
        content,
        {
          maxTokens: 1000,
          temperature: 0.3,
          cache: true
        }
      );

      return this.processResponse(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}
```

## Points d'Attention

1. Gestion des Erreurs
   - Toujours implémenter des fallbacks
   - Gérer les timeouts
   - Retries intelligents

2. Monitoring
   - Surveiller les coûts quotidiens
   - Alertes précoces
   - Logs détaillés

3. Performance
   - Cache agressif
   - Optimisation requêtes
   - Batching si possible