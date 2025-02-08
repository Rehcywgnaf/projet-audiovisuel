import axios from 'axios';

export const apiService = {
  async fetchOpportunities(endpoint, filters = {}) {
    try {
      const response = await axios.get(endpoint, { 
        params: {
          type: filters.type,
          minBudget: filters.minBudget,
          maxBudget: filters.maxBudget,
          startDate: filters.dateRange?.start,
          endDate: filters.dateRange?.end
        }
      });

      // Normalisation des données
      return response.data.map(item => ({
        id: item.id || this.generateUniqueId(),
        type: this.determineOpportunityType(item.title),
        title: item.title,
        budget: this.formatBudget(item.budget),
        deadline: this.formatDeadline(item.deadline),
        description: item.description || '',
        source: endpoint
      }));
    } catch (error) {
      console.error(`Erreur de récupération API pour ${endpoint}:`, error);
      return [];
    }
  },

  generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  },

  determineOpportunityType(title) {
    const aapKeywords = ['appel à projet', 'appel à candidature'];
    const aoKeywords = ['appel d\'offre', 'marché public'];

    const lowercaseTitle = title.toLowerCase();
    return aapKeywords.some(keyword => lowercaseTitle.includes(keyword)) ? 'AAP' : 'AO';
  },

  formatBudget(budget) {
    if (!budget) return 'Non spécifié';
    
    // Convertit différents formats de budget
    const budgetMatch = budget.toString().match(/(\d+(?:\s*\d{3})*)\s*(?:€|euros)/i);
    return budgetMatch ? `${budgetMatch[1]} €` : 'Non spécifié';
  },

  formatDeadline(deadline) {
    if (!deadline) return 'Non spécifié';
    
    // Convertit différents formats de date
    const dateFormats = [
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{4}-\d{2}-\d{2})/
    ];

    for (const format of dateFormats) {
      const match = deadline.match(format);
      if (match) return match[1];
    }

    return 'Non spécifié';
  }
};