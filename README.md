# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée avec génération IA
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets
- Système de commentaires collaboratifs via Google Chat intégré

### Dashboard Principal
- Système de veille intelligent avec score de pertinence
- Visualisation des nouvelles opportunités (AAP/AO)
- Métriques de performance en temps réel
  - Suivi des projets actifs
  - Taux de succès
  - Gestion des équipes
- Points d'attention centralisés
  - Alertes deadlines
  - Suivi des validations
  - Planning des revues

### Architecture IA
Le projet utilise Claude-3 Sonnet d'Anthropic via une architecture centralisée :
- AIServiceManager : Point d'entrée unique pour l'IA
- Budget optimisé (max 15$/mois)
- Cache intelligent par composant avec monitoring des performances
- Monitoring en temps réel des coûts et des performances
- Système de préchargement intelligent

### Composants Principaux
1. **Système RSS-IA**
   - Veille automatisée des opportunités
   - Analyse intelligente des AAP/AO via AIServiceManager
   - Extraction de données structurées
   - Tests d'intégration complets
   - Enrichissement contextuel
   - Cache 1h, priorité haute (95% hit rate)

2. **AIEnhancedEditor**
   - Génération assistée de contenu via AIServiceManager
   - Suggestions contextuelles en temps réel
   - Interface d'édition augmentée
   - Validation intelligente
   - Cache 2min, priorité moyenne (98% hit rate optimisé)

3. **DocumentManager**
   - Gestion centralisée des versions (VersionManager)
   - Système de commentaires collaboratif
   - Import/Export multi-formats
   - Collaboration en temps réel
   - Validation automatique optimisée (150-200ms)
   - Vérification temps réel des formats
   - Cache 10min, priorité moyenne (95% hit rate)
   - Validation parallélisée des documents
   - Préchargement intelligent des documents fréquents

4. **Système de Templates**
   - Architecture modulaire et testable
   - TemplateUI : Interface utilisateur de base (~45 lignes)
   - TemplateFeatures : Gestion des fonctionnalités IA via AIServiceManager
   - PermissionChecker : Contrôle d'accès intelligent (~90 lignes)
   - Tests unitaires et d'intégration complets
   - Documentation détaillée
   - Cache 24h, priorité basse (99% hit rate)

5. **ChatIntegration**
   - Espaces de discussion par projet
   - Gestion des membres intégrée
   - Utilisation de l'API Google Chat native
   - Authentification unifiée avec Google Workspace

6. **Système de Monitoring**
   - Dashboard de performance en temps réel
   - Suivi des métriques par composant
   - Tests de charge automatisés
   - Seuils d'alerte configurables
   - Procédures d'urgence documentées
   - Interface de monitoring visuelle
   - Historique des performances sur 7 jours
   - Alertes proactives

## Documentation Technique
Pour plus de détails, consultez :
- `/docs/technical/SAPAV-Architecture.md` : Architecture globale
- `/docs/technical/AI-Integration-Guide.md` : Architecture IA centralisée
- `/docs/technical/RSS-IA-Integration.md` : Système RSS-IA
- `/docs/technical/AIEnhancedEditor.md` : Éditeur augmenté
- `/docs/technical/version-system/` : Système de versions
- `/docs/technical/document-validation/` : Système de validation
- `/docs/technical/template-system/` : Architecture des templates
- `/docs/technical/integration-tests/` : Tests d'intégration
- `/docs/technical/performance-monitoring/` : Monitoring des performances
  
## 🚀 Fonctionnalités principales

### 1. Système de Veille
- Surveillance automatique des appels à projets et appels d'offres
- Agrégation multi-sources (CNC, régions, plateformes...)
- Système de notification personnalisé
- Analyse de pertinence intégrée
- Tests d'intégration validés

### 2. Gestion Documentaire
- Génération IA de documents basée sur l'analyse des AAP/AO
- Suggestions contextuelles intelligentes
- Templates spécialisés par type de projet
  - Interface modulaire et maintainable
  - Gestion intelligente des permissions
  - Support IA intégré
  - Tests de performance (<200ms)
- Intégration Google Drive native avec système de versions avancé
  - Gestion centralisée via VersionManager
  - Interface intuitive VersionHistory
  - Rollback sécurisé avec RollbackManager
  - Optimisation des performances de stockage
- Système de commentaires collaboratifs en temps réel via Google Chat
  - Espaces de discussion dédiés par projet
  - Gestion intégrée des membres
  - Communication native Google Workspace
  - Interface unifiée et intuitive
- Système de validation intelligent optimisé des documents
  - Validation parallélisée (150-200ms)
  - Validation temps réel des formats (DOC, DOCX, PDF, ODT)
  - Vérification automatique des métadonnées
  - Contrôle de cohérence des contenus
  - Interface de feedback immédiat
  - Préchargement intelligent
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

### Haute Disponibilité
- Load Balancing Nginx optimisé
  - Failover automatique
  - Cache intelligent
  - Répartition de charge
  - Tests de charge complets
  - Documentation détaillée

