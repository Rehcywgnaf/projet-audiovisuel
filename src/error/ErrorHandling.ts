type ErrorCode = 
  | 'DRIVE_INIT_ERROR' 
  | 'FILE_CREATE_ERROR' 
  | 'FILE_READ_ERROR' 
  | 'FILE_UPDATE_ERROR' 
  | 'FILE_DELETE_ERROR'
  | 'METADATA_ERROR'
  | 'OPERATION_ERROR';

class DriveError extends Error {
  code: ErrorCode;
  originalError?: Error;

  constructor(code: ErrorCode, message: string, originalError?: Error) {
    super(message);
    this.code = code;
    this.originalError = originalError;
  }
}

export class ErrorHandling {
  private static instance: ErrorHandling;

  private constructor() {}

  static getInstance(): ErrorHandling {
    if (!ErrorHandling.instance) {
      ErrorHandling.instance = new ErrorHandling();
    }
    return ErrorHandling.instance;
  }

  handleError(code: ErrorCode, error: Error | unknown): DriveError {
    let message: string;
    
    switch (code) {
      case 'DRIVE_INIT_ERROR':
        message = 'Erreur lors de l\'initialisation de Google Drive';
        break;
      case 'FILE_CREATE_ERROR':
        message = 'Erreur lors de la création du fichier';
        break;
      case 'FILE_READ_ERROR':
        message = 'Erreur lors de la lecture du fichier';
        break;
      case 'FILE_UPDATE_ERROR':
        message = 'Erreur lors de la mise à jour du fichier';
        break;
      case 'FILE_DELETE_ERROR':
        message = 'Erreur lors de la suppression du fichier';
        break;
      case 'METADATA_ERROR':
        message = 'Erreur lors de la récupération des métadonnées';
        break;
      case 'OPERATION_ERROR':
        message = 'Erreur lors de l\'opération sur le fichier';
        break;
      default:
        message = 'Erreur inconnue';
    }

    if (error instanceof Error) {
      return new DriveError(code, `${message}: ${error.message}`, error);
    }
    
    return new DriveError(code, message);
  }
}

export default ErrorHandling;