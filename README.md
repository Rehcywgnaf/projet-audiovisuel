# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée avec génération IA
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets
- Système de commentaires collaboratifs en temps réel

### Composants Principaux
1. **Système RSS-IA**
   - Veille automatisée des opportunités
   - Analyse intelligente des AAP/AO
   - Extraction de données structurées
   - Enrichissement contextuel

2. **AIEnhancedEditor**
   - Génération assistée de contenu
   - Suggestions contextuelles
   - Interface d'édition augmentée
   - Validation intelligente

3. **DocumentManager**
   - Gestion centralisée des versions (VersionManager)
   - Système de commentaires collaboratif
   - Import/Export multi-formats
   - Collaboration en temps réel
   - Validation automatique des documents
   - Vérification temps réel des formats

## Documentation Technique
Pour plus de détails, consultez :
- `/docs/technical/SAPAV-Architecture.md` : Architecture globale
- `/docs/technical/RSS-IA-Integration.md` : Système RSS-IA
- `/docs/technical/AIEnhancedEditor.md` : Éditeur augmenté
- `/docs/technical/version-system/` : Système de versions
- `/docs/technical/document-validation/` : Système de validation
  
## 🚀 Fonctionnalités principales

### 1. Système de Veille
- Surveillance automatique des appels à projets et appels d'offres
- Agrégation multi-sources (CNC, régions, plateformes...)
- Système de notification personnalisé
- Analyse de pertinence intégrée

### 2. Gestion Documentaire
- Génération IA de documents basée sur l'analyse des AAP/AO
- Suggestions contextuelles intelligentes
- Templates spécialisés par type de projet
- Intégration Google Drive native avec système de versions avancé
  - Gestion centralisée via VersionManager
  - Interface intuitive VersionHistory
  - Rollback sécurisé avec RollbackManager
  - Optimisation des performances de stockage
- Système de commentaires collaboratifs en temps réel
  - Catégorisation des commentaires par type
  - Support temps réel via WebSocket
  - Interaction avec le système de suggestions IA
  - Interface responsive et intuitive
- Système de validation intelligent des documents
  - Validation temps réel des formats (DOC, DOCX, PDF, ODT)
  - Vérification automatique des métadonnées
  - Contrôle de cohérence des contenus
  - Interface de feedback immédiat
- Personnalisation avancée des documents
- Système de feedback et révision
- Gestion avancée des deadlines

### 3. Suivi des Candidatures
- Dashboard temps réel
- Monitoring des deadlines
- Alertes automatiques
- Statistiques et reporting

### 4. Accompagnement Projet
- Suivi personnalisé
- Support administratif
- Formation intégrée
- Documentation exhaustive

## 🛠 Architecture Technique

### Frontend
- Dashboard principal (React/Tailwind)
- Modules RSS & Alertes
- Interface Google Drive
- Système de suivi des équipes
- Générateur de documents IA
- Système de commentaires temps réel
- VersionHistory et VersionControl pour le système de versions
- DocumentValidator pour la validation intelligente
  - Interface temps réel
  - Feedback utilisateur contextuel
  - Intégration système d'audit

### Backend
- Services Email et RSS
- API Google Drive
- Système de notification
- Gestion des authentifications
- Moteur d'analyse IA
- VersionManager et RollbackManager
- Système de validation documentaire
  - Validation des formats et métadonnées
  - Contrôle d'intégrité
  - Journalisation sécurisée

### Composants Drive
- DeadlineManager
- DrivePermissions
- DriveSync
- ErrorHandling
- VersionStore pour le stockage optimisé
- DocumentValidator
  - Validation temps réel
  - Gestion des formats
  - Intégration audit
  - Tests automatisés

## 📦 Installation

### Prérequis
```bash
- Node.js (v16+)
- npm ou yarn
- Compte Google Workspace
- Droits d'administration
Configuration

Cloner le repository

bashCopygit clone [URL_REPO_PRIVÉ]
cd sapav

Installer les dépendances

bashCopynpm install

Configurer les variables d'environnement

bashCopycp .env.example .env
# Éditer .env avec vos paramètres

Lancer l'application

bashCopynpm run dev
🔧 Guide d'utilisation
Configuration initiale

Connexion avec compte Google Workspace
Configuration des sources de veille
Paramétrage des notifications
Personnalisation des templates

Utilisation quotidienne

Dashboard de suivi
Génération et édition des documents
Suivi des deadlines
Reporting et statistiques

📞 Support
Support technique

Email : support@sapav.com
Documentation : /docs
Wiki : [URL_WIKI]

Ressources

Guide utilisateur : /docs/user-guide
Documentation API : /docs/api
Tutoriels vidéo : /docs/tutorials

📄 Licence
Projet privé - Tous droits réservés
🔄 Mises à jour
Consultez le CHANGELOG.md pour l'historique des modifications.

Note: Ce README est maintenu à jour via le repository GitHub. Pour plus de détails techniques, consultez la documentation dans le dossier /docs.
