import {  DriveAuth, DriveAuthProvider, DriveManagerTest } from '@/components/Drive';
import React from 'react';

export default function Home() {
  return (
    <main className="p-4 space-y-8">
      <DriveAuthProvider>
        <DriveAuth />
        {/* <DriveManagerTest /> */}
      </DriveAuthProvider>
    </main>
  );
}