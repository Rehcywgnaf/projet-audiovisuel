import React from 'react';
import {
  Activity,
  RefreshCcw,
  FileText,
  Tag,
  ExternalLink,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  Gauge
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRSS } from '@/hooks/useRSS';
import { cn } from "@/lib/utils";

const StatCard = ({
  title,
  value,
  description
}: {
  title: string;
  value: string | number;
  description?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {value}
      </div>
      {description && (
        <div className="text-xs text-muted-foreground">
          {description}
        </div>
      )}
    </CardContent>
  </Card>
);

const OpportunityCard = ({ opportunity: opp }: { opportunity: any }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{opp.title}</h3>
          <Badge
            variant={opp.type === 'AAP' ? 'default' : 'secondary'}
          >
            {opp.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Publié le {new Date(opp.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>

    {opp.analysis && (
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          {opp.analysis.keywords.map((keyword: string, idx: number) => (
            <Badge
              key={idx}
              variant="outline"
              className="bg-muted"
            >
              {keyword}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <HoverCard>
            <HoverCardTrigger>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {opp.analysis.category}
                </span>
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className={cn(
                  "text-sm font-medium",
                  opp.analysis.score >= 80 ? "text-green-600" :
                  opp.analysis.score >= 50 ? "text-yellow-600" :
                  "text-red-600"
                )}>
                  {opp.analysis.score}/100
                </span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium">Score d'opportunité</p>
                <p className="text-sm text-muted-foreground">
                  Score basé sur la pertinence du projet par rapport à vos critères 
                  et l'analyse de vos chances de succès.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    )}
  </div>
);

const SourceItem = ({ source }: { source: any }) => {
  const getStatusInfo = () => {
    switch (source.status) {
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      case 'pending':
        return {
          icon: Activity,
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      default:
        return {
          icon: ArrowUpRight,
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
    }
  };

  const { icon: StatusIcon, color, bgColor } = getStatusInfo();

  return (
    <div className="p-2 flex items-center justify-between hover:bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className={cn("p-1 rounded", bgColor)}>
          <StatusIcon className={cn("h-4 w-4", color)} />
        </div>
        <span className="font-medium">{source.name}</span>
      </div>
      <span className="text-sm text-muted-foreground">
        Dernière sync: {new Date(source.lastSync).toLocaleTimeString()}
      </span>
    </div>
  );
};

const RSSView = () => {
  const { rssData, isLoading, error } = useRSS();

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
        {error}
      </div>
    );
  }

  if (!rssData) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Sources Actives"
          value={rssData.stats.totalActive}
          description={`${rssData.stats.totalError} en erreur`}
        />
        <StatCard
          title="AAP Disponibles"
          value={rssData.aap.length}
        />
        <StatCard
          title="AO Disponibles"
          value={rssData.ao.length}
        />
        <StatCard
          title="Opportunités Récentes"
          value={rssData.recent.length}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              <CardTitle>Dernières Opportunités</CardTitle>
            </div>
            <Badge variant="outline">
              {rssData.recent.length} nouvelles
            </Badge>
          </div>
          <CardDescription>
            Opportunités récemment détectées avec analyse IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {rssData.recent.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Sources RSS</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {rssData.stats.totalActive} actives
              </Badge>
              <Badge variant="destructive">
                {rssData.stats.totalError} erreurs
              </Badge>
            </div>
          </div>
          <CardDescription>
            État des sources de veille en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rssData.sources.map((source) => (
              <SourceItem key={source.id} source={source} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSSView;