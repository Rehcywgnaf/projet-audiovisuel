import axios from 'axios';
import { validateURL, extractDate, extractBudget } from '../utils/dataValidation';

const API_TIMEOUT = 10000; // 10 secondes
const MAX_RETRY = 2;
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const apiService = {
  async fetchOpportunities(endpoint, filters = {}, retryCount = 0) {
    if (!validateURL(endpoint)) {
      console.error(`URL d'API invalide : ${endpoint}`);
      return [];
    }

    try {
      const corsEnabledUrl = `${CORS_PROXY}${endpoint}`;
      
      const response = await axios.get(corsEnabledUrl, { 
        params: {
          ...this._prepareRequestParams(filters),
          limit: 50,
          offset: 0
        },
        timeout: API_TIMEOUT,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      });

      // Normalisation et validation des données
      return this._processAPIResponse(response.data, endpoint, filters);

    } catch (error) {
      // Stratégie de retry
      if (retryCount < MAX_RETRY) {
        console.warn(`Tentative ${retryCount + 1} échouée pour ${endpoint}. Réessai...`);
        return this.fetchOpportunities(endpoint, filters, retryCount + 1);
      }

      console.error(`Erreur fatale de récupération API pour ${endpoint}:`, error);
      return [];
    }
  },

  _prepareRequestParams(filters) {
    return {
      type: filters.type,
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
      startDate: filters.dateRange?.start,
      endDate: filters.dateRange?.end
    };
  },

  _processAPIResponse(data, endpoint, filters) {
    // Gère différents formats de réponse API
    const items = Array.isArray(data) ? data : 
                  data.results ? data.results : 
                  data.opportunities || [];

    return items
      .map(item => this._normalizeOpportunity(item, endpoint))
      .filter(opp => this._validateOpportunity(opp, filters));
  },

  _normalizeOpportunity(item, endpoint) {
    return {
      id: item.id || this.generateUniqueId(),
      type: this.determineOpportunityType(item.title || ''),
      title: item.title || 'Opportunité sans titre',
      description: item.description || '',
      budget: extractBudget(item.budget || '') || 'Non spécifié',
      deadline: extractDate(item.deadline || '') || 'Non spécifié',
      source: endpoint
    };
  },

  _validateOpportunity(opportunity, filters) {
    // Filtres additionnels
    if (filters.type && opportunity.type !== filters.type) return false;
    
    // Validation budget
    if (filters.minBudget) {
      const budgetValue = parseFloat(opportunity.budget);
      if (budgetValue < filters.minBudget) return false;
    }

    return true;
  },

  generateUniqueId() {
    return `API_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  determineOpportunityType(title) {
    const aapKeywords = ['appel à projet', 'appel à candidature'];
    const aoKeywords = ['appel d\'offre', 'marché public'];

    const lowercaseTitle = title.toLowerCase();
    return aapKeywords.some(keyword => lowercaseTitle.includes(keyword)) ? 'AAP' : 'AO';
  }
};