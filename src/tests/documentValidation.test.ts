import { renderHook, act } from '@testing-library/react-hooks';
import { useDocumentValidation } from '../hooks/useDocumentValidation';

describe('useDocumentValidation', () => {
  const mockValidDocument = {
    name: 'test.pdf',
    size: 5 * 1024 * 1024, // 5MB
    content: 'x'.repeat(200),
    metadata: {
      title: 'Test Document',
      author: 'John Doe',
      project: 'SAPAV',
      version: '1.0'
    }
  };

  test('validates correct document successfully', async () => {
    const { result } = renderHook(() => useDocumentValidation());
    
    await act(async () => {
      const validationResult = await result.current.validateDocument(mockValidDocument);
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });
  });

  test('detects invalid file format', async () => {
    const { result } = renderHook(() => useDocumentValidation());
    const invalidDocument = {
      ...mockValidDocument,
      name: 'test.xyz'
    };

    await act(async () => {
      const validationResult = await result.current.validateDocument(invalidDocument);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors[0].type).toBe('format');
    });
  });

  test('detects file size exceeding limit', async () => {
    const { result } = renderHook(() => useDocumentValidation());
    const largeDocument = {
      ...mockValidDocument,
      size: 15 * 1024 * 1024 // 15MB
    };

    await act(async () => {
      const validationResult = await result.current.validateDocument(largeDocument);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors[0].type).toBe('size');
    });
  });
});