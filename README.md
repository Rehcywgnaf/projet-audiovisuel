# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée avec génération IA
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets
- Système de commentaires collaboratifs via Google Chat intégré

### Architecture IA
Le projet utilise Claude-3 Sonnet d'Anthropic via une architecture centralisée :
- AIServiceManager : Point d'entrée unique pour l'IA
- Budget optimisé (max 15$/mois)
- Cache intelligent par composant avec monitoring des performances
- Monitoring en temps réel des coûts et des performances
- Système de préchargement intelligent

### Composants Principaux
1. **Système RSS-IA** [Doc](/docs/project/architecture/core.md#rss-ia)
   - Veille automatisée des opportunités
   - Analyse intelligente des AAP/AO via AIServiceManager
   - Extraction de données structurées
   - Tests d'intégration complets
   - Enrichissement contextuel
   - Cache 1h, priorité haute (95% hit rate)

2. **AIEnhancedEditor** [Doc](/docs/project/architecture/ai-service.md)
   - Génération assistée de contenu via AIServiceManager
   - Suggestions contextuelles en temps réel
   - Interface d'édition augmentée
   - Validation intelligente
   - Cache 2min, priorité moyenne (98% hit rate optimisé)

3. **Système de Versions**
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

4. **Système de Templates**
   - Architecture modulaire et testable
   - TemplateUI : Interface utilisateur de base (~45 lignes)
   - TemplateFeatures : Gestion des fonctionnalités IA via AIServiceManager
   - PermissionChecker : Contrôle d'accès intelligent (~90 lignes)
   - Tests unitaires et d'intégration complets
   - Documentation détaillée
   - Cache 24h, priorité basse (99% hit rate)

5. **Système de Monitoring**
   - Dashboard de performance temps réel
     * État des files d'attente par priorité
     * Seuils d'alerte configurables
     * Visualisations graphiques
   - Gestion des Alertes
     * Alertes de taille de file
     * Alertes de temps d'attente
     * Notifications temps réel
   - Historique des Erreurs
     * Suivi des reprises
     * Tentatives de récupération
     * Analyse des patterns d'erreur
   - Monitoring Proactif
     * Détection précoce des problèmes
     * Backoff exponentiel intégré
     * Métriques de performance
   - Documentation Complète
     * Guide utilisateur détaillé
     * Procédures d'urgence
     * Best practices
   - Cache optimisé pour les performances
     * Hit rate >95% sur les métriques
     * Rafraîchissement configurable
     * Historique de 7 jours

6. **ChatIntegration**
   - Espaces de discussion par projet
   - Gestion des membres intégrée
   - Utilisation de l'API Google Chat native
   - Authentification unifiée avec Google Workspace

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
- Dashboard principal (React/Tailwind)
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
