'use client';

import DriveAuth from '@/components/Drive/Auth/DriveAuth';
import { DriveAuthProvider } from '@/components/Drive/Auth/DriveAuthProvider';
import DriveIntegration from '@/components/Drive/Integration/DriveIntegration';
import { AIServiceManager } from '@/lib/AIServiceManager';
import React from 'react';

// Initialisation du service AI au niveau de la page
AIServiceManager.initialize({
  maxRequests: 20,
  cacheTimeout: 120000
});

export default function Home() {
  return (
    <main className="p-4 space-y-8">
      <DriveAuthProvider>
        <DriveAuth />
        <DriveIntegration />
      </DriveAuthProvider>
    </main>
  );
}