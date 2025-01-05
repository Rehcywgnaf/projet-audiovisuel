# SAPAV (Soutien Appel à Projet AudioVisuel)

## 📋 Vue d'ensemble

SAPAV est une plateforme innovante dédiée au soutien et à l'accompagnement des projets audiovisuels dans leur recherche de financements. La solution intègre :
- Veille automatisée des opportunités de financement
- Gestion documentaire avancée
- Suivi intelligent des candidatures
- Accompagnement personnalisé des projets

## 🚀 Fonctionnalités principales

### 1. Système de Veille
- Surveillance automatique des appels à projets et appels d'offres
- Agrégation multi-sources (CNC, régions, plateformes...)
- Système de notification personnalisé
- Analyse de pertinence intégrée

### 2. Gestion Documentaire
- Intégration Google Drive native avec versioning intelligent
- Templates intelligents par type de projet (Documentaire, Fiction, Web-série)
- Analyse contextuelle des appels (AAP/AO)
- Suggestions basées sur l'historique et le profil entreprise
- Validation automatisée des documents
- Gestion avancée des deadlines avec alertes intelligentes

### 3. Suivi des Candidatures
- Dashboard temps réel
- Monitoring des deadlines
- Alertes automatiques
- Statistiques et reporting

### 4. Accompagnement Projet
- Suivi personnalisé
- Support administratif
- Formation intégrée
- Documentation exhaustive

## 🛠 Architecture Technique

### Frontend
- Dashboard principal (React/Tailwind)
- Modules RSS & Alertes
- Interface Google Drive
- Système de suivi des équipes

### Backend
- Services Email et RSS
- API Google Drive
- Système de notification
- Gestion des authentifications

### Composants Drive
- DeadlineManager avec intégration IA
- DrivePermissions
- DriveSync optimisé
- ErrorHandling avancé
- TemplateManager avec analyse contextuelle
- Cache system pour optimisation

## 📦 Installation

### Prérequis
```bash
- Node.js (v16+)
- npm ou yarn
- Compte Google Workspace
- Droits d'administration
```

### Configuration
1. Cloner le repository
```bash
git clone [URL_REPO_PRIVÉ]
cd sapav
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

4. Lancer l'application
```bash
npm run dev
```

## 🔧 Guide d'utilisation

### Configuration initiale
1. Connexion avec compte Google Workspace
2. Configuration des sources de veille
3. Paramétrage des notifications
4. Personnalisation des templates

### Utilisation quotidienne
1. Dashboard de suivi
2. Gestion des documents
3. Suivi des deadlines
4. Reporting et statistiques

## 🤝 Contribution

### Pour les développeurs
1. Fork du projet
2. Création de branche
```bash
git checkout -b feature/nouvelle-fonctionnalite
```
3. Commit et push
4. Création de Pull Request

### Points d'attention
- Vérification après chaque push
- Maintien de la cohérence documentaire
- Respect des standards de code
- Tests unitaires obligatoires

## 📞 Support

### Support technique
- Email : support@sapav.com
- Documentation : /docs
- Wiki : [URL_WIKI]

### Ressources
- Guide utilisateur : /docs/user-guide
- Documentation API : /docs/api
- Tutoriels vidéo : /docs/tutorials

## 📄 Licence

Projet privé - Tous droits réservés

## 🔄 Mises à jour

Consultez le [CHANGELOG.md](./CHANGELOG.md) pour l'historique des modifications.

---
*Note: Ce README est maintenu à jour via le repository GitHub. Pour plus de détails techniques, consultez la documentation dans le dossier `/docs`.*