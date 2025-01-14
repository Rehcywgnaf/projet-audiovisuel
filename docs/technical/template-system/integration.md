# Guide d'Intégration du Système de Templates

## Introduction

Ce guide explique comment intégrer et utiliser le système de templates dans d'autres parties de l'application.

## Usage Basique

### Import des Composants
```typescript
import TemplateUI from '@/components/templates/ui/TemplateUI';
import TemplateFeatures from '@/components/templates/features/TemplateFeatures';
import withPermissions from '@/components/templates/permissions/PermissionChecker';
```

### Utilisation Simple
```typescript
const MyTemplateComponent = () => {
  return (
    <TemplateUI title="Mon Template">
      <TemplateFeatures phases={myPhases} />
    </TemplateUI>
  );
};

export default withPermissions(MyTemplateComponent);
```

## Intégration avec les Services

### Service de Cache
```typescript
// Utilisation du cache de permissions
const cachedPerms = await permissionCache.get('template-key');
if (cachedPerms) {
  // Utiliser les permissions cachées
} else {
  // Vérifier les permissions
}
```

### Validation
```typescript
// Vérification des permissions
const permission = await validateDriveOperation(
  userId,
  'templates',
  'read'
);
```

## Points d'Extension

### Customisation UI
```typescript
const CustomTemplate = () => (
  <TemplateUI
    title="Template Personnalisé"
    isAdmin={true}
    customClass="my-template"
  >
    {/* Contenu personnalisé */}
  </TemplateUI>
);
```

### Étendre les Features
```typescript
interface CustomFeature extends Feature {
  priority: number;
  deadline: Date;
}

const CustomFeatures = () => {
  // Implementation personnalisée
};
```

## Gestion des Événements

### Écoute des Changements
```typescript
const handlePermissionChange = (newPerms: PermissionState) => {
  // Réagir aux changements de permissions
};

const handleFeatureSelect = (feature: Feature) => {
  // Gestion de la sélection
};
```

### Notifications
```typescript
const handlePermissionDenied = () => {
  notifyUser({
    type: 'error',
    message: 'Accès refusé'
  });
};
```

## Tests d'Intégration

### Setup
```typescript
describe('Template Integration', () => {
  beforeEach(() => {
    // Mock des services nécessaires
  });

  it('should integrate with permissions', () => {
    // Test d'intégration
  });
});
```

### Mocks
```typescript
jest.mock('@/lib/drive/permissions/core', () => ({
  validateDriveOperation: jest.fn()
}));
```

## Dépannage

### Problèmes Courants
1. Permissions non propagées
   - Vérifier l'ordre du HOC
   - Valider le cache

2. Features non affichées
   - Confirmer les permissions
   - Vérifier la structure

### Logs
```typescript
const debugPermissions = (perms: PermissionState) => {
  console.log('Permission Debug:', {
    perms,
    timestamp: new Date()
  });
};
```

## Performance

### Optimisations
```typescript
// Utiliser useMemo pour les calculs coûteux
const memoizedFeatures = useMemo(
  () => computeFeatures(data),
  [data]
);

// Utiliser useCallback pour les handlers
const handleChange = useCallback(
  (event) => {
    // Handler logic
  },
  [dependencies]
);
```

### Métriques
```typescript
const measureTemplatePerformance = () => {
  console.time('template-render');
  // Rendu du template
  console.timeEnd('template-render');
};
```

## Sécurité

### Validation Input
```typescript
const validateTemplateData = (data: unknown): data is TemplateData => {
  // Validation logic
};
```

### Audit
```typescript
const logTemplateAccess = (userId: string, templateId: string) => {
  // Log access attempt
};
```