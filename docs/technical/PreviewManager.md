# Documentation Technique - Preview Manager

## Vue d'ensemble
Le PreviewManager est un composant React permettant la visualisation en temps réel des documents générés par SAPAV. Il s'intègre avec le système de versionning existant pour offrir une navigation fluide entre les différentes versions d'un document.

## Fonctionnalités principales
1. **Modes d'affichage**
   - Vue Web (responsive)
   - Vue Print (format A4)
   - Zoom et navigation

2. **Intégration avec DocumentVersionManager**
Le PreviewManager s'intègre directement avec le DocumentVersionManager existant pour :
- Récupérer l'historique des versions
- Visualiser les modifications entre versions
- Maintenir la cohérence du versionning
- Assurer la traçabilité des changements

3. **Performance**
   - Rendu optimisé
   - Mise à jour temps réel
   - Gestion mémoire efficace

## Architecture technique
- Composant React standalone
- Utilisation des hooks React pour la gestion d'état
- Integration avec le système de versions
- Support des templates via props

## Guide d'intégration
1. Importer le composant :
```javascript
import PreviewManager from '@/components/PreviewManager';
```

2. Utilisation basique :
```javascript
<PreviewManager 
  document={currentDoc}
  version={selectedVersion}
  onVersionChange={handleVersionChange}
/>
```

## Points d'attention
- Vérifier la compatibilité des templates
- Tester les performances sur documents lourds
- Valider le support multi-navigateurs

## Prochaines évolutions
- Support export PDF
- Comparaison côte à côte
- Annotations en temps réel