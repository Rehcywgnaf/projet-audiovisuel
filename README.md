# SAAOP - Système d'Accompagnement des Appels d'Offres et Projets Audiovisuels

## Vue d'ensemble
SAAOP est une plateforme intégrée dédiée au support et à l'accompagnement des projets audiovisuels, spécialisée dans deux axes majeurs :
- Appels à Projets (AAP)
- Appels d'Offres (AO)

### Caractéristiques principales
- Veille automatisée des opportunités (AAP/AO)
- Gestion documentaire avancée avec versioning
- Suivi des deadlines et des soumissions
- Intégration Google Workspace
- Support multi-équipes

## Types d'Appels et Gestion

### Appels d'Offres (AO)
- **Caractéristiques**
  - Marchés publics
  - Procédures formalisées
  - Délais stricts
  - Documentation technique/administrative/commerciale

- **Processus**
  1. Veille des plateformes de marchés publics
  2. Analyse des cahiers des charges
  3. Constitution des dossiers administratifs
  4. Réponses techniques et commerciales
  5. Suivi des soumissions

### Appels à Projets (AAP)
- **Caractéristiques**
  - Financement culturel/créatif
  - Processus créatif
  - Focus artistique
  - Documentation narrative/budgétaire

- **Processus**
  1. Veille des opportunités culturelles
  2. Analyse de l'éligibilité
  3. Développement du projet artistique
  4. Montage financier
  5. Présentation et pitching

### Différenciation dans le Système
- **Interface distincte** pour chaque type
- **Templates spécifiques** par catégorie
- **Workflows adaptés** aux exigences
- **Alertes personnalisées** selon le type
- **Tableaux de bord** séparés

## Structure du Projet

### Composants Frontend
```
/components/
├── dashboard/        # Tableau de bord principal
├── drive/           # Intégration Google Drive
├── team/            # Suivi des équipes
└── project-submission/
    ├── AOComponent  # Gestion des appels d'offres
    └── AAPComponent # Gestion des appels à projets
```

### Services
```
/services/
├── email/          # Notifications et alertes
├── rss/            # Veille et agrégation
├── drive/          # Synchronisation Google Drive
└── ao/             # Service Appels d'Offres
    ├── types.ts
    ├── aoService.ts
    └── templates/
```

## État du Développement

### Sprint Actuel (Sprint 2 - Documents & Drive)
- Templates documents (AAP/AO)
- Système de versioning
- Gestion des deadlines

### Prochaines Étapes
- Intégration des modules existants
- Tests et validation
- Déploiement beta

## Installation et Configuration

### Prérequis
- Node.js >= 16.x
- Accès Google Workspace
- Permissions API nécessaires

### Installation
```bash
npm install
npm run setup
```

### Configuration
1. Configurer les variables d'environnement (.env)
2. Initialiser l'authentification Google
3. Vérifier les permissions Drive

## Utilisation

### Développement
```bash
npm run dev
```

### Tests
```bash
npm test
```

### Build
```bash
npm run build
```

## Architecture Technique

### Stack Technique
- Frontend: React avec TypeScript
- UI: Tailwind CSS + shadcn/ui
- Stockage: Google Drive API
- Authentification: Google OAuth 2.0

### Intégrations
- Google Workspace
- API Marchés Publics
- RSS Feeds
- Systèmes de notification

## Guidelines de Contribution

### Branches
- `main`: production
- `develop`: développement
- Feature branches: `feature/nom-feature`

### Commits
Format: `type(scope): description`
Exemple: `feat(ao): ajout du service de validation AO`

### Code Style
- ESLint configuration
- Prettier pour le formatage
- TypeScript strict mode

## Support et Contact

### Équipe Technique
- Support: support@saaop.com
- Documentation: docs/
- Wiki: wiki/

## Licence
Propriétaire - Tous droits réservés

---
Dernière mise à jour: 2 janvier 2024