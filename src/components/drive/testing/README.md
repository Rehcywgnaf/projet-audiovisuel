# Composants de Test Drive

## Vue d'ensemble
Ces composants permettent de tester les performances et la stabilité de l'intégration Google Drive.

## Composants
1. DriveTestExecutor : Interface utilisateur des tests
2. DriveTestService : Service de gestion des tests

## État Actuel
- Version de simulation implémentée
- TODO : Intégrer les vraies opérations Drive (voir /docs/todo/drive-test-integration.md)

## Utilisation
```typescript
// Exemple d'utilisation basique
import { DriveTestExecutor } from '@/components/drive/testing';

function MyComponent() {
  return <DriveTestExecutor />;
}
```

## Points d'attention
- Les opérations sont actuellement simulées
- Les métriques système sont générées aléatoirement
- Prêt pour l'intégration des vraies opérations Drive
