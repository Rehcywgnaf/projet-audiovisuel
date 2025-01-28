# Guide d'Intégration - Auth Service

## Intégration avec DriveCore

### Configuration
```typescript
import { AuthService } from '../../../services/auth/AuthService';
import { PermissionService } from '../../../services/auth/PermissionService';

class DriveCore {
  private authService: AuthService;
  private permissionService: PermissionService;

  constructor() {
    this.authService = AuthService.getInstance();
    this.permissionService = new PermissionService();
  }
}
```

### Initialisation Drive
```typescript
private async initializeDrive(): Promise<void> {
  const token = await this.authService.authenticate();
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  
  this.drive = google.drive({ version: 'v3', auth });
}
```

### Vérification des Permissions
```typescript
private async checkPermission(
  fileId: string,
  operation: 'read' | 'write' | 'delete'
): Promise<void> {
  const hasPermission = await this.permissionService
    .checkPermission(fileId, operation);

  if (!hasPermission) {
    throw new Error(`Permission denied: ${operation} on ${fileId}`);
  }
}
```

## Points d'Attention

### Performance
- Utiliser le cache des permissions
- Initialisation paresseuse du drive
- Validation parallèle si possible

### Sécurité
- Toujours vérifier les permissions
- Ne pas stocker les tokens
- Utiliser les erreurs standardisées

### Tests
- Mocker AuthService dans les tests
- Valider les cas d'erreur
- Tester les timeouts

## Exemples d'Intégration

### Lecture de Fichier
```typescript
async readFile(fileId: string): Promise<DriveResponse> {
  await this.ensureDriveInitialized();
  await this.checkPermission(fileId, 'read');

  const cached = await this.cacheManager.getFile(fileId);
  if (cached) return cached;

  const response = await this.drive.files.get({
    fileId,
    alt: 'media'
  });

  await this.cacheManager.setFile(fileId, response.data);
  return response.data;
}
```

### Mise à Jour de Fichier
```typescript
async updateFile(fileId: string, content: any): Promise<void> {
  await this.ensureDriveInitialized();
  await this.checkPermission(fileId, 'write');

  await this.drive.files.update({
    fileId,
    media: { body: content }
  });

  await this.cacheManager.invalidateFile(fileId);
}
```