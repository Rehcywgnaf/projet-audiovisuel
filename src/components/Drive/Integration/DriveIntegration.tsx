import React from 'react';
import { DriveCore } from '../Core';
import { useDriveAuth } from '../Auth';

export default function DriveIntegration() {
  const { isAuthenticated } = useDriveAuth();

  return isAuthenticated ? (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Drive Integration</h2>
      {/* Composants d'intégration */}
    </div>
  ) : null;
}