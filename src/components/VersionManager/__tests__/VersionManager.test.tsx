import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import VersionManager from './VersionManager';

jest.useFakeTimers();

describe('VersionManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le titre correct', () => {
      render(<VersionManager />);
      expect(screen.getByText('Gestionnaire de Versions')).toBeInTheDocument();
    });
  });
});