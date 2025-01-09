import React from 'react';
import { DriveAuth, DriveAuthProvider, DriveManagerTest } from '@/components/drive';

export default function Home() {
  return (
    <main className="p-4 space-y-8">
      <DriveAuthProvider>
        <DriveAuth />
        <DriveManagerTest />
      </DriveAuthProvider>
    </main>
  );
}