import { RSSService, NotificationService } from '../../services';

export interface Opportunity {
  id: string;
  title: string;
  source: string;
  deadline: Date;
  category: 'AAP' | 'AO';
  budget?: number;
  requirements: string[];
}

export class VeilleManager {
  private rssService: RSSService;
  private notificationService: NotificationService;
  private readonly keywords = ['audiovisuel', 'production', 'film', 'documentaire', 'série'];

  constructor() {
    this.rssService = new RSSService();
    this.notificationService = new NotificationService();
  }

  async processFeed(url: string): Promise<Opportunity[]> {
    try {
      const feed = await this.rssService.fetchFeed(url);
      const opportunities = this.analyzeFeed(feed);
      await this.notifyTeam(opportunities);
      return opportunities;
    } catch (error) {
      console.error('Erreur VeilleManager:', error);
      throw error;
    }
  }

  private analyzeFeed(feed: any[]): Opportunity[] {
    return feed
      .filter(item => this.isRelevant(item))
      .map(item => ({
        id: item.guid,
        title: item.title,
        source: item.source,
        deadline: this.extractDeadline(item.description),
        category: this.categorizeItem(item),
        budget: this.extractBudget(item.description),
        requirements: this.extractRequirements(item.description)
      }));
  }

  private isRelevant(item: any): boolean {
    return this.keywords.some(kw => 
      item.title.toLowerCase().includes(kw) || 
      item.description.toLowerCase().includes(kw)
    );
  }

  private categorizeItem(item: any): 'AAP' | 'AO' {
    const aoKeywords = ['appel d\'offres', 'marché public', 'consultation'];
    return aoKeywords.some(kw => 
      item.title.toLowerCase().includes(kw) || 
      item.description.toLowerCase().includes(kw)
    ) ? 'AO' : 'AAP';
  }

  private extractDeadline(description: string): Date {
    const dateRegex = /date limite.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i;
    const match = description.match(dateRegex);
    return match ? new Date(match[1]) : new Date();
  }

  private extractBudget(description: string): number | undefined {
    const budgetRegex = /budget.*?(\d+(?:\s*\d+)*(?:[.,]\d+)?)[\s€]*/i;
    const match = description.match(budgetRegex);
    return match ? parseFloat(match[1].replace(/\s/g, '')) : undefined;
  }

  private extractRequirements(description: string): string[] {
    const requirementMarkers = ['requis', 'obligatoire', 'conditions', 'critères'];
    const lines = description.split('\n');
    return lines
      .filter(line => 
        requirementMarkers.some(marker => 
          line.toLowerCase().includes(marker)
        )
      )
      .map(line => line.trim());
  }

  private async notifyTeam(opportunities: Opportunity[]): Promise<void> {
    await Promise.all(opportunities.map(opportunity =>
      this.notificationService.notify({
        type: 'new_opportunity',
        data: {
          id: opportunity.id,
          title: opportunity.title,
          category: opportunity.category,
          deadline: opportunity.deadline
        }
      })
    ));
  }
}