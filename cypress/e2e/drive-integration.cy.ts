describe('DriveIntegration E2E', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/drive/metrics', {
      hitRate: 98,
      size: 100,
      lastCleared: new Date().toISOString()
    }).as('getMetrics');

    cy.intercept('GET', '/api/ai/suggestions', {
      suggestions: ['Suggestion 1', 'Suggestion 2']
    }).as('getSuggestions');

    cy.visit('/drive-integration');
  });

  it('loads and displays correctly', () => {
    cy.get('h2').should('contain', 'Intégration Google Drive');
    cy.wait('@getMetrics');
    cy.wait('@getSuggestions');
    
    // Vérifie l'affichage des métriques
    cy.get('[data-testid="hit-rate"]').should('contain', '98.0%');
    cy.get('[data-testid="cache-size"]').should('contain', '100 items');
  });

  it('handles synchronization process', () => {
    cy.intercept('POST', '/api/drive/sync', {
      statusCode: 200,
      body: { status: 'success' }
    }).as('sync');

    cy.get('[data-testid="sync-button"]').click();
    cy.wait('@sync');
    
    cy.get('[data-testid="sync-status"]')
      .should('contain', 'Synchronisation terminée');
  });

  it('displays AI suggestions', () => {
    cy.wait('@getSuggestions');
    
    cy.get('[data-testid="ai-suggestions"]')
      .should('contain', 'Suggestion 1')
      .and('contain', 'Suggestion 2');
  });

  it('maintains performance targets', () => {
    cy.window().then((win) => {
      const start = win.performance.now();
      
      cy.get('[data-testid="drive-integration"]').should(() => {
        const end = win.performance.now();
        expect(end - start).to.be.lessThan(200);
      });
    });
  });

  it('handles error states gracefully', () => {
    cy.intercept('POST', '/api/drive/sync', {
      statusCode: 500,
      body: { error: 'Test error message' }
    }).as('syncError');

    cy.get('[data-testid="sync-button"]').click();
    cy.wait('@syncError');
    
    cy.get('[data-testid="error-alert"]')
      .should('contain', 'Test error message');
  });

  it('updates cache metrics in real-time', () => {
    const initialMetrics = {
      hitRate: 98,
      size: 100,
      lastCleared: new Date().toISOString()
    };

    const updatedMetrics = {
      hitRate: 99,
      size: 110,
      lastCleared: new Date().toISOString()
    };

    cy.intercept('GET', '/api/drive/metrics', initialMetrics).as('getInitialMetrics');
    
    cy.wait('@getInitialMetrics');
    cy.get('[data-testid="hit-rate"]').should('contain', '98.0%');

    // Simulate metrics update
    cy.intercept('GET', '/api/drive/metrics', updatedMetrics).as('getUpdatedMetrics');
    
    cy.wait('@getUpdatedMetrics');
    cy.get('[data-testid="hit-rate"]').should('contain', '99.0%');
  });

  it('validates permissions before sync', () => {
    cy.intercept('GET', '/api/drive/permissions', {
      statusCode: 403,
      body: { error: 'Permissions insuffisantes' }
    }).as('checkPermissions');

    cy.get('[data-testid="sync-button"]').click();
    cy.wait('@checkPermissions');
    
    cy.get('[data-testid="error-alert"]')
      .should('contain', 'Permissions insuffisantes');
  });
});