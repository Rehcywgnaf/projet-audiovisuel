import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { ChartComponentProps } from './MonitoringDashboardTypes';

const ChartComponent = React.memo(({ data, avgTime }: ChartComponentProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="w-4 h-4" />
        Temps de Validation
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[100, 250]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">
          {avgTime}ms
        </div>
        <div className="text-sm text-gray-500">
          Temps moyen de validation
        </div>
      </div>
    </CardContent>
  </Card>
));

export default ChartComponent;