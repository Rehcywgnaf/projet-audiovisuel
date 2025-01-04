# Checklist de Validation des Modifications SAPAV

## 1. Pré-modification
- [ ] Vérifier l'état actuel des composants concernés
- [ ] Identifier les dépendances impactées
- [ ] Consulter la dernière version du CHANGELOG
- [ ] Examiner les points d'intégration concernés

## 2. Documentation
- [ ] Récupérer l'historique complet du CHANGELOG
- [ ] Mettre à jour le CHANGELOG sans perte d'historique
- [ ] Vérifier que le README global est toujours pertinent et complet
- [ ] Mettre à jour la documentation technique du composant
- [ ] Actualiser la documentation des interfaces
- [ ] Mettre à jour le guide utilisateur si nécessaire

## 3. Développement
- [ ] Implémenter les modifications nécessaires
- [ ] Ajouter/mettre à jour les tests unitaires
- [ ] Vérifier la couverture de tests
- [ ] Valider les interfaces avec les composants existants
- [ ] Documenter les nouvelles interfaces ou modifications

## 4. Tests
- [ ] Exécuter les tests unitaires
- [ ] Réaliser les tests d'intégration
- [ ] Effectuer les tests de régression
- [ ] Valider les performances
- [ ] Vérifier la compatibilité avec les composants existants

## 5. Versioning
- [ ] Mettre à jour la version du composant
- [ ] Documenter les changements de dépendances
- [ ] Vérifier la compatibilité des versions
- [ ] Mettre à jour le CHANGELOG avec les détails des versions

## 6. Push et Déploiement
- [ ] Push des modifications
- [ ] En cas d'erreur 32603 :
  - [ ] Vérifier la présence des fichiers dans le repo
  - [ ] Vérifier l'intégrité des fichiers poussés
  - [ ] Documenter toute anomalie constatée
- [ ] Valider les procédures de déploiement
- [ ] Vérifier les procédures de rollback

## 7. Post-déploiement
- [ ] Vérifier le fonctionnement en environnement cible
- [ ] Valider les intégrations en production
- [ ] Mettre à jour la documentation de déploiement si nécessaire
- [ ] Archiver les logs et rapports de déploiement

## 8. Communication
- [ ] Informer l'équipe des changements effectués
- [ ] Partager les mises à jour de documentation
- [ ] Signaler les points d'attention particuliers
- [ ] Documenter les retours d'expérience

## Notes importantes
- Cette checklist doit être utilisée pour CHAQUE modification
- Tous les points doivent être validés avant de considérer une modification comme terminée
- En cas de doute sur un point, toujours demander une revue
- Conserver un historique des checklists complétées pour traçabilité