'use client';

import { useDrive } from '@/components/Drive/DriveProvider';
import { Card, CardContent } from '@/components/ui/card';

export default function DrivePage() {
  const { isAuthenticated, error } = useDrive();

  const handleLogin = async () => {
    window.location.href = '/api/drive/auth/url';
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardContent className="pt-6">
        <h1 className="text-2xl font-bold mb-4">Authentification Google Drive</h1>
        {!isAuthenticated && (
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Se connecter à Google Drive
          </button>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
}