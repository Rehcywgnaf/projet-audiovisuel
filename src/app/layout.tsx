import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DriveProvider } from './drive/provider/page';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SAPAV - Soutien Appel à Projet AudioVisuel',
  description: 'Plateforme de gestion des appels à projets audiovisuels',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <DriveProvider>
          {children}
        </DriveProvider>
      </body>
    </html>
  );
}