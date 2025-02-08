# Hook useAI - Documentation Technique

## Vue d'ensemble

Le hook `useAI` facilite l'utilisation de l'AIServiceManager dans les composants React en fournissant une interface simple et des états gérés automatiquement.

## Interface

```typescript
interface UseAIResult {
  isLoading: boolean;
  error: Error | null;
  result: AIResponse | null;
  execute: (operation: string, options?: AIRequest['options']) => Promise<void>;
  stats: {
    totalCost: number;
    requests: number;
    cacheHits: number;
  } | null;
  clearError: () => void;
}

function useAI(service: string): UseAIResult;
```

## Utilisation

### Exemple Simple
```typescript
function DocumentAnalyzer() {
  const { execute, isLoading, result } = useAI('analyzer');

  const analyzeDocument = async () => {
    await execute('analyze-content', {
      complexity: 'complex',
      cache: true
    });
  };

  if (isLoading) return <div>Analyse en cours...</div>;
  if (result) return <div>Résultat : {result.data}</div>;
  
  return <button onClick={analyzeDocument}>Analyser</button>;
}
```

### Avec Gestion d'Erreurs
```typescript
function RSSFilter() {
  const { 
    execute, 
    isLoading, 
    error, 
    clearError 
  } = useAI('rss-filtering');

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      clearError();
    }
  }, [error, clearError]);

  // ... reste du composant
}
```

### Monitoring des Coûts
```typescript
function CostMonitor() {
  const { stats } = useAI('document-generation');

  return (
    <div>
      <h3>Statistiques</h3>
      <p>Coût total : ${stats?.totalCost.toFixed(4)}</p>
      <p>Requêtes : {stats?.requests}</p>
      <p>Cache hits : {stats?.cacheHits}</p>
    </div>
  );
}
```

## Bonnes Pratiques

### Gestion du State
- Toujours gérer `isLoading` pour l'UX
- Implémenter des fallbacks pour les erreurs
- Nettoyer les erreurs après affichage

### Performance
1. Utiliser le cache quand possible
```typescript
await execute('operation', { cache: true });
```

2. Éviter les requêtes inutiles
```typescript
const { execute } = useAI('service');

// ❌ Mauvais : Requête à chaque render
useEffect(() => {
  execute('operation');
}, []);

// ✅ Bon : Requête conditionnelle
useEffect(() => {
  if (shouldExecute) {
    execute('operation');
  }
}, [shouldExecute]);
```

3. Gérer le nettoyage
```typescript
useEffect(() => {
  let mounted = true;
  
  async function fetchData() {
    if (!mounted) return;
    await execute('operation');
  }
  
  fetchData();
  return () => { mounted = false; };
}, []);
```

### Optimisation des Coûts
- Choisir la complexité appropriée
- Utiliser le cache intelligemment
- Monitorer les coûts régulièrement

## Tests

### Tests Unitaires
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAI } from './useAI';

describe('useAI', () => {
  it('should handle successful requests', async () => {
    const { result } = renderHook(() => useAI('test-service'));
    
    await act(async () => {
      await result.current.execute('test-operation');
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toBeDefined();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useAI('invalid-service'));
    
    await act(async () => {
      await result.current.execute('invalid-operation');
    });
    
    expect(result.current.error).toBeDefined();
  });
});
```

### Tests d'Intégration
```typescript
describe('useAI Integration', () => {
  it('should integrate with AIServiceManager', async () => {
    const { result } = renderHook(() => useAI('analyzer'));
    
    await act(async () => {
      await result.current.execute('analyze', {
        complexity: 'simple',
        cache: true
      });
    });
    
    expect(result.current.stats.totalCost).toBeGreaterThan(0);
  });
});
```

## Points d'Attention

### Performances
- Éviter les requêtes en boucle
- Gérer le cache efficacement
- Nettoyer les ressources

### Erreurs
- Toujours implémenter error boundaries
- Logger les erreurs importantes
- Fournir des fallbacks

### State Management
- Gérer les race conditions
- Implémenter le nettoyage
- Éviter les fuites mémoire