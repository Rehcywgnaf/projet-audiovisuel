'use client';

import DriveAuth from '@/components/Drive/Auth/DriveAuth';
import { DriveAuthProvider } from '@/components/Drive/Auth/DriveAuthProvider';
import { DriveIntegration } from '@/components/Drive/Integration/DriveIntegration';
import React from 'react';

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