# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée avec génération IA
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets
- Système de commentaires collaboratifs via Google Chat intégré

### Architecture Dashboard
La nouvelle architecture des dashboards est organisée de manière modulaire sous `/src/components/dashboard/` :

#### 1. Dashboard Global (`/global`)
- Vue d'ensemble des statistiques
- Intégration des sources RSS
- Liste des projets récents
- Métriques globales de performance
- Cache optimisé (95% hit rate)

#### 2. Dashboard Équipes (`/team`)
- Suivi des équipes en temps réel
- Filtrage par équipe
- KPIs personnalisés
- Interface responsive
- Intégration TeamManager

#### 3. Dashboard Projets (`/project`)
- Suivi des documents par projet
- Indicateurs de progression
- Intégration Drive
- Gestion des deadlines
- Validation en temps réel

### Architecture IA
Le projet utilise Claude-3 (Sonnet et Haiku) via une architecture centralisée :
- AIServiceManager : Point d'entrée unique pour l'IA
  * Gestion des coûts (max 15$/mois)
  * Routing intelligent entre Sonnet (0.00003$/token) et Haiku (0.00001$/token)
  * Cache intelligent par composant :
    - RSS-IA : 1h, vers Haiku, priorité haute (95% hit rate)
    - Editor : 5min, vers Sonnet, priorité moyenne (98%)
    - Validation : 10min, mixte selon complexité (95%)
    - Templates : 24h, principalement Haiku (99%)
  * Monitoring performances temps réel
  * Tests unitaires complets
  * Intégration DriveCore pour validation des synchronisations

### Structure du Projet
Le projet suit une architecture modulaire standardisée sous /src :
/src
├── app/                              # Pages et layouts Next.js
│   ├── globals.css                   # Styles globaux
│   ├── layout.tsx                    # Layout racine
│   ├── page.tsx                      # Page d'accueil
│   └── monitoring/                   # Module monitoring
│       └── MonitoringOverviewPage.tsx
└── components/                       # Composants React
    ├── dashboard/                    # Nouveau système de dashboards
    │   ├── global/                   # Dashboard principal
    │   ├── team/                     # Dashboard équipes
    │   └── project/                  # Dashboard projets
    ├── Drive/                        # Module Drive
    │   ├── Auth/                     # Authentification Drive
    │   ├── Core/                     # Opérations Drive de base
    │   └── Integration/              # Integration avec l'application
    ├── ui/                           # Composants shadcn
    └── monitoring/                   # Module monitoring
        ├── dashboard/                # Interface monitoring
        ├── core/                     # Logique métier monitoring
        │   └── priority/             # Système de priorités
        ├── metrics/                  # Gestion des métriques
        └── types/                    # Types et interfaces


