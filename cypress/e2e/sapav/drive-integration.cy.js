describe('SAPAV - Integration Google Drive', () => {
  beforeEach(() => {
    // Configuration des mocks Drive
    cy.intercept('GET', '/api/drive/files*', { fixture: 'drive-files.json' }).as('getDriveFiles');
    cy.intercept('POST', '/api/drive/upload', { fixture: 'upload-response.json' }).as('uploadFile');
    cy.intercept('GET', '/api/drive/permissions*', { fixture: 'drive-permissions.json' }).as('getPermissions');
    
    cy.visit('/dashboard/documents');
  });

  describe('Synchronisation des Documents', () => {
    it('devrait synchroniser automatiquement les modifications', () => {
      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=edit-content]').click();
      cy.get('[data-cy=document-editor]')
        .type('Nouvelle modification test');

      cy.get('[data-cy=sync-status]')
        .should('contain', 'Synchronisation...')
        .and('contain', 'Synchronisé', { timeout: 5000 });
      
      cy.wait('@uploadFile')
        .its('request.body')
        .should('contain', 'Nouvelle modification test');
    });

    it('devrait gérer les conflits de modification', () => {
      cy.intercept('POST', '/api/drive/upload', {
        statusCode: 409,
        body: {
          error: 'Conflict',
          serverVersion: '2.0',
          serverContent: 'Contenu du serveur'
        }
      }).as('uploadConflict');

      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=edit-content]').type('Modification locale');
      cy.get('[data-cy=save-changes]').click();

      cy.get('[data-cy=conflict-dialog]').should('be.visible');
      cy.get('[data-cy=local-version]').should('contain', 'Modification locale');
      cy.get('[data-cy=server-version]').should('contain', 'Contenu du serveur');
      cy.get('[data-cy=merge-changes]').should('exist');
    });
  });

  describe('Gestion des Permissions', () => {
    it('devrait gérer les permissions d\'accès', () => {
      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=share-button]').click();

      cy.get('[data-cy=add-collaborator]').click();
      cy.get('[data-cy=email-input]').type('collaborateur@test.com');
      cy.get('[data-cy=role-select]').select('editor');
      cy.get('[data-cy=confirm-share]').click();

      cy.wait('@getPermissions');
      cy.get('[data-cy=collaborators-list]')
        .should('contain', 'collaborateur@test.com')
        .and('contain', 'Éditeur');
    });

    it('devrait appliquer les restrictions d\'accès', () => {
      cy.intercept('GET', '/api/drive/permissions*', {
        body: {
          role: 'viewer',
          canEdit: false
        }
      }).as('viewerPermissions');

      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=edit-content]').should('be.disabled');
      cy.get('[data-cy=share-button]').should('not.exist');
    });
  });

  describe('Sauvegarde et Versions', () => {
    it('devrait créer des versions automatiquement', () => {
      cy.intercept('POST', '/api/drive/versions', {
        body: { version: '1.1', timestamp: new Date().toISOString() }
      }).as('createVersion');

      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=edit-content]').type('Modification importante');
      cy.get('[data-cy=save-changes]').click();

      cy.wait('@createVersion');
      cy.get('[data-cy=version-number]')
        .should('contain', '1.1');
    });

    it('devrait permettre la restauration de versions', () => {
      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=version-history]').click();

      cy.get('[data-cy=version-list]')
        .contains('1.0')
        .click();
      cy.get('[data-cy=restore-version]').click();

      cy.get('[data-cy=success-message]')
        .should('contain', 'Version 1.0 restaurée');
    });
  });

  describe('Gestion Hors-ligne', () => {
    it('devrait gérer le mode hors-ligne', () => {
      cy.intercept('POST', '/api/drive/**', {
        forceNetworkError: true
      }).as('networkError');

      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=edit-content]').type('Modification hors-ligne');

      cy.get('[data-cy=offline-indicator]').should('be.visible');
      cy.get('[data-cy=pending-changes]').should('exist');

      cy.intercept('POST', '/api/drive/**', {
        statusCode: 200,
        body: { status: 'synced' }
      }).as('syncRestore');

      cy.get('[data-cy=connection-restored]')
        .should('contain', 'Modifications synchronisées');
    });

    it('devrait gérer les conflits hors-ligne', () => {
      cy.intercept('POST', '/api/drive/**', {
        forceNetworkError: true
      }).as('networkError');

      cy.get('[data-cy=document-list]').first().click();
      cy.get('[data-cy=edit-content]').type('Modifications locales');

      cy.intercept('POST', '/api/drive/sync', {
        statusCode: 409,
        body: {
          error: 'Offline conflict',
          serverChanges: ['Modifications serveur']
        }
      }).as('syncConflict');

      cy.get('[data-cy=offline-conflict-dialog]')
        .should('contain', 'Modifications locales')
        .and('contain', 'Modifications serveur');
      cy.get('[data-cy=resolve-offline-conflict]').should('exist');
    });
  });
});