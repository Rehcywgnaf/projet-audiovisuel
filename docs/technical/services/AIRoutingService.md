# Service AIRouting - Documentation Technique

## Vue d'ensemble

L'AIRoutingService est responsable de la sélection intelligente du modèle Claude (Haiku ou Sonnet) en fonction des caractéristiques de la requête.

## Architecture

### Structure
```typescript
interface RoutingCriteria {
  serviceType: 'rss' | 'editor' | 'validator' | 'suggester' | 'analyzer';
  maxTokens?: number;
  complexity: 'simple' | 'complex';
  timeConstraint: 'strict' | 'flexible';
  contextRequired: boolean;
}
```

### Configuration des Services

| Service | Type | Complexité | Contrainte Temps | Contexte |
|---------|------|------------|------------------|----------|
| deadline-suggestions | suggester | simple | strict | non |
| rss-filtering | rss | simple | strict | non |
| document-preview | validator | simple | strict | non |
| metadata-enrichment | analyzer | simple | flexible | oui |
| aap-analysis | analyzer | complex | flexible | oui |
| document-generation | editor | complex | flexible | oui |

## Logique de Routing

### Critères Haiku
Pour qu'une requête soit routée vers Haiku, elle doit remplir TOUS ces critères :
- Complexité : simple
- Contrainte temps : strict
- Pas de contexte requis
- Tokens ≤ 1000 (si spécifié)

### Sélection du Modèle
```typescript
if (
  criteria.complexity === 'simple' &&
  criteria.timeConstraint === 'strict' &&
  !criteria.contextRequired &&
  (!criteria.maxTokens || criteria.maxTokens <= 1000)
) {
  return 'claude-3-haiku-20240307';
}

return 'claude-3-sonnet-20240229';
```

## Utilisation

### Exemple Simple
```typescript
const routingService = AIRoutingService.getInstance();
const model = routingService.routeRequest('rss-filtering');
// Retourne 'claude-3-haiku-20240307'
```

### Avec Critères Spécifiques
```typescript
const model = routingService.routeRequest('analyzer', {
  complexity: 'complex',
  timeConstraint: 'flexible',
  contextRequired: true
});
// Retourne 'claude-3-sonnet-20240229'
```

### Configuration Personnalisée
```typescript
const config = routingService.getServiceConfig('document-preview');
if (config) {
  console.log(`Service type: ${config.serviceType}`);
  console.log(`Complexity: ${config.complexity}`);
}
```

## Bonnes Pratiques

### Optimisation des Coûts
1. Privilégier Haiku quand possible
```typescript
// ✅ Bon : Spécifier des critères adaptés
routeRequest('validator', {
  complexity: 'simple',
  maxTokens: 500
});

// ❌ Mauvais : Surqualifier la requête
routeRequest('validator', {
  complexity: 'complex',
  contextRequired: true
});
```

2. Gérer les limites de tokens
```typescript
// ✅ Bon : Spécifier une limite
{
  maxTokens: 800,
  complexity: 'simple'
}

// ❌ Mauvais : Pas de limite
{
  complexity: 'simple'
}
```

### Performance
1. Utiliser getInstance
```typescript
// ✅ Bon : Singleton
const service = AIRoutingService.getInstance();

// ❌ Mauvais : Nouvelle instance
const service = new AIRoutingService();
```

2. Gérer les services inconnus
```typescript
// ✅ Bon : Vérifier la configuration
const config = service.getServiceConfig('mon-service');
if (!config) {
  console.warn('Service non configuré');
}

// ❌ Mauvais : Accès direct
service.routeRequest('mon-service');
```

## Tests

### Tests Unitaires
```typescript
describe('AIRoutingService', () => {
  let service: AIRoutingService;

  beforeEach(() => {
    service = AIRoutingService.getInstance();
  });

  it('should route simple requests to Haiku', () => {
    const model = service.routeRequest('rss-filtering');
    expect(model).toBe('claude-3-haiku-20240307');
  });

  it('should route complex requests to Sonnet', () => {
    const model = service.routeRequest('aap-analysis');
    expect(model).toBe('claude-3-sonnet-20240229');
  });

  it('should handle custom criteria', () => {
    const model = service.routeRequest('validator', {
      complexity: 'complex',
      contextRequired: true
    });
    expect(model).toBe('claude-3-sonnet-20240229');
  });
});
```

### Tests d'Intégration
```typescript
describe('AIRoutingService Integration', () => {
  it('should integrate with AIServiceManager', () => {
    const aiManager = AIServiceManager.getInstance();
    const response = await aiManager.processRequest('rss-filtering', 'analyze');
    expect(response.model).toBe('claude-3-haiku-20240307');
  });
});
```

## Points d'Attention

### Fallback Sécurisé
- Toujours utiliser Sonnet en cas de doute
- Logger les cas de fallback pour analyse
- Monitorer les coûts des fallbacks

### Monitoring
- Suivre le ratio Haiku/Sonnet
- Analyser les patterns d'utilisation
- Vérifier les économies réalisées
- Ajuster les critères si nécessaire

### Maintenance
- Revoir les critères régulièrement
- Optimiser selon l'usage réel
- Mettre à jour la documentation
- Maintenir les tests à jour