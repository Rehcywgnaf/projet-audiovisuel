import { brave_web_search } from '@/lib/search';

type TagFrequency = {
  tag: string;
  frequency: number;
  lastSeen: Date;
};

export class TagLearningService {
  private knownTags: Set<string>;
  private tagFrequencies: Map<string, TagFrequency>;

  constructor(initialTags: string[]) {
    this.knownTags = new Set(initialTags);
    this.tagFrequencies = new Map();
  }

  async analyzeNewContent(text: string) {
    const potentialTags = this.extractPotentialTags(text);
    
    for (const tag of potentialTags) {
      if (!this.knownTags.has(tag)) {
        const frequency = this.tagFrequencies.get(tag) || {
          tag,
          frequency: 0,
          lastSeen: new Date()
        };
        
        frequency.frequency++;
        frequency.lastSeen = new Date();
        this.tagFrequencies.set(tag, frequency);

        // Ajouter aux tags connus si vu fréquemment
        if (frequency.frequency > 3) {
          this.knownTags.add(tag);
        }
      }
    }
  }

  private extractPotentialTags(text: string): string[] {
    // Mots clés spécifiques au domaine audiovisuel
    const keywords = [
      'documentaire', 'fiction', 'animation',
      'court-métrage', 'long-métrage', 'web-série',
      'expérimental', 'transmedia', 'réalité virtuelle',
      'podcast', 'jeunesse', 'patrimoine'
    ];

    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getKnownTags(): string[] {
    return Array.from(this.knownTags);
  }
}
