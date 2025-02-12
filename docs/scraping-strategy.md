# Stratégie d'Intégration de Scraping pour SAPAV

## Contexte
Projet de scraping pour la plateforme marches-publics.gouv.fr, basé sur le projet original `scraper-place` de michelbl.

## Objectifs
1. Récupérer automatiquement les Dossiers de Consultation des Entreprises (DCE)
2. Extraire et structurer les métadonnées des appels d'offres
3. Intégrer la solution dans l'architecture existante de SAPAV

## Contraintes Techniques
- Site utilise PHP framework PRADO
- Navigation basée sur `PRADO_PAGESTATE`
- Requiert 3 requêtes successives par consultation
- Pagination limitée à 20 éléments

## Architecture Proposée

### Composants
1. **ScraperService**
   - Gestion des requêtes spécifiques
   - Extraction des données
   - Normalisation des métadonnées

2. **StorageService**
   - Sauvegarde des documents
   - Gestion des métadonnées
   - Interface avec base de données

3. **NotificationService**
   - Alertes sur nouveaux appels d'offres
   - Suivi des modifications

### Technologies
- TypeScript/React
- Axios pour requêtes HTTP
- Puppeteer/Playwright pour navigation dynamique
- MongoDB/Firebase pour stockage

## Étapes d'Implémentation

### Phase 1 : Exploration et Prototype
- [ ] Analyser la structure du site
- [ ] Comprendre le mécanisme `PRADO_PAGESTATE`
- [ ] Créer un prototype de scraping minimal

### Phase 2 : Développement du ScraperService
- [ ] Implémenter mécanisme de requêtes multi-étapes
- [ ] Gérer l'authentification/session
- [ ] Extraire les métadonnées des DCE

### Phase 3 : Intégration
- [ ] Connecter au service de veille existant
- [ ] Implémenter système de stockage
- [ ] Ajouter filtres et critères de sélection

### Phase 4 : Tests et Optimisation
- [ ] Tests unitaires
- [ ] Gestion des erreurs
- [ ] Optimisation des performances
- [ ] Mise en place du système de cache

## Contraintes Légales
- Respecter les droits d'accès aux DCE
- Se conformer à la [fiche CADA](http://www.cada.fr/marches-publics,6085.html)
- Minimiser l'impact sur les systèmes sources

## Risques et Atténuations
1. Blocage par le site web
   - Utiliser des techniques de scraping respectueuses
   - Limiter la fréquence des requêtes
   - Implémenter des mécanismes de contournement

2. Changements de structure du site
   - Code modulaire
   - Maintenance proactive
   - Système de détection des changements

## Ressources Nécessaires
- Bibliothèques
  * Axios
  * Puppeteer/Playwright
  * Cheerio
- Outils
  * MongoDB/Firebase
  * Système de logging
  * Gestion des erreurs

## Prochaines Étapes Immédiates
1. Créer une branche dédiée `feature/marches-publics-scraper`
2. Mettre en place l'environnement de développement
3. Développer le prototype initial
4. Revue et validation

## Documentation Complémentaire
- Référence originale : [scraper-place GitHub](https://github.com/michelbl/scraper-place)
- Documentation PLACE
- Ressources juridiques sur les marchés publics

---

*Document dynamique, à mettre à jour régulièrement en fonction de l'avancement du projet.*