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

[Le reste du README existant reste inchangé...]