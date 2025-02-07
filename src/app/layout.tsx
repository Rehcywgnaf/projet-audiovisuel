import '@/styles/globals.css';
import { DriveProvider } from '@/components/Drive/DriveProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <DriveProvider>
          {children}
        </DriveProvider>
      </body>
    </html>
  );
}