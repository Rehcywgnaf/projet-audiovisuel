# SAPAV (Soutien Appel à Projet AudioVisuel)

## Description du Projet
SAPAV est une plateforme intégrée dédiée au soutien et à l'accompagnement des projets audiovisuels. Elle combine veille active, gestion documentaire et suivi des candidatures pour optimiser la recherche de financements.

## État du Projet
- **État actuel**: Sprint 2 - Documents & Drive
- **Prochaine étape**: Sprint 3 - Intégration (Février 2024)
- **Version**: Beta 0.2

## Architecture Technique

### Composants Principaux
1. **Frontend**
   - Dashboard Principal (`/components/Dashboard`)
   - Système de Veille (`/components/RSS`)
   - Intégration Google Drive (`/components/Drive`)
   - Suivi des Équipes (`/components/TeamTracking`)
   - Liste des Projets (`/components/Projects`)

2. **Services**
   - emailService (`/services/email`)
   - rssService (`/services/rss`)
   - driveService (`/services/drive`)

3. **Modules Drive**
   - DeadlineManager (`/components/Drive/Deadline`)
   - DrivePermissions (`/components/Drive/Permissions`)
   - DriveSync (`/components/Drive/Sync`)
   - ErrorHandling (`/components/Drive/Error`)

## Installation

```bash
npm install
npm run dev
```

### Prérequis
- Node.js >= 18.0.0
- Google Workspace API credentials
- RSS Feed API key

## Configuration

1. Créer un fichier `.env` basé sur `.env.example`
2. Configurer les variables d'environnement :
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   RSS_API_KEY=your_api_key
   ```

## Structure des Composants

### TeamTracking
- Gestion des équipes et disponibilités
- Interface de suivi des projets
- Statut: Fonctionnel

### RSS & Alertes
- Agrégation des flux RSS
- Système de notification
- Statut: En production

### Drive Integration
- Synchronisation Google Drive
- Gestion des permissions
- Statut: En test

## Roadmap

### Sprint 1 (Complété)
- [x] Packages optimisés
- [x] Économies durée
- [x] Alertes disponibilité

### Sprint 2 (En cours)
- [ ] Templates documents
- [ ] Système versioning
- [ ] Gestion deadlines

### Sprint 3 & 4 (À venir)
- [ ] Intégration modules
- [ ] Tests système
- [ ] Déploiement beta

## Contribution
- Suivre les conventions de code
- Créer une branche par feature
- Tests requis pour toute PR

## Documentation
- [Guide Utilisateur](docs/user-guide.md)
- [Documentation API](docs/api.md)
- [Guide Déploiement](docs/deployment.md)

## Contact
Support Technique : support@sapav.com
Équipe Dev : dev@sapav.com

## License
Propriétaire - Tous droits réservés

---
*Dernière mise à jour: Janvier 2024*