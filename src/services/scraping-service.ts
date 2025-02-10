import axios from 'axios';
import * as cheerio from 'cheerio';
import { Logger } from '../utils/logger';

interface ScrapingSource {
  url: string;
  type: 'aap' | 'ao' | 'general';
  selector: {
    title: string;
    description: string;
    deadline?: string;
    budget?: string;
  };
}

class ScrapingService {
  private sources: ScrapingSource[] = [
    {
      url: 'https://www.cnc.fr/professionnels/aides-et-financements',
      type: 'aap',
      selector: {
        title: '.project-title',
        description: '.project-details',
        deadline: '.deadline-date',
        budget: '.budget-range'
      }
    },
    // Autres sources à ajouter
  ];

  private logger: Logger;

  constructor() {
    this.logger = new Logger('ScrapingService');
  }

  async scrapeSource(source: ScrapingSource) {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'SAPAV/1.0 (Project Tracking Bot)',
          'Accept-Language': 'fr-FR,fr;q=0.9'
        }
      });

      const $ = cheerio.load(response.data);
      const opportunities: any[] = [];

      $(source.selector.title).each((index, element) => {
        const title = $(element).text().trim();
        const description = $(element).siblings(source.selector.description).text().trim();
        const deadline = source.selector.deadline 
          ? $(element).siblings(source.selector.deadline).text().trim() 
          : null;
        const budget = source.selector.budget
          ? $(element).siblings(source.selector.budget).text().trim()
          : null;

        opportunities.push({
          source: source.url,
          type: source.type,
          title,
          description,
          deadline,
          budget
        });
      });

      return opportunities;
    } catch (error) {
      this.logger.error(`Scraping error for ${source.url}`, error);
      return [];
    }
  }

  async scrapeAllSources() {
    const allOpportunities: any[] = [];

    for (const source of this.sources) {
      const sourceOpportunities = await this.scrapeSource(source);
      allOpportunities.push(...sourceOpportunities);
    }

    return allOpportunities;
  }

  // Méthode pour ajouter dynamiquement de nouvelles sources
  addSource(source: ScrapingSource) {
    this.sources.push(source);
  }

  // Validation basique des opportunités
  validateOpportunities(opportunities: any[]) {
    return opportunities.filter(opp => 
      opp.title && 
      opp.description && 
      (opp.deadline ? this.isValidDeadline(opp.deadline) : true)
    );
  }

  private isValidDeadline(deadline: string): boolean {
    // Logique de validation de la date limite
    try {
      const parsedDate = new Date(deadline);
      return parsedDate > new Date();
    } catch {
      return false;
    }
  }
}

export default ScrapingService;
