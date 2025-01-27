import Navigation from '@/components/Navigation';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navigation />
        <main className="pl-64">
          {children}
        </main>
      </body>
    </html>
  );
}