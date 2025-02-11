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
  private async parseRSSFeed(feedUrl: string): Promise<any[]> {
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
  private async scrapeHTMLSource(source: ScrapingSource): Promise<any[]> {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'SAPAV/1.0 (Project Tracking Bot)',
          'Accept-Language': 'fr-FR,fr;q=0.9'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const opportunities: any[] = [];

      const container = source.selector.opportunityContainer || source.selector.title;
      $(container).each((index, element) => {
        const title = sanitizeText($(element).find(source.selector.title).text());
        const description = sanitizeText($(element).find(source.selector.description).text());
        const deadline = source.selector.deadline 
          ? sanitizeText($(element).find(source.selector.deadline).text()) 
          : null;

        // Validation par mots-clés si présents
        const matchesKeywords = !source.keywords || 
          source.keywords.some(keyword => 
            title.toLowerCase().includes(keyword.toLowerCase()) ||
            description.toLowerCase().includes(keyword.toLowerCase())
          );

        if (matchesKeywords && title && description) {
          opportunities.push({
            source: source.url,
            type: source.type,
            title,
            description,
            deadline,
            scrapedAt: new Date().toISOString()
          });
        }
      });

      return opportunities;
    } catch (error) {
      this.logger.error(`Scraping error for ${source.url}`, error);
      return [];
    }
  }

  // Méthode principale pour scraper toutes les sources
  async scrapeAllSources(): Promise<any[]> {
    const allOpportunities: any[] = [];

    for (const source of this.sources) {
      let sourceOpportunities: any[] = [];

      if (source.mode === 'rss') {
        sourceOpportunities = await this.parseRSSFeed(source.url);
      } else {
        sourceOpportunities = await this.scrapeHTMLSource(source);
      }

      allOpportunities.push(...sourceOpportunities);
    }

    return this.validateOpportunities(allOpportunities);
  }

  // Méthode pour ajouter dynamiquement de nouvelles sources
  addSource(source: ScrapingSource) {
    this.sources.push(source);
  }

  // Validation avancée des opportunités
  validateOpportunities(opportunities: any[]): any[] {
    return opportunities.filter(opp => {
      // Validation du titre et description
      const hasContent = opp.title && opp.description;
      
      // Validation de la date limite si présente
      const hasValidDeadline = !opp.deadline || this.isValidDeadline(opp.deadline);
      
      // Filtrage des doublons potentiels
      const isUnique = opportunities.filter(
        other => other.title === opp.title && other.description === opp.description
      ).length === 1;

      return hasContent && hasValidDeadline && isUnique;
    });
  }

  // Méthode de validation des dates
  private isValidDeadline(deadline: string): boolean {
    try {
      // Tentative de parsing de différents formats de dates
      const dateFormats = [
        () => new Date(deadline),
        () => {
          const parts = deadline.split('/');
          return parts.length === 3 
            ? new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])) 
            : new Date(NaN);
        }
      ];

      for (const parseDate of dateFormats) {
        const parsedDate = parseDate();
        if (!isNaN(parsedDate.getTime()) && parsedDate > new Date()) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }
}

export default UnifiedScrapingService;
