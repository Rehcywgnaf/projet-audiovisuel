describe('SAPAV - Template Management', () => {
  beforeEach(() => {
    // Configuration initiale
    cy.intercept('GET', '/api/templates', { fixture: 'templates-list.json' }).as('getTemplates');
    cy.intercept('POST', '/api/ai/analyze', { fixture: 'ai-suggestions.json' }).as('getAISuggestions');
    cy.visit('/dashboard/templates');
  });

  // Test de création de template depuis un AAP
  describe('Création de template', () => {
    it('devrait créer un template depuis un AAP analysé', () => {
      cy.get('[data-cy=aap-list]').first().click();
      cy.wait('@getAISuggestions');
      cy.get('[data-cy=create-template]').click();
      cy.get('[data-cy=template-name]').type('AAP Documentaire 2025');
      cy.get('[data-cy=save]').click();
      cy.get('[data-cy=success-message]')
        .should('exist')
        .and('contain', 'Template créé');
    });
  });

  // Test de génération de sections
  describe('Génération de sections', () => {
    it('devrait suggérer les sections appropriées', () => {
      cy.get('[data-cy=new-template]').click();
      cy.get('[data-cy=project-type]').select('documentaire');
      cy.get('[data-cy=suggested-sections]').within(() => {
        cy.contains('Note d\'intention').should('exist');
        cy.contains('Budget').should('exist');
      });
    });
  });

  // Test de synchronisation Drive
  describe('Synchronisation Drive', () => {
    it('devrait synchroniser avec Google Drive', () => {
      cy.get('[data-cy=sync-status]').should('contain', 'Synchronisé');
      cy.get('[data-cy=template-list]').first().click();
      cy.get('[data-cy=edit]').click();
      cy.get('[data-cy=content]').type('Nouvelle section');
      cy.get('[data-cy=save]').click();
      cy.get('[data-cy=sync-status]')
        .should('contain', 'Synchronisation en cours')
        .and('contain', 'Synchronisé', { timeout: 5000 });
    });
  });

  // Test de gestion des erreurs
  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de synchronisation', () => {
      cy.intercept('POST', '/api/drive/sync', {
        statusCode: 500,
        body: { error: 'Erreur sync' }
      }).as('syncError');
      cy.get('[data-cy=force-sync]').click();
      cy.get('[data-cy=error-message]')
        .should('exist')
        .and('contain', 'Erreur de synchronisation');
    });
  });
});