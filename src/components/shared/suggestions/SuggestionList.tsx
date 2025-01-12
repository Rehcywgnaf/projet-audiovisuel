import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SuggestionListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function SuggestionList<T>({
  title,
  items,
  renderItem
}: SuggestionListProps<T>) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map(item => renderItem(item))}
        </div>
      </CardContent>
    </Card>
  );
}