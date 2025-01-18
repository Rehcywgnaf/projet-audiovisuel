// cypress/support/mocks/ai-service.js

export class AIServiceManager {
  static mockResponses = {
    analyze: {
      relevance: 0.85,
      category: "AAP",
      suggestions: [
        "Considérer une approche documentaire",
        "Mettre en avant l'aspect innovation",
        "Préparer un budget détaillé"
      ],
      extracted_info: {
        deadline: "2025-03-01",
        budget: "150000",
        key_requirements: [
          "Expérience en production documentaire",
          "Innovation technique",
          "Impact social mesurable"
        ]
      }
    }
  };

  static intercept() {
    cy.intercept('POST', '/api/ai/analyze', (req) => {
      req.reply({
        statusCode: 200,
        body: this.mockResponses.analyze
      });
    }).as('aiAnalyze');
  }

  static interceptWithError() {
    cy.intercept('POST', '/api/ai/analyze', {
      statusCode: 503,
      body: {
        error: "Service temporairement indisponible"
      }
    }).as('aiError');
  }
}