"use client";

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export function DriveAuth() {
  const [status, setStatus] = useState('non initialisé');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      setStatus('Script chargé');
      if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        console.log("Client ID trouvé:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.substring(0, 10) + "...");
        initializeGoogleAuth();
      } else {
        console.error("Client ID manquant");
        setStatus('Erreur: Client ID manquant');
      }
    };
  }, []);

  const initializeGoogleAuth = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: async (response: any) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
          setStatus('Connecté');
          await listFiles(response.access_token);
        }
      },
    });

    return client;
  };

  const listFiles = async (token: string) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,modifiedTime)',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers:", error);
    }
  };

  const handleLogin = () => {
    setStatus('Tentative de connexion...');
    try {
      const client = initializeGoogleAuth();
      client.requestAccessToken();
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setStatus('Erreur lors de la connexion');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Test de Connexion Google Drive</h2>
        <p className="mt-2">Status: {status}</p>
        {status !== 'Connecté' && (
          <button
            onClick={handleLogin}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Se connecter avec Google
          </button>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Fichiers Drive :</h3>
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="p-2 border rounded">
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-gray-500">
                  Type: {file.mimeType}
                  <br />
                  Modifié: {new Date(file.modifiedTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 mt-4">
        <p>Client ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✓ présent' : '✗ manquant'}</p>
      </div>
    </div>
  );
}