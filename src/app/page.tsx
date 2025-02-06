'use client';

import DriveAuthPage from './drive/auth/page';
import DriveProvider from './drive/provider/page';
import DriveIntegrationPage from './drive/integration/page';
import React from 'react';

export default function Home() {
  return (
    <main className="p-4 space-y-8">
      <DriveProvider>
        <DriveAuthPage />
        <DriveIntegrationPage />
      </DriveProvider>
    </main>
  );
}