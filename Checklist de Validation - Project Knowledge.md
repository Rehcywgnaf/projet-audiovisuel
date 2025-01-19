# Checklist de Validation - SAPAV

## Rappels Importants
- Utiliser systématiquement pour CHAQUE modification
- Aucun point ne doit être ignoré
- En cas de doute : demander une revue
- Garder une traçabilité des vérifications

## Process de Validation

### 1. Avant Modification
☐ État actuel des composants impactés
☐ Identification des dépendances
☐ Historique du CHANGELOG
☐ Configurations et intégrations existantes

### 2. Documentation
☐ CHANGELOG : récupération historique COMPLET
☐ CHANGELOG : ajout sans perte d'information
☐ README : cohérence globale préservée
☐ Documentation technique mise à jour
☐ Guides utilisateurs actualisés

### 3. Développement
☐ Tests unitaires ajoutés/mis à jour
☐ Interfaces validées
☐ Documentation du code complétée
☐ Points d'intégration vérifiés
☐ Tests de performance de base configurés
☐ Métriques de monitoring intégrées
☐ Seuils d'alerte définis

### 4. Push & Contrôle
☐ Push des modifications
En cas d'erreur 32603 :
  ☐ Vérifier présence fichiers
  ☐ Contrôler intégrité
  ☐ Noter anomalies
☐ Tests de déploiement
☐ Procédures rollback validées
☐ Vérification des métriques de performance
☐ Validation des seuils d'alerte
☐ Test du dashboard de monitoring

### 5. Communication
☐ Information équipe
☐ Documentation partagée
☐ Points d'attention signalés

### 6. Monitoring & Performance
☐ Dashboard de monitoring actif
☐ Métriques principales visibles
☐ Alertes configurées
☐ Documentation des seuils
☐ Procédures d'intervention documentées

### Points Particuliers
- Ne JAMAIS utiliser de placeholder style "[contenu précédent...]"
- Toujours vérifier l'intégration après une erreur 32603
- Conserver la cohérence entre tous les documents
- Privilégier les explications claires (pas de connaissance dev requise)

## ⚠️ Signaux d'Alerte
- Perte d'historique dans le CHANGELOG
- Placeholder dans la documentation
- Erreur 32603 non vérifiée
- Documentation incohérente avec le code
- README incomplet ou écrasé