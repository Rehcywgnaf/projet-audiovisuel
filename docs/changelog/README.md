# Structure des Changelogs SAPAV

Ce dossier contient les changelogs détaillés par composant du projet SAPAV.

## Organisation

```
changelog/
├── README.md                   # Ce fichier
├── components/                 # Changelogs par composant
│   ├── auth.md                # Authentification et Permissions
│   ├── drive.md               # Intégration Google Drive
│   ├── templates.md           # Gestion des Templates
│   └── ui.md                  # Composants d'interface
└── SUMMARY.md                 # Vue d'ensemble des modifications
```

## Mise à jour des Changelogs

1. Pour chaque modification :
   - Mettre à jour le changelog du composant concerné
   - Ajouter l'entrée dans le CHANGELOG.md global
   - Mettre à jour le SUMMARY.md si nécessaire

2. Format standard :
```markdown
## [Version] - Date
### Added
- Nouvelles fonctionnalités

### Changed
- Modifications de l'existant

### Fixed
- Corrections de bugs

### Technical
- Modifications techniques
```

3. Points importants :
   - Toujours préserver l'historique existant
   - Ne jamais utiliser de placeholders
   - Maintenir la cohérence entre les changelogs

## Liens
- [CHANGELOG.md](../../CHANGELOG.md) : Changelog global du projet
- [Documentation Technique](/docs/technical/) : Documentation technique détaillée