import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { LoggingService } from '@/lib/LoggingService';
import AIServiceManager from '@/lib/AIServiceManager';

export interface DiscoveredSource {
  url: string;
  type: 'rss' | 'api' | 'scraping';
  confidence: number;
  categories: string[];
  lastChecked: Date;
}

export class SourceDiscoveryService {
  private loggingService: LoggingService;
  private aiServiceManager: AIServiceManager;

  // Sources de recherche initiales
  private seedSources = [
    'https://www.cnc.fr',
    'https://www.culture.gouv.fr',
    'https://www.institutfrancais.com',
    'https://www.arte.tv',
    'https://www.francemarches.com',
    'https://www.marchespublics.gouv.fr'
  ];

  // Mots-clés pour la recherche de sources AAP/AO
  private aapKeywords = [
    'appel à projet', 
    'appel à candidature', 
    'financement', 
    'audiovisuel', 
    'cinéma', 
    'production', 
    'subvention'
  ];

  constructor() {
    this.loggingService = LoggingService.getInstance();
    this.aiServiceManager = AIServiceManager.getInstance();
  }

  async discoverSources(keywords: string[] = this.aapKeywords): Promise<DiscoveredSource[]> {
    const discoveredSources: DiscoveredSource[] = [];

    for (const seedSource of this.seedSources) {
      try {
        const sourceCandidates = await this.extractPotentialSources(seedSource, keywords);
        
        // Validation de chaque source candidate
        for (const candidate of sourceCandidates) {
          const validationResult = await this.validateSource(candidate);
          if (validationResult) {
            discoveredSources.push(validationResult);
          }
        }
      } catch (error) {
        this.loggingService.error('Erreur de découverte de sources', { 
          seedSource, 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        });
      }
    }

    return this.filterAndRankSources(discoveredSources);
  }

  private async extractPotentialSources(baseUrl: string, keywords: string[]): Promise<string[]> {
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          'User-Agent': 'SAPAV Source Discovery Bot'
        }
      });

      const $ = cheerio.load(response.data);
      const potentialSources: string[] = [];

      // Recherche de liens potentiels
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const fullUrl = this.normalizeUrl(href, baseUrl);
          if (this.isRelevantUrl(fullUrl, keywords)) {
            potentialSources.push(fullUrl);
          }
        }
      });

      return [...new Set(potentialSources)]; // Éliminer les doublons
    } catch (error) {
      this.loggingService.error('Erreur d\'extraction de sources', { 
        baseUrl, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return [];
    }
  }

  private normalizeUrl(url: string, baseUrl: string): string {
    try {
      // Convertir les URL relatives en absolues
      const fullUrl = new URL(url, baseUrl).toString();
      return fullUrl;
    } catch {
      return url;
    }
  }

  private isRelevantUrl(url: string, keywords: string[]): boolean {
    // Filtres pour éliminer les URLs irrelevantes
    const irrelevantPatterns = [
      /\.(jpg|jpeg|png|gif|pdf|css|js)$/i,
      /facebook\.com/,
      /twitter\.com/,
      /instagram\.com/
    ];

    if (irrelevantPatterns.some(pattern => pattern.test(url))) {
      return false;
    }

    // Vérification par mots-clés
    const lowercaseUrl = url.toLowerCase();
    return keywords.some(keyword => 
      lowercaseUrl.includes(keyword.toLowerCase())
    );
  }

  private async validateSource(url: string): Promise<DiscoveredSource | null> {
    try {
      // Utilisation d'AIServiceManager pour analyser la source
      const analysisResponse = await this.aiServiceManager.processRequest('source-validator', 'validate', {
        data: { url },
        options: {
          cache: true,
          complexity: 'simple',
          monitoringKey: 'source_discovery'
        }
      });

      if (analysisResponse.success) {
        return {
          url,
          type: this.determineSourceType(url),
          confidence: analysisResponse.data.confidence || 0.5,
          categories: analysisResponse.data.categories || [],
          lastChecked: new Date()
        };
      }

      return null;
    } catch (error) {
      this.loggingService.error('Erreur de validation de source', { 
        url, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
      return null;
    }
  }

  private determineSourceType(url: string): DiscoveredSource['type'] {
    if (url.includes('rss') || url.includes('feed')) return 'rss';
    if (url.includes('api')) return 'api';
    return 'scraping';
  }

  private filterAndRankSources(sources: DiscoveredSource[]): DiscoveredSource[] {
    return sources
      .filter(source => source.confidence > 0.5) // Seuil de confiance
      .sort((a, b) => b.confidence - a.confidence) // Trier par confiance
      .slice(0, 20); // Limiter à 20 sources
  }
}

export const sourceDiscoveryService = new SourceDiscoveryService();