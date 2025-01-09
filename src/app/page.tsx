import React from 'react';
import { DriveAuth, DriveAuthProvider, DriveManagerTest } from '@/components/drive';

export default function Home() {
  return (
    <DriveAuthProvider>
      <main className="p-4 space-y-8">
        <DriveAuth />
        <DriveManagerTest />
      </main>
    </DriveAuthProvider>
  );
}