### Système de Monitoring
- Dashboard de performance en temps réel
- Suivi des métriques par composant
- Tests de charge automatisés
  - Validation simultanée (50 documents)
  - Génération AI (20 requêtes/min)
  - Mise à jour cache (100 entrées)
  - Lecture intensive (200 requêtes/min)
- Seuils d'alerte configurables
- Procédures d'urgence documentées
- Interface de monitoring visuelle
- Alertes proactives

### Load Balancing
- Configuration Nginx optimisée
  - Répartition de charge intelligente
  - Serveur de backup automatique
  - Gestion des failover
  - Cache optimisé pour les ressources statiques
  - Protection contre les surcharges
  - Healthcheck intégré

### Frontend
- Dashboard principal (React/Tailwind)
- Système de filtrage avancé
  - Filtres intelligents par type de projet
  - Score de pertinence configurable
  - Filtres budget et temporels
  - Interface intuitive et réactive
- Tests complets
  - Couverture de test Dashboard >80%
  - Tests unitaires et d'intégration
  - Mocks configurés pour les dépendances
  - Validation des interactions utilisateur
- Modules RSS & Alertes
- Interface Google Drive
- Système de suivi des équipes
- Générateur de documents IA
- Monitoring performances temps réel
  - Dashboard de métriques en temps réel
  - Graphiques de performance
  - Alertes système configurables
  - Suivi du cache par composant
- Intégration Google Chat
  - Gestion des espaces de discussion
  - Interface de gestion des membres
  - Communication temps réel native
- VersionHistory et VersionControl pour le système de versions
- DocumentValidator pour la validation intelligente
  - Interface temps réel
  - Feedback utilisateur contextuel
  - Intégration système d'audit
- Système de Templates Modulaire
  - Composants légers et spécialisés
  - Tests unitaires exhaustifs
  - Documentation maintenue à jour

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

### Composants Drive
- DeadlineManager
- DrivePermissions
- DriveSync
- ErrorHandling
- VersionStore pour le stockage optimisé
- DocumentValidator optimisé
  - Validation temps réel
  - Gestion des formats
  - Intégration audit
  - Tests automatisés
  - Préchargement intelligent

### Système de Tests
- Tests unitaires et d'intégration
  - Couverture >80% sur les composants core
  - Tests AIServiceManager (100% coverage)
  - Tests Cache System validés
  - Tests RSS-IA intégrés
  - Tests Templates validés
  - Tests Multi-formats validés
  - Tests UI/UX en cours (60%)
- Tests E2E avec Cypress
  - Environnement configuré
  - Tests complets pour RSS-IA
  - Tests complets pour TemplateManager
  - Tests complets pour intégration Drive
  - Tests complets pour système de notifications
  - Tests de performance à venir
  - Couverture actuelle : 70%
- Tests analytics et reporting
  - Tableaux de bord et métriques
  - Rapports d'analyse
  - Statistiques d'équipe
  - Gestion des erreurs
  - Couverture tests analytics : 100%
- Tests de performance
  - Validation Documents (50 docs/60s)
  - Génération IA (20 req/min)
  - Cache (100 entrées/30s)
  - Lecture (200 req/min)

### Système de Monitoring
- Métriques temps réel par composant
- Tests de charge automatisés
  - Validation simultanée (50 documents)
  - Génération AI (20 requêtes/min)
  - Mise à jour cache (100 entrées)
  - Lecture intensive (200 requêtes/min)
- Seuils d'alerte configurables
- Procédures d'urgence documentées
- Historique des performances
- Interface de monitoring visuelle
- Alertes proactives

## 📦 Installation

### Prérequis
```bash
- Node.js (v16+)
- npm ou yarn
- Compte Google Workspace
- Droits d'administration
```

### Configuration

1. Cloner le repository
```bash
git clone [URL_REPO_PRIVÉ]
cd sapav
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
# - NEXT_PUBLIC_GOOGLE_CLIENT_ID pour OAuth
# - NEXT_PUBLIC_GOOGLE_API_KEY pour Drive
# - NEXT_PUBLIC_GOOGLE_CHAT_SCOPE pour Chat
```

4. Lancer l'application
```bash
npm run dev
```

## 🔧 Guide d'utilisation

### Configuration initiale
1. Connexion avec compte Google Workspace
2. Configuration des sources de veille
3. Paramétrage des notifications
4. Personnalisation des templates
5. Configuration des espaces de discussion

### Utilisation quotidienne
1. Dashboard de suivi
2. Génération et édition des documents
3. Suivi des deadlines
4. Reporting et statistiques

## 📞 Support

### Support technique
- Email : support@sapav.com
- Documentation : /docs
- Wiki : [URL_WIKI]

### Ressources
- Guide utilisateur : /docs/user-guide
- Documentation API : /docs/api
- Tutoriels vidéo : /docs/tutorials

## 📄 Licence
Projet privé - Tous droits réservés

## 🔄 Mises à jour
Consultez le [CHANGELOG.md](./CHANGELOG.md) pour l'historique des modifications.

---
*Note: Ce README est maintenu à jour via le repository GitHub. Pour plus de détails techniques, consultez la documentation dans le dossier `/docs`.*
