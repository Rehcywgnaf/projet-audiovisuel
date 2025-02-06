# Guide d'Intégration - Drive Authentication

## Intégration avec Next.js API Routes

### Route de Vérification du Statut
```typescript
import { DriveConfig } from '@/core/drive/DriveConfig';

export async function GET() {
  try {
    const token = await TokenStorage.getStoredToken();
    const isAuthenticated = token !== null && !TokenStorage.isTokenExpired(token);

    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Error checking auth status'
      },
      { status: 500 }
    );
  }
}
```

### Route d'Authentification
```typescript
export async function POST(request: Request) {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret) {
      console.error('Variables d\'environnement manquantes');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: 'Auth code required' },
        { status: 400 }
      );
    }

    const driveConfig = DriveConfig.getInstance();
    await driveConfig.initialize({ clientId, clientSecret, redirectUri });
    await driveConfig.authenticate(code);
    
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      },
      { status: 500 }
    );
  }
}
```

## Intégration avec les Composants React

### DriveAuthPage
```typescript
export default function DriveAuthPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const response = await fetch('/api/drive/operation/logout', {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Erreur lors de la déconnexion');
        setIsAuthenticated(false);
      } else {
        const response = await fetch('/api/drive/operation/auth-url');
        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'URL');
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification du code d'auth au chargement
  React.useEffect(() => {
    const validateAuthCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/drive/operation/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          
          if (!response.ok) throw new Error('Erreur d\'authentification');
          
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          
          // Nettoyer l'URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur d\'authentification');
        } finally {
          setIsLoading(false);
        }
      }
    };

    validateAuthCode();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentification Google Drive</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <Button 
          onClick={handleAuth} 
          disabled={isLoading}
          className={isAuthenticated ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
        >
          {isLoading 
            ? 'Chargement...' 
            : isAuthenticated 
              ? 'Se déconnecter' 
              : 'Se connecter à Google Drive'
          }
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Points d'Attention

### Gestion SSR
- Vérifier la disponibilité de localStorage
- Gérer les erreurs côté serveur
- Logs détaillés pour le debugging

### Sécurité
- Valider les variables d'environnement
- Gérer les tokens de manière sécurisée
- Nettoyer l'URL après authentification

### Tests
- Tests des routes API
- Tests des composants React
- Tests d'intégration SSR