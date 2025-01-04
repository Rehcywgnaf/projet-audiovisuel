# Changelog

Toutes les modifications notables du projet SAPAV seront documentées dans ce fichier.

## [Non Publié]

### Ajouté
- Nouveau composant UnifiedDeadlineManager :
  - Gestion unifiée des deadlines et des opportunités
  - Synchronisation RSS basique
  - Système de filtres (type, source, dates)
  - Interface utilisateur responsive avec shadcn/ui

## [1.1.0] - 2024-01-25

### Ajouté
- Intégration initiale avec Google Drive
- Système de gestion des versions de documents
- Templates pour les documents AAP/AO
- Composant TeamTracking pour le suivi des équipes

### Modifié
- Amélioration de la gestion des deadlines
- Optimisation des calculateurs pour les performances matérielles
- Mise à jour du système de notifications

### Corrigé
- Correction des problèmes de timeout administrateur
- Résolution des conflits de versioning
- Gestion des reconnexions automatiques

## [1.0.0] - 2024-01-15

### Ajouté
- Architecture initiale du projet
- Système d'authentification Google
- Composants de base :
  - Dashboard principal
  - RSS & système d'alertes
  - Interface Google Drive
  - Système de test et feedback
- Documentation technique initiale

### TODO v2.0.0
- Filtres avancés :
  - Budget
  - Priorité
  - Options de tri personnalisables
- Synchronisation automatique périodique des flux RSS
- Intégration avancée avec le système de veille
- Améliorations de l'interface utilisateur :
  - Mode sombre
  - Vues personnalisables
  - Export de données amélioré

### Notes de Maintenance
- Surveillance régulière de l'erreur 32603 lors des push GitHub
- Vérification systématique de l'intégrité des fichiers après push