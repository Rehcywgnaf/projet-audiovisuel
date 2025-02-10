import axios from 'axios';
import * as cheerio from 'cheerio';
import { AIServiceManager } from '../services/ai-service-manager';
import { Logger } from '../utils/logger';

interface SourceCandidate {
  url: string;
  type?: 'aap' | 'ao' | 'general';
  confidence?: number;
  analysisDetails?: {
    titleSelector?: string;
    descriptionSelector?: string;
    deadlineSelector?: string;
    budgetSelector?: string;
  };
}

class SourceDiscoveryService {
  private aiServiceManager: AIServiceManager;
  private logger: Logger;
  private sourceCandidates: SourceCandidate[] = [
    { 
      url: 'https://www.cnc.fr/professionnels/aides-et-financements',
      type: 'aap',
      confidence: 0.9
    }
  ];

  constructor(aiServiceManager: AIServiceManager) {
    this.aiServiceManager = aiServiceManager;
    this.logger = new Logger('SourceDiscoveryService');
  }

  async discoverSources(): Promise<SourceCandidate[]> {
    const discoveryMethods = [
      this.discoverFromSearchEngines(),
      this.discoverFromKnownDirectories(),
      this.monitorIndustryWebsites()
    ];

    const newSources = await Promise.all(discoveryMethods);
    
    const validSources = newSources
      .flat()
      .filter(source => source !== null && this.isSourceValid(source));

    this.sourceCandidates.push(...validSources);
    return validSources;
  }

  private async discoverFromSearchEngines(): Promise<SourceCandidate[]> {
    const searchQueries = [
      'appels à projets audiovisuels',
      'financements cinéma',
      'subventions production audiovisuelle'
    ];

    const sources: SourceCandidate[] = [];
    
    for (const query of searchQueries) {
      try {
        const searchResults = await this.aiServiceManager.searchAndAnalyzeSources(query);
        sources.push(...searchResults);
      } catch (error) {
        this.logger.error(`Search discovery error for query: ${query}`, error);
      }
    }

    return sources;
  }

  private async discoverFromKnownDirectories(): Promise<SourceCandidate[]> {
    const directories = [
      'https://www.cnc.fr',
      'https://www.institutfrancais.com',
      'https://www.culture.gouv.fr'
    ];

    const sources: SourceCandidate[] = [];
    
    for (const directory of directories) {
      try {
        const pageLinks = await this.extractRelevantLinks(directory);
        const analyzedSources = await Promise.all(
          pageLinks.map(link => this.analyzeUserSubmittedSource(link))
        );
        sources.push(...analyzedSources.filter(source => source !== null));
      } catch (error) {
        this.logger.error(`Error discovering sources from ${directory}`, error);
      }
    }

    return sources;
  }

  private async monitorIndustryWebsites(): Promise<SourceCandidate[]> {
    const industryWebsites = [
      'https://www.scam.fr',
      'https://www.sacd.fr',
      'https://www.angoa.com'
    ];

    const sources: SourceCandidate[] = [];
    
    for (const website of industryWebsites) {
      try {
        const newSources = await this.extractNewOpportunitySources(website);
        sources.push(...newSources);
      } catch (error) {
        this.logger.error(`Error monitoring ${website}`, error);
      }
    }

    return sources;
  }

  async analyzeUserSubmittedSource(url: string): Promise<SourceCandidate | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'SAPAV/1.0 (Source Discovery Bot)',
          'Accept-Language': 'fr-FR,fr;q=0.9'
        }
      });

      const $ = cheerio.load(response.data);
      
      const potentialSelectors = this.detectPotentialSelectors($);

      const aiAnalysis = await this.aiServiceManager.analyzeSourcePotential({
        url,
        pageContent: response.data,
        detectedSelectors: potentialSelectors
      });

      const sourceCandidate: SourceCandidate = {
        url,
        type: aiAnalysis.type || 'general',
        confidence: aiAnalysis.confidence,
        analysisDetails: {
          titleSelector: potentialSelectors.titleSelector,
          descriptionSelector: potentialSelectors.descriptionSelector,
          deadlineSelector: potentialSelectors.deadlineSelector,
          budgetSelector: potentialSelectors.budgetSelector
        }
      };

      if (this.isSourceValid(sourceCandidate)) {
        this.sourceCandidates.push(sourceCandidate);
        return sourceCandidate;
      }

      return null;
    } catch (error) {
      this.logger.error(`Source analysis error for ${url}`, error);
      return null;
    }
  }

  private detectPotentialSelectors($: cheerio.Root) {
    return {
      titleSelector: $('h1, h2, .title, .project-title').first().selector(),
      descriptionSelector: $('.description, .content, .project-details').first().selector(),
      deadlineSelector: $('*[class*="deadline"], *[id*="deadline"]').first().selector(),
      budgetSelector: $('*[class*="budget"], *[id*="budget"]').first().selector()
    };
  }

  private async extractRelevantLinks(url: string): Promise<string[]> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      return $('a')
        .map((_, link) => $(link).attr('href'))
        .get()
        .filter(href => 
          href && 
          href.startsWith('http') && 
          (href.includes('appel') || href.includes('projet') || href.includes('financement'))
        )
        .slice(0, 10);
    } catch (error) {
      this.logger.error(`Error extracting links from ${url}`, error);
      return [];
    }
  }

  private async extractNewOpportunitySources(url: string): Promise<SourceCandidate[]> {
    try {
      const links = await this.extractRelevantLinks(url);
      const sources = await Promise.all(
        links.map(link => this.analyzeUserSubmittedSource(link))
      );
      return sources.filter(source => source !== null);
    } catch (error) {
      this.logger.error(`Error extracting opportunity sources from ${url}`, error);
      return [];
    }
  }

  private isSourceValid(source: SourceCandidate): boolean {
    return source.confidence > 0.5 && 
           source.analysisDetails?.titleSelector !== undefined;
  }

  getSources(): SourceCandidate[] {
    return this.sourceCandidates;
  }

  removeSource(url: string): void {
    this.sourceCandidates = this.sourceCandidates.filter(src => src.url !== url);
  }
}

export default SourceDiscoveryService;
export { SourceCandidate };