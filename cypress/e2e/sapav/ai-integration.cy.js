describe('SAPAV - Intégration IA', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/ai/analyze', { fixture: 'ai-analysis.json' }).as('aiAnalyze');
    cy.intercept('POST', '/api/ai/suggestions', { fixture: 'ai-suggestions.json' }).as('aiSuggest');
    cy.intercept('POST', '/api/ai/validate', { fixture: 'ai-validation.json' }).as('aiValidate');
    cy.visit('/dashboard/document-edition');
  });

  describe('Enrichissement des Templates', () => {
    it('devrait suggérer des sections basées sur l\'analyse IA', () => {
      cy.get('[data-cy=aap-list]').first().click();
      cy.wait('@aiAnalyze');

      cy.get('[data-cy=ai-suggestions]').within(() => {
        cy.get('[data-cy=suggested-section]')
          .should('have.length.at.least', 2)
          .first()
          .should('contain', 'Impact Social');
      });

      cy.get('[data-cy=add-suggested-section]').first().click();
      cy.get('[data-cy=template-sections]')
        .should('contain', 'Impact Social');
    });

    it('devrait adapter les sections selon le type de projet', () => {
      cy.get('[data-cy=project-type]').select('documentaire');
      cy.wait('@aiSuggest');

      cy.get('[data-cy=ai-adaptations]').within(() => {
        cy.contains('Note d\'intention').should('exist');
        cy.contains('Traitement').should('exist');
        cy.get('[data-cy=adaptation-reason]')
          .should('contain', 'Recommandé pour les documentaires');
      });
    });
  });

  describe('Validation IA de Contenu', () => {
    it('devrait valider le contenu des sections', () => {
      cy.get('[data-cy=section-content]').type('Contenu de test pour la note d\'intention');
      cy.get('[data-cy=validate-content]').click();
      cy.wait('@aiValidate');

      cy.get('[data-cy=ai-feedback]').within(() => {
        cy.get('[data-cy=content-score]').should('exist');
        cy.get('[data-cy=improvement-suggestions]')
          .should('have.length.at.least', 1);
      });
    });

    it('devrait détecter les incohérences', () => {
      cy.get('[data-cy=section-content]')
        .type('Contenu non pertinent pour cette section');
      cy.get('[data-cy=validate-content]').click();

      cy.get('[data-cy=ai-warnings]')
        .should('contain', 'Contenu potentiellement inadapté');
      cy.get('[data-cy=suggestion-fix]').should('be.visible');
    });
  });

  describe('Intégration avec le flux RSS', () => {
    it('devrait enrichir le template avec les données de l\'AAP', () => {
      cy.intercept('GET', '/api/rss/aap/*', { fixture: 'aap-details.json' })
        .as('getAAP');

      cy.get('[data-cy=rss-feed]').contains('AAP Documentaire 2025').click();
      cy.wait(['@getAAP', '@aiAnalyze']);

      cy.get('[data-cy=template-content]').within(() => {
        cy.get('[data-cy=budget-suggestion]')
          .should('contain', '150000');
        cy.get('[data-cy=deadline-info]')
          .should('contain', '2025-03-01');
      });
    });
  });

  describe('Gestion des Erreurs IA', () => {
    it('devrait gérer l\'indisponibilité du service', () => {
      cy.intercept('POST', '/api/ai/analyze', {
        statusCode: 503,
        body: { error: 'Service unavailable' }
      }).as('aiError');

      cy.get('[data-cy=analyze-content]').click();

      cy.get('[data-cy=ai-error-message]')
        .should('contain', 'Service IA temporairement indisponible');
      cy.get('[data-cy=manual-mode-switch]')
        .should('be.visible')
        .click();

      cy.get('[data-cy=manual-edit-mode]')
        .should('be.visible');
    });

    it('devrait proposer des alternatives en cas d\'erreur', () => {
      cy.intercept('POST', '/api/ai/suggestions', {
        body: { error: 'Partial results', suggestions: [] }
      }).as('aiPartial');

      cy.get('[data-cy=get-suggestions]').click();

      cy.get('[data-cy=alternative-suggestions]')
        .should('be.visible')
        .and('contain', 'Suggestions basées sur les modèles précédents');
    });
  });

  describe('Feedback et Apprentissage', () => {
    it('devrait collecter le feedback utilisateur', () => {
      cy.get('[data-cy=ai-suggestion]').first()
        .as('suggestion')
        .click();

      cy.get('[data-cy=feedback-useful]').click();
      cy.get('[data-cy=feedback-reason]')
        .type('Suggestion pertinente pour le contexte');
      cy.get('[data-cy=submit-feedback]').click();

      cy.get('@suggestion')
        .should('have.class', 'feedback-submitted');
    });
  });
});