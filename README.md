# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée avec génération IA
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets
- Système de commentaires collaboratifs via Google Chat intégré

[... contenu existant jusqu'à Architecture Technique ...]

## 🛠 Architecture Technique

### Core
- Système de permissions modulaire
  - Gestionnaires spécialisés (<100 lignes)
  - Types unifiés pour l'authentification et les fichiers
  - Support de l'héritage des permissions
  - Gestion des expirations
  - Tests unitaires par composant

### Backend
- Services Email et RSS
- API Google Drive
- Système de notification
- Gestion des authentifications
- Moteur d'analyse IA
- VersionManager et RollbackManager
- Système de validation documentaire optimisé
  - Validation parallèle des formats et métadonnées
  - Contrôle d'intégrité
  - Journalisation sécurisée
- Nouveau système de permissions
  - API unifiée pour les vérifications
  - Gestion fine des droits d'accès
  - Support multi-niveaux (READ à OWNER)
  - Validation temps réel

[... reste du contenu existant ...]

## Documentation Technique
Pour plus de détails, consultez :
- `/docs/technical/SAPAV-Architecture.md` : Architecture globale
- `/docs/technical/AI-Integration-Guide.md` : Architecture IA centralisée
- `/docs/technical/permissions/README.md` : Système de permissions
- `/docs/technical/RSS-IA-Integration.md` : Système RSS-IA
[... reste de la documentation existante ...]