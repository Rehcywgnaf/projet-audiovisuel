export interface Template {
  id: string;
  name: string;
  type: 'AAP' | 'AO';
  structure: TemplateStructure;
  metadata: TemplateMetadata;
}

export interface TemplateStructure {
  sections: TemplateSectionDefinition[];
  requiredFields: RequiredField[];
}

export interface TemplateSectionDefinition {
  id: string;
  title: string;
  required: boolean;
  minWords?: number;
  maxWords?: number;
  suggestions?: string[];
}

export interface RequiredField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'list';
  validation?: string;
}

export interface TemplateMetadata {
  createdAt: Date;
  lastModified: Date;
  version: string;
  tags: string[];
  aiFeatures?: AIFeature[];
}

export interface AIFeature {
  type: 'suggestion' | 'requirement' | 'reference';
  source: string;
  field: string;
  description: string;
}