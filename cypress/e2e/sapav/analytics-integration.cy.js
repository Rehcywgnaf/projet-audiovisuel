describe('SAPAV - Integration Analytics', () => {
  beforeEach(() => {
    // Configuration des mocks pour les données d'analyse
    cy.intercept('GET', '/api/analytics/metrics', { fixture: 'analytics-metrics.json' }).as('getMetrics');
    cy.intercept('GET', '/api/analytics/reports', { fixture: 'analytics-reports.json' }).as('getReports');
    cy.intercept('GET', '/api/analytics/team-stats', { fixture: 'team-statistics.json' }).as('getTeamStats');
    
    cy.visit('/dashboard/analytics');
  });

  describe('Tableaux de Bord', () => {
    it('devrait afficher les métriques globales', () => {
      cy.wait('@getMetrics');
      
      cy.get('[data-cy=metrics-dashboard]').within(() => {
        // Vérification des KPIs principaux
        cy.get('[data-cy=success-rate]')
          .should('contain', '75%')
          .and('have.class', 'trending-up');

        cy.get('[data-cy=active-projects]')
          .should('contain', '12');

        cy.get('[data-cy=monthly-submissions]')
          .should('contain', '8');

        // Vérification des graphiques
        cy.get('[data-cy=success-trend]')
          .should('be.visible');
        cy.get('[data-cy=submissions-chart]')
          .should('exist');
      });
    });

    it('devrait filtrer les données par période', () => {
      // Configuration filtres
      cy.get('[data-cy=date-range-picker]').click();
      cy.get('[data-cy=date-start]').type('2025-01-01');
      cy.get('[data-cy=date-end]').type('2025-01-31');
      cy.get('[data-cy=apply-dates]').click();

      // Vérification mise à jour données
      cy.get('[data-cy=filtered-metrics]')
        .should('contain', 'Janvier 2025');
    });
  });

  describe('Rapports d\'Analyse', () => {
    it('devrait générer des rapports personnalisés', () => {
      cy.get('[data-cy=reports-section]').within(() => {
        // Configuration rapport
        cy.get('[data-cy=new-report]').click();
        cy.get('[data-cy=report-type]').select('aap-analysis');
        cy.get('[data-cy=metrics-select]').select(['success-rate', 'response-time']);
        cy.get('[data-cy=generate-report]').click();

        // Vérification génération
        cy.wait('@getReports');
        cy.get('[data-cy=report-preview]')
          .should('be.visible')
          .and('contain', 'Analyse des AAP');
      });
    });

    it('devrait exporter les rapports', () => {
      cy.intercept('POST', '/api/reports/export', {
        statusCode: 200,
        body: { url: 'export/report-123.pdf' }
      }).as('exportReport');

      // Sélection et export
      cy.get('[data-cy=report-list]').first().click();
      cy.get('[data-cy=export-report]').click();
      cy.get('[data-cy=export-format]').select('pdf');
      cy.get('[data-cy=confirm-export]').click();

      // Vérification export
      cy.wait('@exportReport');
      cy.get('[data-cy=export-success]')
        .should('be.visible');
    });
  });

  describe('Analyses AAP/AO', () => {
    it('devrait analyser les critères de succès', () => {
      cy.get('[data-cy=success-factors]').within(() => {
        // Affichage facteurs clés
        cy.get('[data-cy=key-factors]').should('exist');
        cy.get('[data-cy=factor-item]')
          .should('have.length.at.least', 3)
          .first()
          .should('contain', 'Innovation technique');
      });
    });

    it('devrait identifier les tendances', () => {
      cy.get('[data-cy=trends-analysis]').within(() => {
        // Analyse tendances
        cy.get('[data-cy=trend-chart]').should('be.visible');
        cy.get('[data-cy=trend-factors]')
          .children()
          .should('have.length.at.least', 2);

        // Détails tendance
        cy.get('[data-cy=trend-details]').first().click();
        cy.get('[data-cy=trend-breakdown]')
          .should('be.visible')
          .and('contain', 'Évolution temporelle');
      });
    });
  });

  describe('Statistiques d\'Équipe', () => {
    it('devrait afficher les performances par membre', () => {
      cy.wait('@getTeamStats');

      cy.get('[data-cy=team-performance]').within(() => {
        // Stats par membre
        cy.get('[data-cy=team-member]')
          .should('have.length.at.least', 2);

        // Détails premier membre
        cy.get('[data-cy=member-stats]').first().within(() => {
          cy.get('[data-cy=projects-count]').should('exist');
          cy.get('[data-cy=success-rate]').should('exist');
          cy.get('[data-cy=avg-response-time]').should('exist');
        });
      });
    });

    it('devrait calculer les métriques d\'efficacité', () => {
      cy.get('[data-cy=efficiency-metrics]').within(() => {
        // Temps moyen de réponse
        cy.get('[data-cy=avg-response-time]')
          .should('contain', 'jours');

        // Taux de complétion dans les délais
        cy.get('[data-cy=on-time-completion]')
          .should('contain', '%');
      });
    });
  });

  describe('Gestion des Erreurs', () => {
    it('devrait gérer les erreurs de chargement', () => {
      cy.intercept('GET', '/api/analytics/**', {
        statusCode: 500,
        body: { error: 'Service indisponible' }
      }).as('loadError');

      cy.reload();
      
      // Vérification message erreur
      cy.get('[data-cy=error-message]')
        .should('contain', 'Impossible de charger les analyses');
      
      // Vérification bouton retry
      cy.get('[data-cy=retry-button]')
        .should('be.visible')
        .click();

      // Vérification chargement après retry
      cy.get('[data-cy=metrics-dashboard]')
        .should('be.visible');
    });

    it('devrait gérer les données manquantes', () => {
      cy.intercept('GET', '/api/analytics/metrics', {
        body: { 
          error: 'Données partielles',
          metrics: {
            success_rate: null,
            active_projects: 12
          }
        }
      }).as('partialData');

      // Vérification affichage partiel
      cy.get('[data-cy=metrics-dashboard]').within(() => {
        cy.get('[data-cy=success-rate]')
          .should('contain', 'Non disponible');
        cy.get('[data-cy=active-projects]')
          .should('contain', '12');
      });

      // Vérification alerte données partielles
      cy.get('[data-cy=partial-data-alert]')
        .should('be.visible');
    });
  });
});