import { DriveService } from '../services/DriveService';
import { CacheService } from '../services/CacheService';
import { MetricsService } from '../services/MetricsService';

interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  processingTime: number;
  cacheHit: boolean;
}

interface DocumentMetadata {
  id: string;
  lastModified: Date;
  validationFrequency: number;
}

export class OptimizedDocumentValidator {
  private driveService: DriveService;
  private cacheService: CacheService;
  private metricsService: MetricsService;
  private preloadQueue: Set<string> = new Set();

  constructor() {
    this.driveService = new DriveService();
    this.cacheService = new CacheService();
    this.metricsService = new MetricsService();
  }

  async validateDocuments(documentIds: string[]): Promise<Map<string, ValidationResult>> {
    const startTime = performance.now();
    const results = new Map<string, ValidationResult>();
    
    const { cachedDocs, uncachedDocs } = await this.segregateDocuments(documentIds);
    
    const cachedResults = await this.processCachedDocuments(cachedDocs);
    cachedResults.forEach((result, id) => results.set(id, result));
    
    if (uncachedDocs.length > 0) {
      const uncachedResults = await this.processUncachedDocuments(uncachedDocs);
      uncachedResults.forEach((result, id) => results.set(id, result));
    }
    
    this.updateMetrics(results, performance.now() - startTime);
    
    return results;
  }

  async preloadFrequentDocuments(): Promise<void> {
    const frequentDocs = await this.getFrequentDocuments();
    for (const doc of frequentDocs) {
      if (!this.preloadQueue.has(doc.id)) {
        this.preloadQueue.add(doc.id);
        this.preloadDocument(doc).catch(console.error);
      }
    }
  }

  private async segregateDocuments(documentIds: string[]): Promise<{
    cachedDocs: string[],
    uncachedDocs: string[]
  }> {
    const cachedDocs: string[] = [];
    const uncachedDocs: string[] = [];
    
    await Promise.all(documentIds.map(async id => {
      const isCached = await this.cacheService.has(id);
      (isCached ? cachedDocs : uncachedDocs).push(id);
    }));
    
    return { cachedDocs, uncachedDocs };
  }

  private async processCachedDocuments(docIds: string[]): Promise<Map<string, ValidationResult>> {
    const results = new Map();
    
    await Promise.all(docIds.map(async id => {
      const cached = await this.cacheService.get(id);
      results.set(id, {
        ...cached,
        cacheHit: true,
        processingTime: 0
      });
    }));
    
    return results;
  }

  private async processUncachedDocuments(docIds: string[]): Promise<Map<string, ValidationResult>> {
    const results = new Map();
    const batchSize = 5;
    
    for (let i = 0; i < docIds.length; i += batchSize) {
      const batch = docIds.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(id => this.validateSingle(id)));
      
      batchResults.forEach((result, index) => {
        results.set(batch[index], result);
      });
    }
    
    return results;
  }

  private async validateSingle(documentId: string): Promise<ValidationResult> {
    const startTime = performance.now();
    
    try {
      const document = await this.driveService.getDocument(documentId);
      const validationResult = await this.performValidation(document);
      
      await this.cacheService.set(documentId, validationResult);
      
      return {
        ...validationResult,
        cacheHit: false,
        processingTime: performance.now() - startTime
      };
    } catch (error) {
      console.error(`Validation failed for document ${documentId}:`, error);
      return {
        isValid: false,
        errors: [`Validation failed: ${error.message}`],
        cacheHit: false,
        processingTime: performance.now() - startTime
      };
    }
  }

  private async updateMetrics(results: Map<string, ValidationResult>, totalTime: number): Promise<void> {
    const metrics = {
      totalDocuments: results.size,
      cacheHits: Array.from(results.values()).filter(r => r.cacheHit).length,
      averageProcessingTime: totalTime / results.size,
      errors: Array.from(results.values()).filter(r => !r.isValid).length
    };
    
    await this.metricsService.updateValidationMetrics(metrics);
  }

  private async getFrequentDocuments(): Promise<DocumentMetadata[]> {
    const validationStats = await this.metricsService.getValidationFrequency();
    return validationStats
      .filter(doc => doc.validationFrequency > 5)
      .slice(0, 20);
  }

  private async preloadDocument(doc: DocumentMetadata): Promise<void> {
    try {
      const document = await this.driveService.getDocument(doc.id);
      const validationResult = await this.performValidation(document);
      await this.cacheService.set(doc.id, validationResult);
    } finally {
      this.preloadQueue.delete(doc.id);
    }
  }

  private async performValidation(document: any): Promise<Omit<ValidationResult, 'cacheHit' | 'processingTime'>> {
    return {
      isValid: true,
      errors: []
    };
  }
}