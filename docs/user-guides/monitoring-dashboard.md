# Guide Utilisateur - Dashboard de Monitoring SAPAV

## Vue d'ensemble
Le dashboard de monitoring SAPAV vous permet de suivre en temps réel l'état des files d'attente, les alertes et l'historique des erreurs du système. Il est divisé en trois sections principales.

## 1. État des Files d'Attente

### Visualisation des Files
- **Files Haute Priorité** : Appels à projets et offres urgents
- **Files Standard** : Opérations normales
- **Files Basse Priorité** : Tâches non critiques

### Indicateurs Visuels
- 🟢 Vert : File d'attente normale
- 🔴 Rouge : Seuil dépassé
- ⚠️ Triangle d'alerte : Attention requise

### Graphique des Tendances
Le graphique à barres montre la répartition actuelle des tâches :
- Axe X : Types de priorité
- Axe Y : Nombre de tâches
- Mise à jour automatique toutes les 30 secondes

## 2. Alertes Actives

### Types d'Alertes
- **Alerte Taille** : Une file d'attente dépasse sa capacité recommandée
- **Alerte Temps** : Des tâches attendent depuis trop longtemps
- **Alerte Système** : Problèmes techniques nécessitant attention

### Code Couleur
- 🔴 Rouge : Alertes critiques (dépassement important)
- 🟡 Jaune : Avertissements (proche des seuils)
- 🟢 Vert : "Aucune alerte active"

### Actions Recommandées
1. **Alerte Taille**
   - Vérifier les ressources disponibles
   - Envisager l'augmentation temporaire de capacité
   - Contacter l'équipe technique si persistant

2. **Alerte Temps**
   - Examiner les tâches bloquées
   - Vérifier les dépendances
   - Escalader si nécessaire

## 3. Historique des Reprises

### Informations Affichées
- ID de la tâche
- Type d'erreur
- Nombre de tentatives
- Statut actuel
- Horodatage

### États Possibles
- **Reprise** : Nouvelle tentative en cours
- **Erreur Fatale** : Échec définitif
- **Résolu** : Problème corrigé

### Filtrage et Recherche
- Tri par date
- Filtrage par type d'erreur
- Recherche par ID de tâche

## Bonnes Pratiques

### Surveillance Quotidienne
1. Vérifier régulièrement l'état des files
2. Examiner toute alerte rouge immédiatement
3. Suivre l'évolution des tendances

### Gestion des Alertes
1. Ne pas ignorer les alertes répétitives
2. Documenter les actions prises
3. Suivre jusqu'à résolution

### Analyse des Erreurs
1. Noter les patterns récurrents
2. Remonter les problèmes systémiques
3. Vérifier l'efficacité des reprises

## FAQ

**Q: À quelle fréquence les données sont-elles mises à jour ?**
R: Les données sont actualisées en temps réel, avec un rafraîchissement visuel toutes les 30 secondes.

**Q: Que faire en cas d'alerte rouge persistante ?**
R: Contacter immédiatement l'équipe technique et documenter les circonstances.

**Q: Comment interpréter le graphique des tendances ?**
R: Les barres montrent la charge actuelle par niveau de priorité. Une tendance à la hausse indique une accumulation de tâches.

## Support

### Contacts
- Support technique : support@sapav.com
- Équipe monitoring : monitoring@sapav.com
- Urgences : +33 1 23 45 67 89

### Ressources
- Documentation technique complète : /docs/technical/monitoring
- Procédures d'urgence : /docs/emergency
- Guide dépannage : /docs/troubleshooting

---

*Note : Cette documentation est mise à jour régulièrement. Dernière mise à jour : 19/01/2025*