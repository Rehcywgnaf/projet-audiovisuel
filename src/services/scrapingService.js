import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { validateURL, sanitizeText } from '../utils/dataValidation';

export const scrapingService = {
  async parseRSSFeed(feedUrl) {
    if (!validateURL(feedUrl)) {
      console.error(`URL invalide : ${feedUrl}`);
      return [];
    }

    try {
      const parser = new Parser();
      const feed = await parser.parseURL(feedUrl);
      
      return feed.items
        .map(item => ({
          title: sanitizeText(item.title || ''),
          description: sanitizeText(item.description || ''),
          link: item.link || '',
          pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          source: feedUrl
        }))
        .filter(item => item.title && item.description); // Filtrer les éléments incomplets
    } catch (error) {
      console.error(`Erreur de parsing RSS pour ${feedUrl}:`, error);
      return [];
    }
  },

  async scrapeOpportunities(url, selectors = {}) {
    if (!validateURL(url)) {
      console.error(`URL invalide : ${url}`);
      return [];
    }

    const defaultSelectors = {
      opportunityContainer: '.opportunity, .project-listing, .call-for-project',
      title: '.title',
      description: '.description',
      deadline: '.deadline',
      budget: '.budget'
    };

    const mergedSelectors = { ...defaultSelectors, ...selectors };

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'SAPAV RSS Crawler',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000 // 10 secondes de timeout
      });

      const $ = cheerio.load(response.data);
      const opportunities = [];

      $(mergedSelectors.opportunityContainer).each((index, element) => {
        const title = sanitizeText($(element).find(mergedSelectors.title).text());
        const description = sanitizeText($(element).find(mergedSelectors.description).text());
        const deadline = sanitizeText($(element).find(mergedSelectors.deadline).text());
        const budget = sanitizeText($(element).find(mergedSelectors.budget).text());

        if (title && description) {
          opportunities.push({
            title,
            description,
            deadline,
            budget,
            source: url,
            scrapedAt: new Date().toISOString()
          });
        }
      });

      return opportunities;
    } catch (error) {
      console.error(`Erreur de scraping pour ${url}:`, error);
      return [];
    }
  },

  // Méthode pour personnaliser les sélecteurs par site
  configureScraping(url, customSelectors) {
    // Pourrait être utilisé pour des configurations spécifiques à certains sites
    const siteSpecificSelectors = {
      'cnc.fr': { 
        opportunityContainer: '.appel-projet',
        title: 'h2.titre',
        description: '.description-projet'
      },
      // Ajouter d'autres configurations de sites
    };

    return siteSpecificSelectors[new URL(url).hostname] || customSelectors;
  }
};