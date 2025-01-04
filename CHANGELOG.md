# Changelog

## [0.4.4] - 2024-01-04
### Added
- IntegrationDrive: Ajout du composant avec fonctionnalités de base
  - Interface d'upload de fichiers et création de dossiers
  - Visualisation du quota de stockage
  - Liste des fichiers avec données mockées
  - Gestion des erreurs et statuts
  - Support TypeScript intégré
  - TODO détaillé pour les améliorations futures

### Todo
- IntegrationDrive: Implémentation du système de versioning
- IntegrationDrive: Intégration avec l'API Google réelle
- IntegrationDrive: Gestion avancée des permissions

## [0.4.3] - 2024-01-04
### Added
- DevelopmentPlan: Ajout du composant de suivi dans /docs/development/
  - Visualisation de l'avancement des composants
  - Indicateurs de priorité
  - Suivi des tailles et du statut
- Documentation: Ajout du diagramme des dépendances entre composants
  - Visualisation des relations critiques
  - État d'avancement de chaque composant
  - Points de blocage identifiés

### Changed
- Organisation: Amélioration de la structure de la documentation
  - Séparation claire entre composants applicatifs et outils de développement
  - Centralisation des documents de suivi dans /docs/development/

## [0.4.2] - 2024-01-04
### Added
- BetaDeployment: Création du système de déploiement beta
  - Suivi de progression du déploiement
  - Monitoring des modules
  - Système d'arrêt d'urgence
- IntegratedDashboard: Nouveau dashboard unifié
  - Intégration RSS & Alertes
  - Intégration Google Drive
  - Interface de tests utilisateur

### Changed
- Optimisation de l'intégration des composants existants
- Amélioration de la gestion des états dans le dashboard

### Fixed
- Correction de l'intégrité des fichiers après push
- Mise à jour des composants incomplets

## [0.4.1] - 2024-01-04
### Added
- TeamTracking: Tests unitaires complets
  - Test du chargement initial
  - Test de l'affichage des données
  - Test du calcul de charge de travail
  - Test des codes couleur d'alerte
  - Test du formatage des dates
  - Test de la gestion d'erreurs
- TeamTracking: Configuration des mocks pour les tests
  - Mock des composants UI
  - Mock des icônes
  - Mock de la gestion du temps

### Dependencies
- Ajout des dépendances de test
  - @testing-library/react
  - @testing-library/jest-dom

## [0.4.0] - 2024-01-04
### Added
- TeamTracking: Ajout des données initiales de test
- TeamTracking: Simulation du chargement asynchrone
- TeamTracking: Calcul automatique de la charge de travail
- TeamTracking: Interface responsive améliorée
- TeamTracking: Gestion des états de chargement et d'erreur

### Changed
- TeamTracking: Restructuration des données pour inclure timeAllocation
- TeamTracking: Amélioration de l'affichage des projets par membre

### Todo
- TeamTracking: Intégration future avec l'API backend

## [0.3.0] - 2024-01-03
### Added
- IntegrationDrive: Mise en place de la connexion Google Drive
- TemplateManager: Création des templates de base
- FeedbackSystem: Structure initiale

### Changed
- Architecture: Réorganisation des composants React
- Documentation: Mise à jour des spécifications techniques

## [0.2.0] - 2024-01-02
### Added
- Système de veille: Intégration RSS
- Dashboard: Premier prototype
- Authentification: Configuration OAuth

### Fixed 
- Correction des problèmes de performance
- Optimisation des requêtes API

## [0.1.0] - 2024-01-01
### Added
- Initialisation du projet
- Configuration de base
- Structure des dossiers
- Mise en place de l'environnement de développement