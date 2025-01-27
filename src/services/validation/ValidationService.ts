type ValidationRule = {
  test: (value: any) => boolean;
  message: string;
};

type ValidationSchema = {
  [key: string]: ValidationRule[];
};

export class ValidationService {
  private static instance: ValidationService;
  private schemas: Map<string, ValidationSchema> = new Map();

  private constructor() {
    this.initializeSchemas();
  }

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  private initializeSchemas(): void {
    // Schéma de validation pour les membres d'équipe
    this.schemas.set('teamMember', {
      name: [
        {
          test: (value) => typeof value === 'string' && value.length >= 2,
          message: 'Le nom doit contenir au moins 2 caractères'
        },
        {
          test: (value) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(value),
          message: 'Le nom ne doit contenir que des lettres'
        }
      ],
      role: [
        {
          test: (value) => typeof value === 'string' && value.length > 0,
          message: 'Le rôle est requis'
        }
      ],
      availability: [
        {
          test: (value) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= 0 && num <= 100;
          },
          message: 'La disponibilité doit être entre 0 et 100%'
        }
      ]
    });
  }

  validate(schemaName: string, data: any): { isValid: boolean; errors: { [key: string]: string[] } } {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }

    const errors: { [key: string]: string[] } = {};
    let isValid = true;

    Object.entries(schema).forEach(([field, rules]) => {
      const fieldErrors = rules
        .filter(rule => !rule.test(data[field]))
        .map(rule => rule.message);

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  addSchema(name: string, schema: ValidationSchema): void {
    this.schemas.set(name, schema);
  }

  getSchema(name: string): ValidationSchema | undefined {
    return this.schemas.get(name);
  }
}