# Architecture SAPAV

[Section précédente inchangée jusqu'à la partie API...]

## API Layer

### Routes Drive
- `/api/drive/operation` : Opérations CRUD Drive (POST)
- `/api/drive/sync` : Synchronisation (POST)
- `/api/drive/metrics` : Métriques et état (GET)

### Client/Serveur
- Côté serveur : DriveCore, DriveSync
- Côté client : driveClient, composants UI
- Communication via API REST

[Reste du document inchangé]