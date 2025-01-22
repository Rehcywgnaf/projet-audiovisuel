// scrapingService.js
import axios from 'axios';
import cheerio from 'cheerio';

class ScrapingService {
  async scrapeWebsite(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      switch (url) {
        case 'https://www.francemarches.com/appels-offres-audiovisuel':
          return this.scrapeFranceMarches($);
        case 'https://appelaprojets.org':
          return this.scrapeAppelProjets($);
        case 'https://www.fimeco-walter-allinial.com':
          return this.scrapeFimeco($);
        case 'https://ellesfontlaculture.culture.gouv.fr':
          return this.scrapeEFLC($);
        default:
          return this.scrapeGeneric($);
      }
    } catch (error) {
      console.error(`Erreur lors du scraping de ${url}:`, error);
      throw error;
    }
  }

  scrapeFranceMarches($) {
    const projects = [];
    $('.appel-offre').each((i, el) => {
      projects.push({
        title: $(el).find('.titre').text().trim(),
        deadline: $(el).find('.date-limite').text().trim(),
        link: $(el).find('a').attr('href'),
        budget: $(el).find('.budget').text().trim()
      });
    });
    return projects;
  }
}