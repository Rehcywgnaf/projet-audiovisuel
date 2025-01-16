# Architecture IA SAPAV

## Vue d'ensemble

L'intelligence artificielle dans SAPAV est gérée de manière centralisée par l'AIServiceManager, qui sert de point d'entrée unique pour toutes les interactions avec l'API Claude d'Anthropic.

## Composants et Interactions

### Points d'entrée
1. RSS-IA
   - Analyse des appels à projets
   - Priorité : Haute
   - Cache : 1 heure
   - Usage : Analyse ponctuelle

2. AIEnhancedEditor
   - Suggestions en temps réel
   - Priorité : Moyenne
   - Cache : 5 minutes
   - Usage : Continu pendant l'édition

3. TemplateManager
   - Sélection et adaptation des templates
   - Priorité : Basse
   - Cache : 24 heures
   - Usage : Ponctuel à l'initialisation

4. DocumentValidator
   - Validation des documents
   - Priorité : Moyenne
   - Cache : 10 minutes
   - Usage : Validation finale

### AIServiceManager

#### Responsabilités
- Point d'entrée unique vers l'API Claude
- Gestion du budget (max 15$, alerte à 10$)
- Optimisation des requêtes
- Cache intelligent par composant
- Monitoring des coûts et usage

#### Optimisations
1. Cache par composant
   - Adapté aux besoins spécifiques
   - TTL configurable
   - Invalidation intelligente

2. Budget et Coûts
   - Tracking par composant
   - Alertes configurables
   - Limites par type d'utilisation

3. Requêtes
   - Batching quand possible
   - Paramètres optimisés par usage
   - Gestion des priorités

## Workflow type

1. Demande d'un composant
   - Vérification du cache
   - Estimation du coût
   - Check du budget disponible

2. Traitement
   - Optimisation de la requête
   - Appel API si nécessaire
   - Mise en cache du résultat

3. Retour
   - Réponse au composant
   - Mise à jour des statistiques
   - Alertes si nécessaire

## Monitoring

### Par composant
- Utilisation (tokens/coût)
- Taux de cache hit/miss
- Temps de réponse moyen

### Global
- Budget restant
- Alertes actives
- Statistiques d'utilisation

## Points d'attention

### Performance
- Utiliser le cache de manière agressive
- Optimiser la taille des requêtes
- Batching quand possible

### Coûts
- Monitorer l'utilisation par composant
- Alertes précoces (5$, 8$, 10$)
- Limite dure à 15$

### Évolutivité
- Architecture extensible
- Paramètres configurables
- Documentation à jour