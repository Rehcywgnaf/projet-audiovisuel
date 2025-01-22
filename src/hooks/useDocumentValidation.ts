import { useState, useCallback } from 'react';

export const useDocumentValidation = () => {
  const [validationState, setValidationState] = useState({
    fileFormat: false,
    fileSize: false,
    content: false,
    metadata: false
  });

  const [errors, setErrors] = useState([]);

  const validationRules = {
    acceptedFormats: ['doc', 'docx', 'pdf', 'odt'],
    maxSize: 10 * 1024 * 1024, // 10MB
    requiredMetadata: ['title', 'author', 'project', 'version'],
    contentRules: {
      minLength: 100,
      maxLength: 1000000,
      requiredSections: ['introduction', 'content', 'conclusion']
    }
  };

  const validateDocument = useCallback(async (document) => {
    const newErrors = [];
    const newState = { ...validationState };

    try {
      // Format validation
      const extension = document.name.split('.').pop().toLowerCase();
      newState.fileFormat = validationRules.acceptedFormats.includes(extension);
      if (!newState.fileFormat) {
        newErrors.push({
          type: 'format',
          message: `Format non supporté: ${extension}. Formats acceptés: ${validationRules.acceptedFormats.join(', ')}`
        });
      }

      // Size validation
      newState.fileSize = document.size <= validationRules.maxSize;
      if (!newState.fileSize) {
        newErrors.push({
          type: 'size',
          message: `Taille du fichier trop importante: ${Math.round(document.size/1024/1024)}MB (max: ${Math.round(validationRules.maxSize/1024/1024)}MB)`
        });
      }

      // Content validation
      const contentValid = await validateContent(document);
      newState.content = contentValid.isValid;
      if (!contentValid.isValid) {
        newErrors.push(...contentValid.errors);
      }

      // Metadata validation
      const metadataValid = validateMetadata(document.metadata);
      newState.metadata = metadataValid.isValid;
      if (!metadataValid.isValid) {
        newErrors.push(...metadataValid.errors);
      }

      setValidationState(newState);
      setErrors(newErrors);

      return {
        isValid: newErrors.length === 0,
        errors: newErrors,
        state: newState
      };
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      return {
        isValid: false,
        errors: [{
          type: 'system',
          message: 'Erreur système lors de la validation'
        }],
        state: validationState
      };
    }
  }, [validationState]);

  return {
    validationState,
    errors,
    validateDocument,
    validationRules
  };
};

export default useDocumentValidation;