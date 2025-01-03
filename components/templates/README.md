# Templates de Formulaires SAPAV

Ce dossier contient les composants React pour les templates de formulaires utilisés dans le projet SAPAV.

## Composants Disponibles

### TemplateAAP
Template pour les Appels à Projets (AAP) avec les champs :
- Titre du projet
- Résumé du projet
- Public cible
- Budget prévisionnel
- Calendrier de réalisation

```jsx
import TemplateAAP from './templates/TemplateAAP';

// Utilisation
<TemplateAAP />
```

### TemplateAO
Template pour les Appels d'Offres (AO) avec les champs :
- Informations société
- Proposition technique
- Proposition financière
- Références
- Planning de réalisation

```jsx
import TemplateAO from './templates/TemplateAO';

// Utilisation
<TemplateAO />
```

## Fonctionnalités
- Validation des champs obligatoires
- Messages d'erreur contextuels
- Réinitialisation du formulaire
- Interface responsive
- Design cohérent avec shadcn/ui

## Dépendances
- React
- shadcn/ui pour les composants d'interface
- Tailwind CSS pour le styling