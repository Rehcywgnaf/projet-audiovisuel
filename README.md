# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée avec génération IA
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets
- Système de commentaires collaboratifs via Google Chat intégré

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

[Le reste du contenu original du README]