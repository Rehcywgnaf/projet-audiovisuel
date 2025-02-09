import { LoggingService } from '@/lib/LoggingService';
import AIServiceManager, { AIInteractionType } from '@/lib/AIServiceManager';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: number; // Pourcentage
  currentProjects: string[];
  nextAvailable: string;
}

export interface TeamAllocation {
  projectId: string;
  projectName: string;
  requiredSkills: string[];
  recommendedMembers: TeamMember[];
}

export class TeamService {
  private static instance: TeamService;
  private loggingService: LoggingService;
  private aiServiceManager: AIServiceManager;

  private teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      role: 'Réalisateur',
      skills: ['documentaire', 'nature', 'environnement'],
      availability: 60,
      currentProjects: ['Documentaire Nature'],
      nextAvailable: '15 Feb 2024'
    },
    {
      id: '2',
      name: 'Marie Martin',
      role: 'Cadreur',
      skills: ['web-série', 'innovation', 'technique'],
      availability: 100,
      currentProjects: [],
      nextAvailable: 'Immédiatement'
    }
  ];

  private constructor() {
    this.loggingService = LoggingService.getInstance();
    this.aiServiceManager = AIServiceManager.getInstance();
  }

  public static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return this.teamMembers;
  }

  async allocateTeamForProject(project: { id: string; name: string; requiredSkills: string[] }): Promise<TeamAllocation> {
    try {
      const response = await this.aiServiceManager.generateContent({
        type: AIInteractionType.RESOURCE_ALLOCATION,
        messages: [
          { 
            role: 'user', 
            content: `Optimize team allocation for project:\n
            Project: ${project.name}
            Required Skills: ${project.requiredSkills.join(', ')}
            Available Team Members: ${JSON.stringify(this.teamMembers)}
            
            Provide recommended team members, considering skills match, availability, and current workload.`
          }
        ],
        maxTokens: 500
      });

      const allocation = JSON.parse(response.content);

      return {
        projectId: project.id,
        projectName: project.name,
        requiredSkills: project.requiredSkills,
        recommendedMembers: allocation.recommendedMembers.map((memberId: string) => 
          this.teamMembers.find(m => m.id === memberId)
        ).filter(Boolean)
      };
    } catch (error) {
      this.loggingService.error('Team Allocation Error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });

      // Allocation par défaut si l'IA échoue
      return {
        projectId: project.id,
        projectName: project.name,
        requiredSkills: project.requiredSkills,
        recommendedMembers: this.teamMembers
          .filter(member => 
            member.availability > 50 && 
            project.requiredSkills.some(skill => 
              member.skills.includes(skill)
            )
          )
      };
    }
  }

  async updateTeamMemberAvailability(memberId: string, newAvailability: number): Promise<TeamMember | null> {
    const memberIndex = this.teamMembers.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) return null;

    this.teamMembers[memberIndex].availability = newAvailability;
    
    return this.teamMembers[memberIndex];
  }
}

export default TeamService;