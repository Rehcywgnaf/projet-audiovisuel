import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface ItemCardProps {
  title: string;
  subtitle?: string;
  date?: string;
  status?: string;
  href?: string;
}

export function ItemCard({ title, subtitle, date, status, href }: ItemCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return <Link href={href}>{children}</Link>;
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              {date && (
                <p className="text-xs text-gray-400">
                  Updated: {new Date(date).toLocaleDateString()}
                </p>
              )}
            </div>
            {status && <StatusBadge status={status} />}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}