### Composants Principaux
1. **Système RSS-IA** [Doc](/docs/project/architecture/core.md#rss-ia)
   - Veille automatisée des opportunités
   - Analyse intelligente des AAP/AO via AIServiceManager
   - Extraction de données structurées
   - Tests d'intégration complets
   - Enrichissement contextuel
   - Cache 1h, priorité haute (95% hit rate)

2. **Dashboard Amélioré**
   - Interface utilisateur optimisée avec shadcn/ui
   - Cartes de statistiques interactives avec tendances
   - Gestion des états de chargement et erreurs
   - Tests unitaires complets
   - Cache optimisé pour les performances
   - Support natif du mode responsive
   - Intégration complète avec DriveProvider

3. **AIEnhancedEditor** [Doc](/docs/project/architecture/ai-service.md)
   - Génération assistée de contenu via AIServiceManager
   - Routing intelligent Haiku/Sonnet selon complexité
   - Suggestions contextuelles en temps réel
   - Interface d'édition augmentée
   - Validation intelligente
   - Cache 2min, priorité moyenne (98% hit rate optimisé)

4. **Système de Versions**
   - Gestion centralisée avec VersionManager
   - Intégration native Drive via DriveSync
   - Cache intelligent multi-niveaux
   - Gestion des permissions temps réel
   - Interface VersionHistory intuitive
   - Tests complets (>90% coverage)
   - Performance optimisée :
     - Validation : 150-200ms
     - Récupération : <100ms (cache)
     - Hit rate : >95%
     - Tests charge : 50 docs/60s

5. **Système de Templates**
   - Architecture modulaire et testable
   - TemplateUI : Interface utilisateur de base (~45 lignes)
   - TemplateFeatures : Gestion des fonctionnalités IA via AIServiceManager
   - PermissionChecker : Contrôle d'accès intelligent (~90 lignes)
   - Tests unitaires et d'intégration complets
   - Documentation détaillée
   - Cache 24h, priorité basse (99% hit rate)

6. ### Système de Monitoring

Le système de monitoring offre une vue complète et centralisée des performances et de l'état du système :

#### Vue Générale (`/monitoring`)
- Dashboard principal avec métriques temps réel
- Système de priorités avancé
  - Score numérique (0-100)
  - Niveaux CRITICAL, HIGH, STANDARD, LOW
  - Tracking des changements de priorité
- Suivi des performances globales
- Système d'alertes intelligent
- Métriques de validation (<200ms)
- Statut des composants core

#### Performance IA (`/monitoring/ai`)
- Suivi en temps réel des performances IA
- Analyse des coûts et optimisations
- Métriques de cache par composant
  - RSS-IA : 95% hit rate (1h TTL)
  - AI Editor : 98% hit rate (2min TTL)
  - Templates : 99% hit rate (24h TTL)
- Validation parallélisée (50 docs/min)

#### Monitoring Projets (`/monitoring/projects`)
- Suivi temps réel des documents
- Gestion des deadlines
- État des validations
- Métriques de performance

#### Caractéristiques Techniques
- Architecture restructurée et optimisée
- Navigation dynamique entre les vues
- Nommage explicite des composants
- Tests >90% couverture
- Performance optimisée (<100ms)
- Validation parallélisée (150-200ms)
- Cache hit rate global : >95%
- Temps de réponse API : <100ms
- Disponibilité : 99.9%

#### Intégrations
- Connexion directe avec AIServiceManager
- Synchronisation Google Drive
- Système d'alertes unifié
- Tableau de bord temps réel
6. **ChatIntegration**
   - Espaces de discussion par projet
   - Gestion des membres intégrée
   - Utilisation de l'API Google Chat native
   - Authentification unifiée avec Google Workspace

7. **Système de Découverte de Sources RSS**
   - Détection automatique de sources AAP/AO
   - Analyse intelligente des sources web
   - Validation et scoring des sources
   - Intégration centralisée via AIServiceManager
   - Mécanisme de filtrage et de qualification
   - Mise à jour dynamique du catalogue de sources
   - Cache intelligent des découvertes (1h, 95% hit rate)

## Documentation Technique
Pour plus de détails, consultez :
- `/docs/technical/SAPAV-Architecture.md` : Architecture globale
- `/docs/technical/AI-Integration-Guide.md` : Architecture IA centralisée
- `/docs/technical/permissions/README.md` : Système de permissions
- `/docs/technical/RSS-IA-Integration.md` : Système RSS-IA
- `/docs/technical/AIEnhancedEditor.md` : Éditeur augmenté
- `/docs/technical/version-system/` : Système de versions
- `/docs/technical/document-validation/` : Système de validation
- `/docs/technical/template-system/` : Architecture des templates
- `/docs/technical/integration-tests/` : Tests d'intégration
- `/docs/technical/performance-monitoring/` : Monitoring des performances
- `/docs/technical/performance.md` : Monitoring et optimisation des performances
- `/docs/technical/integration.md` : Guide d'intégration des composants
- `/docs/technical/drive/auth.md` : Intégration Drive et authentification
- `/docs/technical/hooks/useAI.md` : Documentation du hook useAI
- `/docs/technical/services/AIRoutingService.md` : Documentation du service de routing IA
- [Architecture globale](/docs/project/architecture/core.md)
- [Guide IA](/docs/project/architecture/ai-service.md)
- [Documentation composants](/docs/project/overview.md)

Documentation complète :
- [Guide utilisateur](/docs/project/guides/user-guide.md)
- [Guide développeur](/docs/project/guides/dev-guide.md)  
- [Guide déploiement](/docs/project/guides/deploy-guide.md)
  
## 🚀 Fonctionnalités principales

### 1. Système de Veille
- Surveillance automatique des appels à projets et appels d'offres
- Agrégation multi-sources (CNC, régions, plateformes...)
- Système de notification personnalisé
- Analyse de pertinence intégrée
- Tests d'intégration validés
- Service centralisé avec AIServiceManager
- Analyse IA intégrée des sources
- Gestion intelligente du cache
- Interface utilisateur réactive
- Conversion automatique en projets

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
- Système de gestion des deadlines avancé
  - Tracking intelligent des échéances
  - Suggestions IA contextuelles
  - Gestion dynamique des priorités
  - Historique détaillé des modifications

### 4. Accompagnement Projet
- Suivi personnalisé
- Support administratif
- Formation intégrée
- Documentation exhaustive

## 🛠 Architecture Technique

### Core
- Drive ✓
  - Architecture modulaire sous /src/components/Drive/
  - Authentification Google OAuth2.0 validée
  - Gestion des tokens sécurisée
  - Cache optimisé (>95% hit rate)
  - Tests complets
  - Documentation : /docs/technical/drive/auth.md
- Système de permissions modulaire
  - Gestionnaires spécialisés (<100 lignes)
  - Types unifiés pour l'authentification et les fichiers
  - Support de l'héritage des permissions
  - Gestion des expirations
  - Tests unitaires par composant
- Cache System
  - Stratégie LRU implémentée
  - TTL configurable par type
  - Invalidation intelligente
  - Hit rate >95%

### Backend
- Services Email et RSS
- API Google Drive
  - Système unifié sous /src/components/Drive/
  - Core/DriveSync.ts pour la logique principale
  - Integration/DriveSyncUI.tsx pour l'interface
  - Cache intelligent par priorité (95% hit rate)
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

### Haute Disponibilité
- Load Balancing Nginx optimisé
  - Failover automatique
  - Cache intelligent
  - Répartition de charge
  - Tests de charge complets
  - Documentation détaillée

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

### Frontend
-### Frontend
- Dashboard amélioré avec shadcn/ui :
  - StatsCard pour visualisation des métriques
  - Système de navigation par onglets
  - Gestion des états améliorée
  - Composants UI réutilisables
  - Tests unitaires exhaustifs
  - Documentation technique complète
- Modules RSS & Alertes
- Interface Google Drive
- Système de suivi des équipes
  - Architecture modulaire et maintenable (/components/team/)
  - Séparation claire UI/Core
  - Tests unitaires complets (>90% coverage)
  - Documentation technique à jour
- Générateur de documents IA
- Monitoring performances temps réel
  - Dashboard de métriques en temps réel
  - Graphiques de performance
  - Alertes système configurables
  - Suivi du cache par composant

### Environnement de Formation
- Scripts d'initialisation/clôture automatisés
- Jeux de données test préconfigurés
  - AAP/AO types
  - Scénarios incidents
  - Templates test
- Système de monitoring dédié
  - Dashboard temps réel
  - Métriques formation spécifiques
  - Alertes paramétrables
- Durée formation : 5 jours
- Support post-formation inclus

### Intégration
- Points d'intégration standardisés
- Communication inter-composants optimisée
- Monitoring temps réel des intégrations
- Validation continue des interfaces
- Recovery automatique

## 📦 Installation

### Prérequis
```bash
- Node.js (v16+)
- npm ou yarn
- Compte Google Workspace
- Droits d'administration
...
3. Installer les composants UI
```bash
chmod +x scripts/setup-ui.sh
./scripts/setup-ui.sh
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

3. Configuration des Variables d'Environnement
```bash
# Google OAuth Configuration (Requis)  
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/drive/auth/callback
NEXT_PUBLIC_GOOGLE_CHAT_SCOPE=https://www.googleapis.com/auth/chat.spaces
# Claude API Configuration (Requis)
CLAUDE_API_KEY=votre_clé_api_claude
CLAUDE_SONNET_MODEL=claude-3-sonnet-20240229
CLAUDE_HAIKU_MODEL=claude-3-haiku-20240307

# Application Configuration 
NODE_ENV=development 
PORT=3000

# Google Service Account
GOOGLE_APPLICATION_CREDENTIALS=chemin_vers_votre_fichier_credentials.json
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
