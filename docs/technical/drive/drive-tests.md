# Tests Drive SAPAV

## Structure des Tests

### Tests Unitaires

#### DriveConfig Tests
```typescript
describe('DriveConfig', () => {
  // Initialisation
  test('initialize with valid credentials')
  test('initialize with invalid credentials')
  test('singleton pattern validation')

  // Authentification
  test('authentication flow')
  test('token refresh')
  test('error handling')

  // API Access
  test('drive API initialization')
  test('permission validation')
})
```

#### TokenStorage Tests
```typescript
describe('TokenStorage', () => {
  // Encryption
  test('token encryption')
  test('token decryption')
  test('invalid encryption key')

  // Storage
  test('store and retrieve token')
  test('handle storage errors')
  test('clear tokens')

  // Validation
  test('token expiration check')
  test('token integrity check')
})
```

### Tests d'Intégration

#### Flux Complets
- Authentification complète
- Refresh de token
- Gestion des erreurs
- Récupération après erreur

#### Scénarios de Performance
- Charge normale
- Surcharge
- Timeouts
- Récupération

## Configuration des Tests

### Environnement
```typescript
// setup.ts
import { DriveConfig } from '../config/driveConfig';
import { TokenStorage } from '../config/tokenStorage';

beforeEach(() => {
  // Reset singletons
  DriveConfig.reset();
  TokenStorage.clearAll();
  
  // Mock external services
  jest.mock('googleapis');
});
```

### Mocks

#### Google Drive Mock
```typescript
// mocks/googleDrive.ts
export const mockGoogleDrive = {
  auth: {
    OAuth2: jest.fn().mockImplementation(() => ({
      generateAuthUrl: jest.fn(),
      getToken: jest.fn(),
      setCredentials: jest.fn()
    }))
  },
  drive: jest.fn()
};
```

### Helpers

#### Test Utilities
```typescript
// utils/testHelpers.ts
export const generateTestToken = () => ({
  access_token: 'test_access_token',
  refresh_token: 'test_refresh_token',
  expiry_date: Date.now() + 3600000
});
```

## Scénarios de Test

### 1. Initialisation
- Vérification des credentials
- Configuration de l'environnement
- Gestion des erreurs d'initialisation

### 2. Authentification
- Flux OAuth complet
- Gestion des erreurs d'auth
- Refresh automatique
- Révocation de tokens

### 3. Stockage
- Encryption/Decryption
- Persistance
- Nettoyage
- Récupération d'erreurs

## Process de Validation

### Avant le Push
1. Exécuter la suite complète
2. Vérifier la couverture
3. Valider les scénarios critiques
4. Tester les cas limites

### Maintenance
- Mise à jour des mocks
- Ajout de nouveaux cas
- Documentation des changements
- Validation de la couverture