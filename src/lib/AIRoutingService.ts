type ClaudeModel = 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307';

interface RoutingCriteria {
  serviceType: 'rss' | 'editor' | 'validator' | 'suggester' | 'analyzer';
  maxTokens?: number;
  complexity: 'simple' | 'complex';
  timeConstraint: 'strict' | 'flexible';
  contextRequired: boolean;
}

class AIRoutingService {
  private static instance: AIRoutingService;

  // Configuration du routing par service
  private serviceConfig = new Map<string, RoutingCriteria>([
    ['deadline-suggestions', {
      serviceType: 'suggester',
      complexity: 'simple',
      timeConstraint: 'strict',
      contextRequired: false
    }],
    ['rss-filtering', {
      serviceType: 'rss',
      complexity: 'simple',
      timeConstraint: 'strict',
      contextRequired: false
    }],
    ['document-preview', {
      serviceType: 'validator',
      complexity: 'simple',
      timeConstraint: 'strict',
      contextRequired: false
    }],
    ['metadata-enrichment', {
      serviceType: 'analyzer',
      complexity: 'simple',
      timeConstraint: 'flexible',
      contextRequired: true
    }],
    ['aap-analysis', {
      serviceType: 'analyzer',
      complexity: 'complex',
      timeConstraint: 'flexible',
      contextRequired: true
    }],
    ['document-generation', {
      serviceType: 'editor',
      complexity: 'complex',
      timeConstraint: 'flexible',
      contextRequired: true
    }]
  ]);

  private constructor() {}

  public static getInstance(): AIRoutingService {
    if (!AIRoutingService.instance) {
      AIRoutingService.instance = new AIRoutingService();
    }
    return AIRoutingService.instance;
  }

  public routeRequest(service: string, criteria?: Partial<RoutingCriteria>): ClaudeModel {
    // Récupérer la configuration de base pour le service
    const baseConfig = this.serviceConfig.get(service);
    
    if (!baseConfig) {
      console.warn(`No routing configuration found for service: ${service}`);
      return 'claude-3-sonnet-20240229'; // Fallback sur Sonnet par défaut
    }

    // Fusionner avec les critères spécifiques
    const finalCriteria = { ...baseConfig, ...criteria };

    // Logique de routing
    if (this.shouldUseHaiku(finalCriteria)) {
      return 'claude-3-haiku-20240307';
    }

    return 'claude-3-sonnet-20240229';
  }

  private shouldUseHaiku(criteria: RoutingCriteria): boolean {
    // Utiliser Haiku si TOUTES ces conditions sont remplies
    return (
      criteria.complexity === 'simple' &&
      criteria.timeConstraint === 'strict' &&
      !criteria.contextRequired &&
      (!criteria.maxTokens || criteria.maxTokens <= 1000)
    );
  }

  public getServiceConfig(service: string): RoutingCriteria | undefined {
    return this.serviceConfig.get(service);
  }

  public getDefaultModel(service: string): ClaudeModel {
    return this.routeRequest(service);
  }
}

export default AIRoutingService;