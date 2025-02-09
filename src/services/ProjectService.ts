import AIServiceManager, { AIRequestType } from '@/lib/AIServiceManager';
import { Project } from '@/components/EnhancedProjectList';

export class ProjectService {
  private aiManager: AIServiceManager;

  constructor() {
    this.aiManager = AIServiceManager.getInstance();
  }

  async getProjects(): Promise<Project[]> {
    try {
      // Vérification côté serveur uniquement
      if (typeof window === 'undefined') {
        const response = await this.aiManager.generateContent({
          type: AIRequestType.PROJECT_SUMMARY,
          messages: [
            { role: 'user', content: 'Generate a list of active audiovisual projects' }
          ],
          maxTokens: 1000
        });

        if (response?.content) {
          // Transformation des données de réponse en projets
          return this.transformProjects(JSON.parse(response.content));
        }
      }

      // Projets par défaut si la génération échoue ou côté client
      return this.getDefaultProjects();
    } catch (error) {
      console.error('Erreur lors de la récupération des projets', error);
      return this.getDefaultProjects();
    }
  }

  async getProjectStats() {
    try {
      // Vérification côté serveur uniquement
      if (typeof window === 'undefined') {
        const response = await this.aiManager.generateContent({
          type: AIRequestType.PROJECT_SUMMARY,
          messages: [
            { role: 'user', content: 'Calculate project statistics: total, active, completed' }
          ],
          maxTokens: 500
        });

        if (response?.content) {
          const stats = JSON.parse(response.content);
          return {
            totalProjects: stats.total || 0,
            activeProjects: stats.active || 0,
            completedProjects: stats.completed || 0
          };
        }
      }

      // Statistiques par défaut
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques', error);
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0
      };
    }
  }

  private transformProjects(data: any): Project[] {
    // Logique de transformation des données IA en projets
    return data?.projects?.map((proj: any) => ({
      id: proj.id || String(Math.random()),
      title: proj.title || 'Projet sans titre',
      organization: proj.organization || 'Organisation non spécifiée',
      status: proj.status || 'pending',
      updatedAt: proj.updatedAt || new Date().toISOString(),
      progress: proj.progress,
      budget: proj.budget,
      deadline: proj.deadline
    })) || [];
  }

  private getDefaultProjects(): Project[] {
    return [
      {
        id: '1',
        title: 'Documentaire Nature',
        organization: 'CNC',
        status: 'active',
        updatedAt: new Date().toISOString(),
        progress: 60,
        budget: 50000,
        deadline: '2024-12-31'
      },
      {
        id: '2',
        title: 'Web-série Innovation',
        organization: 'Région',
        status: 'pending',
        updatedAt: new Date().toISOString(),
        progress: 30,
        budget: 75000,
        deadline: '2025-06-30'
      }
    ];
  }
}

export const projectService = new ProjectService();