# Documentation Technique - Composants TemplateManager

## Vue d'ensemble

Le TemplateManager se compose de plusieurs modules spécialisés qui collaborent pour gérer les templates de documents :

- TemplateCatalog : Gestion des modèles disponibles
- StructureManager : Validation de la structure
- AIEditor : Édition enrichie par l'IA

## API des Composants

### TemplateCatalog
```typescript
interface Props {
  templates: Template[];
  onSelect: (template: Template) => void;
}
```

#### Responsabilités
- Affichage liste templates
- Catégorisation AAP/AO
- Filtrage et recherche
- Sélection template

### StructureManager
```typescript
interface Props {
  structure: TemplateStructure;
  onValidation?: (isValid: boolean) => void;
}
```

#### Validation
- Sections requises
- Limites mots
- Champs obligatoires
- Format contenu

### AIEditor
```typescript
interface Props {
  content?: string;
  onChange?: (content: string) => void;
}
```

#### Fonctionnalités
- Édition temps réel
- Suggestions IA
- Enrichissement contenu
- Validation structure

## Types Partagés

### Template
```typescript
interface Template {
  id: string;
  name: string;
  type: 'AAP' | 'AO';
  structure: TemplateStructure;
  metadata: TemplateMetadata;
}
```

### Structure
```typescript
interface TemplateStructure {
  sections: TemplateSectionDefinition[];
  requiredFields: RequiredField[];
}
```

## Workflow d'Utilisation

1. Sélection Template
   ```typescript
   <TemplateCatalog 
     templates={templates}
     onSelect={handleTemplateSelect}
   />
   ```

2. Validation Structure
   ```typescript
   <StructureManager 
     structure={selectedTemplate.structure}
     onValidation={handleValidation}
   />
   ```

3. Édition Contenu
   ```typescript
   <AIEditor
     content={documentContent}
     onChange={handleContentChange}
   />
   ```

## Points d'Intégration

### Avec DocumentManager
- Versioning contenu
- Gestion commentaires
- Import/Export

### Avec RSS/IA
- Suggestions pertinentes
- Enrichissement auto
- Validation données

## Tests

### Composants UI
```typescript
// TemplateCatalog.test.tsx
test('affiche liste templates', () => {...})
test('filtre par type', () => {...})

// StructureManager.test.tsx
test('valide sections requises', () => {...})
test('vérifie limites mots', () => {...})
```

### Types
```typescript
// types.test.ts
test('validation template', () => {...})
test('validation structure', () => {...})
```

## Guides d'Utilisation

### Intégration Template
```typescript
import { TemplateCatalog, StructureManager, AIEditor } from '@/components/TemplateManager';

function TemplateEditor() {
  return (
    <div>
      <TemplateCatalog /* props */ />
      <StructureManager /* props */ />
      <AIEditor /* props */ />
    </div>
  );
}
```

### Style et UI
- UI cohérente `/ui`
- Composants partagés
- Design system

### Points Attention
1. Performance
   - Memoization composants
   - Lazy loading templates
   - Cache suggestions

2. Validation
   - Structure temps réel
   - Format données
   - Erreurs utilisateur