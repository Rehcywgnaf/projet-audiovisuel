# Tests d'Intégration RSS-IA et TemplateManager

## Vue d'ensemble
Ces tests vérifient l'intégration entre le système RSS-IA et le TemplateManager récemment remanié (v1.5.1). Ils couvrent :
- Le workflow complet de la détection d'un AAP à la génération du template
- La gestion des erreurs et états de chargement
- La validation des métadonnées
- Les performances du rendu

## Structure des Tests

### 1. Workflow Complet
- Chargement des données RSS
- Analyse IA du projet
- Sélection du template approprié
- Génération des suggestions contextuelles
- Vérification des autorisations

### 2. Gestion Erreurs
- Erreurs de chargement RSS
- Erreurs d'analyse IA
- États de chargement asynchrone

### 3. Validation Métadonnées
- Deadlines
- Budget
- Complexité estimée
- Équipe recommandée

### 4. Tests Performance
- Temps de rendu < 200ms
- Chargement asynchrone correct
- Gestion mémoire optimisée

## Composants Testés

### TemplateUI
- Interface utilisateur de base (~45 lignes)
- Formulaires et prévisualisation
- Gestion des états de base

### TemplateFeatures
- Fonctionnalités IA (~50 lignes)
- Suggestions contextuelles
- Analyse du projet

### PermissionChecker
- Logique de permissions (~90 lignes)
- Contrôle d'accès
- Cache et validation

## Mocks et Configuration

### RSSService
```typescript
mockRSSData = {
  title: string;
  deadline: string;
  budget: number;
  requirements: string[];
  type: string;
}
```

### AIAnalyzer
```typescript
mockAIAnalysis = {
  suggestedTemplate: string;
  keyPoints: string[];
  recommendedApproach: string;
  estimatedComplexity: string;
  suggestedTeamSize: number;
}
```

## Exécution des Tests

```bash
# Installation des dépendances
npm install

# Lancement des tests d'intégration
npm run test:integration

# Vérification de la couverture
npm run test:coverage
```

## Points d'Attention
1. S'assurer que les mocks reflètent les données réelles
2. Vérifier les temps de réponse en conditions réelles
3. Tester avec différents types d'AAP/AO
4. Valider la gestion mémoire sur de longues sessions