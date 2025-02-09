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

[Suite du README existant...]