// apiService.js
import axios from 'axios';

class APIService {
  constructor() {
    this.endpoints = {
      'e-marchespublics': 'https://api.e-marchespublics.com/v1',
      'marchesonline': 'https://api.marchesonline.com/v2'
    };
  }

  async fetchProjects(platform) {
    try {
      const response = await axios.get(`${this.endpoints[platform]}/projects`, {
        params: {
          category: 'audiovisual',
          status: 'active'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des projets de ${platform}:`, error);
      throw error;
    }
  }
}