// cypress/e2e/sapav/rss-ia-flow.cy.js

import { AIServiceManager } from '../../support/mocks/ai-service';
import { RSSSourceManager } from '../../support/mocks/rss-sources';

describe('SAPAV - RSS-IA Flow Tests', () => {
  beforeEach(() => {
    // Configuration des mocks
    cy.intercept('GET', '/api/rss/sources', { fixture: 'rss-sources.json' }).as('getSources');
    cy.intercept('POST', '/api/ai/analyze', { fixture: 'ai-analysis.json' }).as('analyzeContent');
    
    // Visite de la page principale
    cy.visit('/dashboard/rss-monitor');
  });

  describe('Source Management', () => {
    it('should load and display RSS sources correctly', () => {
      cy.wait('@getSources');
      cy.get('[data-cy=source-list]').should('exist');
      cy.get('[data-cy=source-item]').should('have.length.at.least', 1);
    });

    it('should display source status and last update time', () => {
      cy.wait('@getSources');
      cy.get('[data-cy=source-item]').first().within(() => {
        cy.get('[data-cy=source-status]').should('exist');
        cy.get('[data-cy=last-update]').should('exist');
      });
    });
  });

  describe('AI Analysis Integration', () => {
    it('should trigger AI analysis for new content', () => {
      // Simulation d'un nouvel appel à projet
      cy.get('[data-cy=new-content-trigger]').click();
      cy.wait('@analyzeContent');
      
      // Vérification de l'analyse
      cy.get('[data-cy=analysis-result]').should('exist');
      cy.get('[data-cy=relevance-score]').should('be.visible');
    });

    it('should display AI-enhanced suggestions', () => {
      cy.wait('@analyzeContent');
      cy.get('[data-cy=ai-suggestions]')
        .should('exist')
        .and('contain', 'Suggestions IA');
    });
  });

  describe('Content Processing', () => {
    it('should categorize content correctly', () => {
      cy.fixture('rss-content').then((content) => {
        // Vérification de la catégorisation
        cy.get('[data-cy=content-category]')
          .should('contain', content.expectedCategory);
      });
    });

    it('should extract key information', () => {
      cy.get('[data-cy=extracted-info]').within(() => {
        cy.get('[data-cy=deadline]').should('exist');
        cy.get('[data-cy=budget]').should('exist');
        cy.get('[data-cy=requirements]').should('exist');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle RSS source errors gracefully', () => {
      // Simulation d'une erreur de source
      cy.intercept('GET', '/api/rss/sources', {
        statusCode: 500,
        body: { error: 'Source unavailable' }
      }).as('sourceError');
      
      cy.reload();
      cy.get('[data-cy=error-message]')
        .should('exist')
        .and('contain', 'Source temporairement indisponible');
    });

    it('should handle AI service interruptions', () => {
      // Simulation d'une erreur AI
      cy.intercept('POST', '/api/ai/analyze', {
        statusCode: 503,
        body: { error: 'Service unavailable' }
      }).as('aiError');

      cy.get('[data-cy=new-content-trigger]').click();
      cy.get('[data-cy=ai-error-message]')
        .should('exist')
        .and('contain', 'Service d\'analyse temporairement indisponible');
    });
  });
});