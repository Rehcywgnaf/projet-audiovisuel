import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { Logger } from '../utils/logger';
import { validateURL, sanitizeText } from '../utils/dataValidation';

interface ScrapingSource {
  url: string;
  type: 'aap' | 'ao' | 'general';
  keywords?: string[];
  selector: {
    opportunityContainer?: string;
    title: string;
    description: string;
    deadline?: string;
    budget?: string;
  };
  mode?: 'rss' | 'html';
}

class UnifiedScrapingService {
  private sources: ScrapingSource[] = [
    {
      url: 'https://www.francemarches.com/appels-offre/audiovisuel',
      type: 'ao',
      mode: 'html',
      keywords: ['audiovisuel', 'production audiovisuelle'],
      selector: {
        opportunityContainer: '.marche-ligne',
        title: '.marche-titre',
        description: '.marche-description',
        deadline: '.marche-date'
      }
    },
    {
      url: 'https://www.francemarches.com/appels-offre/production-audiovisuelle',
      type: 'ao',
      mode: 'html',
      keywords: ['audiovisuel', 'production audiovisuelle'],
      selector: {
        opportunityContainer: '.marche-ligne',
        title: '.marche-titre',
        description: '.marche-description',
        deadline: '.marche-date'
      }
    },
    {
      url: 'https://www.j360.info/appels-d-offres/recherche/audiovisuel/',
      type: 'ao',
      mode: 'html',
      keywords: ['audiovisuel', 'production audiovisuelle'],
      selector: {
        opportunityContainer: '.tender-item',
        title: '.tender-titre',
        description: '.tender-description',
        deadline: '.tender-date'
      }
    },
    {
      url: 'https://www.e-marchespublics.com/appel-offre/audiovisuel',
      type: 'ao',
      mode: 'html',
      keywords: ['audiovisuel', 'production audiovisuelle'],
      selector: {
        opportunityContainer: '.marche-row',
        title: '.marche-titre',
        description: '.marche-description',
        deadline: '.marche-date'
      }
    }
  ];

  private logger: Logger;
  private rssParser: Parser;

  constructor() {
    this.logger = new Logger('UnifiedScrapingService');
    this.rssParser = new Parser();
  }

  // Méthode pour parser les flux RSS
  public async parseRSSFeed(feedUrl: string): Promise<any[]> {
    if (!validateURL(feedUrl)) {
      this.logger.error(`URL invalide : ${feedUrl}`);
      return [];
    }

    try {
      const feed = await this.rssParser.parseURL(feedUrl);
      
      return feed.items
        .map(item => ({
          title: sanitizeText(item.title || ''),
          description: sanitizeText(item.description || ''),
          link: item.link || '',
          pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          source: feedUrl
        }))
        .filter(item => item.title && item.description);
    } catch (error) {
      this.logger.error(`Erreur de parsing RSS pour ${feedUrl}`, error);
      return [];
    }
  }

  // Méthode pour scraper des sources HTML
  public async scrapeOpportunities(url: string, customSelectors?: Partial<ScrapingSource['selector']>): Promise<any[]> {
    const source = this.sources.find(s => s.url === url);
    if (!source) {
      this.logger.error(`Source non configurée : ${url}`);
      return [];
    }

    const mergedSelectors = {
      ...source.selector,
      ...customSelectors
    };

    try {
      const config = {
        timeout: 10000,
        // Suppression des en-têtes personnalisés
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        }
      };

      // Pour les environnements navigateur, ajuster la configuration
      if (typeof window !== 'undefined') {
        delete config.headers;
      }

      const response = await axios.get(url, config);

      const $ = cheerio.load(response.data);
      const opportunities: any[] = [];

      const container = mergedSelectors.opportunityContainer || mergedSelectors.title;
      $(container).each((index, element) => {
        const title = sanitizeText($(element).find(mergedSelectors.title).text());
        const description = sanitizeText($(element).find(mergedSelectors.description).text());
        const deadline = mergedSelectors.deadline 
          ? sanitizeText($(element).find(mergedSelectors.deadline).text()) 
          : null;

        // Validation par mots-clés si présents
        const matchesKeywords = !source.keywords || 
          source.keywords.some(keyword => 
            title.toLowerCase().includes(keyword.toLowerCase()) ||
            description.toLowerCase().includes(keyword.toLowerCase())
          );

        if (matchesKeywords && title && description) {
          opportunities.push({
            title,
            description,
            deadline,
            source: url,
            scrapedAt: new Date().toISOString()
          });
        }
      });

      return opportunities;
    } catch (error) {
      this.logger.error(`Erreur de scraping pour ${url}`, error);
      return [];
    }
  }

  // Méthode pour ajouter dynamiquement de nouvelles sources
  public addSource(source: ScrapingSource) {
    this.sources.push(source);
  }

  // Méthode principale pour scraper toutes les sources
  public async scrapeAllSources(): Promise<any[]> {
    const allOpportunities: any[] = [];

    for (const source of this.sources) {
      let sourceOpportunities: any[] = [];

      if (source.mode === 'rss') {
        sourceOpportunities = await this.parseRSSFeed(source.url);
      } else {
        sourceOpportunities = await this.scrapeOpportunities(source.url);
      }

      allOpportunities.push(...sourceOpportunities);
    }

    return allOpportunities;
  }
}

export const unifiedScrapingService = new UnifiedScrapingService();
export default UnifiedScrapingService;
