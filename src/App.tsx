import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainInterface from '@/components/layout/MainInterface';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('google_token');
        if (token) {
          // Vérifier la validité du token
          const response = await fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token);
          if (response.ok) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleGoogleLogin = () => {
    window.gapi.auth2.getAuthInstance().signIn().then(
      (googleUser) => {
        const token = googleUser.getAuthResponse().access_token;
        localStorage.setItem('google_token', token);
        setIsAuthenticated(true);
      },
      (error) => {
        console.error('Erreur authentification:', error);
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">SAPAV</h1>
          <p className="text-gray-600">Connectez-vous avec votre compte Google Workspace</p>
        </div>
        <Button 
          onClick={handleGoogleLogin}
          size="lg"
          className="flex items-center gap-2"
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          Se connecter avec Google
        </Button>
      </div>
    );
  }

  return <MainInterface />;
};

export default App;