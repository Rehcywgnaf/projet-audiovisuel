import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const CacheMetrics = React.memo(({ components }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Database className="w-4 h-4" />
        Performance Cache
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {components.map((component, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{component.name}</span>
              <span className="text-gray-500">{component.duration}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${component.rate}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hit Rate</span>
              <span className={component.rate >= component.target ? 'text-green-600' : 'text-yellow-600'}>
                {component.rate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

export default CacheMetrics;