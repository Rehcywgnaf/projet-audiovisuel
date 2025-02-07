import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
  loading = false
}: StatsCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      loading && "animate-pulse",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "-" : value}
        </div>
        {trend !== undefined && (
          <p className={cn(
            "text-xs",
            trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"
          )}>
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "="}
            {Math.abs(trend)}% par rapport au mois dernier
          </p>
        )}
      </CardContent>
    </Card>
  );
}