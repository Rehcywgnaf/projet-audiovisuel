import { AIServiceManager } from './AIServiceManager';

export class AIRoutingService {
  private aiServiceManager: AIServiceManager;

  constructor() {
    this.aiServiceManager = new AIServiceManager();
  }

  async processRequest(requestType: string, params: any) {
    switch(requestType) {
      case 'RSS_ANALYSIS':
        return this.analyzeRSS(params);
      case 'DOCUMENT_GENERATION':
        return this.generateDocument(params);
      default:
        throw new Error('Unknown request type');
    }
  }

  private async analyzeRSS(params) {
    return this.aiServiceManager.generateContent({
      messages: [
        { role: 'user', content: 'Analyze this RSS feed' },
        // Autres messages selon le contexte
      ]
    });
  }

  private async generateDocument(params) {
    return this.aiServiceManager.generateContent({
      messages: [
        { role: 'user', content: 'Generate a document based on these parameters' },
        // Autres messages selon le contexte
      ]
    });
  }
}