// formatManager.js
export class FormatManager {
  static supportedFormats = {
    docx: {
      name: 'Word Document',
      extension: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      editable: true,
      preview: true,
      maxSize: 25 * 1024 * 1024 // 25MB
    },
    pdf: {
      name: 'PDF Document',
      extension: '.pdf',
      mimeType: 'application/pdf',
      editable: false,
      preview: true,
      maxSize: 50 * 1024 * 1024 // 50MB
    },
    gdoc: {
      name: 'Google Document',
      extension: '.gdoc',
      mimeType: 'application/vnd.google-apps.document',
      editable: true,
      preview: true,
      maxSize: 10 * 1024 * 1024 // 10MB
    },
    html: {
      name: 'Web Page',
      extension: '.html',
      mimeType: 'text/html',
      editable: true,
      preview: true,
      maxSize: 5 * 1024 * 1024 // 5MB
    }
  };

  static getFormatInfo(format) {
    return this.supportedFormats[format];
  }

  static isSupported(format) {
    return !!this.supportedFormats[format];
  }

  static isEditable(format) {
    return this.supportedFormats[format]?.editable || false;
  }

  static validateFormat(format, file) {
    const formatInfo = this.getFormatInfo(format);
    if (!formatInfo) {
      return { valid: false, error: 'Format non supporté' };
    }

    // Vérification de la taille
    if (file.size > formatInfo.maxSize) {
      return {
        valid: false,
        error: `Taille maximum dépassée (${formatInfo.maxSize / (1024 * 1024)}MB)`
      };
    }

    // Vérification du type MIME
    if (file.type !== formatInfo.mimeType) {
      return { valid: false, error: 'Type de fichier incorrect' };
    }

    return { valid: true };
  }

  static getConversionPath(sourceFormat, targetFormat) {
    if (!this.isSupported(sourceFormat) || !this.isSupported(targetFormat)) {
      throw new Error('Format source ou cible non supporté');
    }

    // Définition des chemins de conversion possibles
    const conversionPaths = {
      docx: {
        pdf: 'direct',
        html: 'direct',
        gdoc: 'via-api'
      },
      gdoc: {
        docx: 'via-api',
        pdf: 'via-api',
        html: 'direct'
      },
      html: {
        pdf: 'direct',
        docx: 'via-parsing',
      }
    };

    return conversionPaths[sourceFormat]?.[targetFormat] || null;
  }

  static async convertFormat(document, sourceFormat, targetFormat) {
    const conversionPath = this.getConversionPath(sourceFormat, targetFormat);
    if (!conversionPath) {
      throw new Error(`Conversion impossible de ${sourceFormat} vers ${targetFormat}`);
    }

    try {
      switch (conversionPath) {
        case 'direct':
          return await this.directConversion(document, sourceFormat, targetFormat);
        case 'via-api':
          return await this.apiConversion(document, sourceFormat, targetFormat);
        case 'via-parsing':
          return await this.parsingConversion(document, sourceFormat, targetFormat);
        default:
          throw new Error('Chemin de conversion non supporté');
      }
    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      throw error;
    }
  }

  static async directConversion(document, sourceFormat, targetFormat) {
    const converted = {
      content: document.content,
      metadata: {
        ...document.metadata,
        originalFormat: sourceFormat,
        convertedFormat: targetFormat,
        conversionDate: new Date().toISOString()
      },
      format: targetFormat
    };

    return await this.postProcessConversion(converted, targetFormat);
  }

  static async apiConversion(document, sourceFormat, targetFormat) {
    const converted = {
      content: document.content,
      metadata: {
        ...document.metadata,
        originalFormat: sourceFormat,
        convertedFormat: targetFormat,
        conversionDate: new Date().toISOString(),
        apiVersion: '1.0'
      },
      format: targetFormat
    };

    return await this.postProcessConversion(converted, targetFormat);
  }

  static async parsingConversion(document, sourceFormat, targetFormat) {
    const parsed = await this.parseContent(document.content, sourceFormat);
    const converted = {
      content: parsed,
      metadata: {
        ...document.metadata,
        originalFormat: sourceFormat,
        convertedFormat: targetFormat,
        conversionDate: new Date().toISOString(),
        parsingMethod: 'standard'
      },
      format: targetFormat
    };

    return await this.postProcessConversion(converted, targetFormat);
  }

  static async postProcessConversion(document, targetFormat) {
    switch (targetFormat) {
      case 'pdf':
        return this.postProcessPdf(document);
      case 'docx':
        return this.postProcessDocx(document);
      case 'html':
        return this.postProcessHtml(document);
      case 'gdoc':
        return this.postProcessGoogleDoc(document);
      default:
        return document;
    }
  }

  static async postProcessPdf(document) {
    return {
      ...document,
      metadata: {
        ...document.metadata,
        pdfVersion: '1.7',
        compressed: true
      }
    };
  }

  static async postProcessDocx(document) {
    return {
      ...document,
      metadata: {
        ...document.metadata,
        wordVersion: '2019',
        template: 'standard'
      }
    };
  }

  static async postProcessHtml(document) {
    return {
      ...document,
      metadata: {
        ...document.metadata,
        htmlVersion: '5',
        responsive: true
      }
    };
  }

  static async postProcessGoogleDoc(document) {
    return {
      ...document,
      metadata: {
        ...document.metadata,
        sharing: 'restricted',
        collaboration: true
      }
    };
  }
}
