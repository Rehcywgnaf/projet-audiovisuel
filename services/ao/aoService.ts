import { AOSubmission } from './types';

class AOService {
  async createSubmission(data: Partial<AOSubmission>): Promise<AOSubmission> {
    // Implementation à venir
    throw new Error('Not implemented');
  }

  async updateSubmission(id: string, data: Partial<AOSubmission>): Promise<AOSubmission> {
    // Implementation à venir
    throw new Error('Not implemented');
  }

  async getSubmission(id: string): Promise<AOSubmission> {
    // Implementation à venir
    throw new Error('Not implemented');
  }

  async listSubmissions(filters?: {
    status?: AOSubmission['status'];
    fromDate?: Date;
    toDate?: Date;
  }): Promise<AOSubmission[]> {
    // Implementation à venir
    throw new Error('Not implemented');
  }
}

export const aoService = new AOService();