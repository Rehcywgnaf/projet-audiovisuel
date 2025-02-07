import AIServiceManager from '@/lib/AIServiceManager';
import { Project } from '@/components/EnhancedProjectList';

export class ProjectService {
  private aiManager: AIServiceManager;

  constructor() {
    this.aiManager = AIServiceManager.getInstance();
  }

  async getProjects(): Promise<Project[]> {
    try {
      // Utilisation du service IA pour générer/récupérer les projets
      const response = await this.aiManager.processRequest('project-generator', 'list', {
        priority: 'high',
        cache: true
      });

      if (response.success && response.data) {
        // Transformation des données de réponse en projets
        return this.transformProjects(response.data);
      }

      // Projets par défaut si la génération échoue
      return this.getDefaultProjects();
    } catch (error) {
      console.error('Erreur lors de la récupération des projets', error);
      return this.getDefaultProjects();
    }
  }

  async getProjectStats() {
    try {
      const response = await this.aiManager.processRequest('project-stats', 'calculate', {
        priority: 'medium',
        cache: true
      });

      if (response.success && response.data) {
        return {
          totalProjects: response.data.total || 0,
          activeProjects: response.data.active || 0,
          completedProjects: response.data.completed || 0
        };
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