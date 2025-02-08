import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';

export const scrapingService = {
  async parseRSSFeed(feedUrl) {
    try {
      const parser = new Parser();
      const feed = await parser.parseURL(feedUrl);
      
      return feed.items.map(item => ({
        title: item.title || '',
        description: item.description || '',
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString()
      }));
    } catch (error) {
      console.error(`Erreur de parsing RSS pour ${feedUrl}:`, error);
      return [];
    }
  },

  async scrapeOpportunities(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const opportunities = [];

      // Sélecteurs génériques, à adapter selon chaque site
      $('.opportunity, .project-listing, .call-for-project').each((index, element) => {
        const title = $(element).find('.title').text().trim();
        const description = $(element).find('.description').text().trim();
        const deadline = $(element).find('.deadline').text().trim();
        const budget = $(element).find('.budget').text().trim();

        opportunities.push({
          title,
          description,
          deadline,
          budget,
          source: url
        });
      });

      return opportunities;
    } catch (error) {
      console.error(`Erreur de scraping pour ${url}:`, error);
      return [];
    }
  }
};