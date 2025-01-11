# Gestion du Changelog

## Structure
- `/versions` : Un fichier par version du projet
- `/archive` : Archive de l'ancien format de changelog

## Utilisation
1. Créer un nouveau fichier dans `/versions` pour chaque nouvelle version
2. Nommer le fichier selon le format : `X.Y.Z.md`
3. Utiliser le script `build-changelog.js` pour générer le CHANGELOG.md complet

## Format des fichiers de version
```markdown
## [X.Y.Z] - YYYY-MM-DD
### Added
- Nouvelle fonctionnalité A
- Nouvelle fonctionnalité B

### Changed
- Modification A
- Modification B

### Fixed
- Correction A
- Correction B
```