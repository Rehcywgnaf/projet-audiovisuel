describe('SAPAV - Integration Template-Document', () => {
  beforeEach(() => {
    // Mocks nécessaires
    cy.intercept('GET', '/api/templates/active', { fixture: 'active-templates.json' }).as('getTemplates');
    cy.intercept('GET', '/api/documents/drafts', { fixture: 'document-drafts.json' }).as('getDrafts');
    cy.intercept('POST', '/api/documents/create', { fixture: 'new-document.json' }).as('createDocument');
    
    // Visite de la page
    cy.visit('/dashboard/document-creation');
  });

  describe('Création Document depuis Template', () => {
    it('devrait créer un document à partir d\'un template', () => {
      cy.get('[data-cy=template-list]')
        .contains('AAP Documentaire Standard')
        .click();

      cy.get('[data-cy=document-sections]').within(() => {
        cy.contains('Note d\'intention').should('exist');
        cy.contains('Budget').should('exist');
      });

      cy.get('[data-cy=doc-title]').type('Projet Documentaire 2025');
      cy.get('[data-cy=doc-desc]').type('Description du projet');
      cy.get('[data-cy=create-doc]').click();
      cy.wait('@createDocument');

      cy.get('[data-cy=success-message]')
        .should('exist')
        .and('contain', 'Document créé');
    });
  });

  describe('Validation des Champs Requis', () => {
    it('devrait valider les sections obligatoires', () => {
      cy.get('[data-cy=template-list]').first().click();
      cy.get('[data-cy=create-doc]').click();

      cy.get('[data-cy=required-fields-error]').should('be.visible');
      cy.get('[data-cy=required-section]').should('have.length.at.least', 1);
    });
  });

  describe('Synchronisation Document-Template', () => {
    it('devrait maintenir la cohérence template-document', () => {
      cy.get('[data-cy=template-list]').first().click();
      cy.get('[data-cy=template-edit]').click();
      cy.get('[data-cy=add-section]').click();
      cy.get('[data-cy=section-name]').type('Impact Social');
      cy.get('[data-cy=save-template]').click();

      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=doc-sections]')
        .should('contain', 'Impact Social');
    });

    it('devrait gérer les conflits de version', () => {
      cy.intercept('POST', '/api/documents/update', {
        statusCode: 409,
        body: {
          error: 'Version conflict',
          currentVersion: '1.2'
        }
      }).as('versionConflict');

      cy.get('[data-cy=template-list]').first().click();
      cy.get('[data-cy=edit-content]').click();
      cy.get('[data-cy=save-changes]').click();

      cy.get('[data-cy=version-conflict-dialog]').should('be.visible');
      cy.get('[data-cy=resolve-conflict]').should('exist');
    });
  });

  describe('Gestion des Versions', () => {
    it('devrait maintenir l\'historique des versions', () => {
      cy.get('[data-cy=template-list]').first().click();
      cy.get('[data-cy=edit-content]').click();
      cy.get('[data-cy=doc-content]').type('Nouveau contenu test');
      cy.get('[data-cy=save-version]').click();

      cy.get('[data-cy=version-history]').click();
      cy.get('[data-cy=version-list]')
        .should('have.length.at.least', 2);

      cy.get('[data-cy=version-details]').first().within(() => {
        cy.get('[data-cy=version-number]').should('exist');
        cy.get('[data-cy=version-date]').should('exist');
        cy.get('[data-cy=version-author]').should('exist');
      });
    });
  });

  describe('Export et Formats', () => {
    it('devrait exporter dans différents formats', () => {
      cy.get('[data-cy=doc-list]').first().click();
      cy.get('[data-cy=export-menu]').click();

      cy.get('[data-cy=export-options]').within(() => {
        cy.contains('PDF').should('exist');
        cy.contains('Word').should('exist');
        cy.contains('Google Doc').should('exist');
      });

      cy.get('[data-cy=export-pdf]').click();
      cy.get('[data-cy=export-status]')
        .should('contain', 'Export réussi');
    });
  });
});