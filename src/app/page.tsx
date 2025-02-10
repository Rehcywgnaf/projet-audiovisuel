'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import MainInterface from '@/components/layout/MainInterface';
import DriveAuthPage from './drive/auth/page';
import { useDrive } from './drive/provider/page';

export default function Home() {
  const { isAuthenticated } = useDrive();

  if (!isAuthenticated) {
    return (
      <main className="p-4">
        <DriveAuthPage />
      </main>
    );
  }

  return <MainInterface />;
}