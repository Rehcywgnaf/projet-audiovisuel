'use client';
import React from 'react';
import { useDriveAuth } from './DriveAuthProvider';

export default function DriveAuth() {
  const { isAuthenticated, isInitializing, error, login, logout } = useDriveAuth();

  if (isInitializing) {
    return <div>Initialisation en cours...</div>;
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Google Drive Authentication</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isAuthenticated ? (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}