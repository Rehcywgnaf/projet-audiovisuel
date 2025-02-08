# Guide d'Intégration IA - SAPAV

## Architecture Globale

### Points Centraux
1. **AIServiceManager**
   - Point d'entrée unique
   - Gestion des requêtes vers l'API Claude
   - Monitoring des coûts et performances
   - Cache intelligent par service

2. **AIRoutingService**
   - Sélection intelligente Haiku/Sonnet
   - Configuration par type de service
   - Critères de routing
   - Gestion des fallbacks

### Stratégie de Routing
Critères de sélection entre Haiku et Sonnet :

#### Haiku (0.00001$/token)
- Requêtes simples et rapides
- Sans contexte étendu
- Maximum 1000 tokens
- Temps de réponse critique

Utilisé pour :
- Suggestions de deadlines
- Filtrage initial RSS
- Prévisualisation documents
- Enrichissement léger métadonnées

#### Sonnet (0.00003$/token)
- Analyses complexes
- Besoin de contexte
- Sans limite de tokens
- Temps de réponse flexible

Utilisé pour :
- Analyse approfondie AAP/AO
- Génération de documents
- Suggestions structurelles
- Analyses contextuelles

## Configuration

### Variables d'Environnement
```env
CLAUDE_API_KEY=votre_clé_api_claude
CLAUDE_SONNET_MODEL=claude-3-sonnet-20240229
CLAUDE_HAIKU_MODEL=claude-3-haiku-20240307
```

### Gestion des Coûts
- Budget mensuel : 15$
- Seuil d'alerte : 10$
- Monitoring par service
- Calcul des coûts par modèle

## Utilisation

### Via Hook React
```typescript
function MonComposant() {
  const { 
    execute, 
    isLoading, 
    result, 
    stats 
  } = useAI('rss-filtering');

  const analyserContenu = async () => {
    await execute('analyser', {
      complexity: 'simple',
      timeConstraint: 'strict',
      cache: true
    });
  };
}
```

### Via Manager Direct
```typescript
const aiManager = AIServiceManager.getInstance();
const response = await aiManager.processRequest(
  'document-generation',
  'génerer',
  {
    complexity: 'complex',
    contextRequired: true
  }
);
```

## Monitoring

### Métriques Disponibles
- Coût total par service
- Nombre de requêtes
- Latence moyenne
- Taux d'utilisation du cache
- Modèle utilisé

### Alertes
- Approche du budget
- Erreurs API
- Performance dégradée

## Bonnes Pratiques

### Optimisation des Coûts
1. Utiliser le cache quand possible
2. Évaluer la complexité réelle
3. Limiter les tokens quand possible
4. Préférer Haiku pour les tâches simples

### Performance
1. Gérer les timeouts
2. Implémenter des retries
3. Monitorer les latences
4. Utiliser le streaming si nécessaire

## Tests

### Tests Unitaires
```typescript
describe('AIServiceManager', () => {
  it('should route simple requests to Haiku', async () => {
    const manager = AIServiceManager.getInstance();
    const response = await manager.processRequest('rss-filtering', 'filter', {
      complexity: 'simple'
    });
    expect(response.model).toBe('claude-3-haiku-20240307');
  });
});
```

### Tests de Charge
- 50 validations simultanées
- 20 générations/minute
- 100 mises à jour cache/30s
- 200 lectures/minute

## Points d'Attention

### Sécurité
- Protection clé API
- Validation des entrées
- Audit des accès
- Logs sécurisés

### Maintenance
- Monitoring régulier
- Ajustement des seuils
- Optimisation du cache
- Mise à jour des coûts

## Évolutions Futures

### Court Terme
1. Dashboard de monitoring
2. Amélioration du cache
3. Optimisation des coûts

### Long Terme
1. Support nouveaux modèles
2. Analytics avancées
3. Auto-optimisation