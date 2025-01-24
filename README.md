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

[Suite du contenu actuel du README sans modification...]