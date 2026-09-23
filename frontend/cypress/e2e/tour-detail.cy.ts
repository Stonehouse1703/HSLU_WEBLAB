import { testIdSelector } from './testing-utils';

describe('Tour Details and 3x3 Security Matrix', () => {
  const loginUser = (win: Cypress.AUTWindow) => {
    win.localStorage.setItem('hslu_weblab_auth_token', 'mock-jwt-token');
    win.localStorage.setItem(
      'hslu_weblab_auth_user',
      JSON.stringify({
        id: 'user-1',
        firstName: 'Colin',
        lastName: 'Muster',
        email: 'colin@muster.ch',
      })
    );
  };

  const mockTour = {
    id: 'tour-123',
    name: 'Pazolastock Detail Tour',
    date: '2099-12-31',
    time: '07:30',
    location: 'Oberalppass',
    difficulty: 'mittel',
    altitude: '1100m',
    distance: '12 km',
    cost: 15,
    requirements: 'B',
    tourManagerIds: ['user-1'],
    participantIds: [],
    securityMatrix: {
      participants: 'bekannt',
      cloudCover: 'sonnig',
      precipitation: 'kein',
      visibility: 'gut',
      wind: 'schwach/mässig',
      temperature2000m: '-4',
      avalancheDanger: 2,
      dangerSources: ['Triebschnee'],
    },
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: {
        id: 'user-1',
        firstName: 'Colin',
        lastName: 'Muster',
        email: 'colin@muster.ch',
      },
    });

    cy.intercept('GET', '**/api/tours/tour-123', {
      statusCode: 200,
      body: mockTour,
    }).as('getTourDetail');

    cy.intercept('GET', '**/api/tours/tour-123/members', {
      statusCode: 200,
      body: {
        tourManagers: [
          {
            id: 'user-1',
            firstName: 'Colin',
            lastName: 'Muster',
            email: 'colin@muster.ch',
          },
        ],
        participants: [],
      },
    }).as('getTourMembers');
  });

  it('should display tour details including meeting point, members and 3x3 security matrix', () => {
    cy.visit('/tour-management/tour-123', { onBeforeLoad: loginUser });

    cy.wait('@getTourDetail');

    cy.contains('h2', 'Pazolastock Detail Tour').should('be.visible');
    cy.contains('Zurück zur Tourenübersicht').should('be.visible');

    cy.contains('Oberalppass').should('be.visible');
    cy.contains('07:30').should('be.visible');

    cy.contains('3x3 Sicherheitsmatrix & Risikobeurteilung').should('be.visible');
    cy.contains('Stufe 2 – Mässig').should('be.visible');
    cy.contains('Triebschnee').should('be.visible');
    cy.contains('Sonnig').should('be.visible');

    cy.contains('Colin Muster').should('be.visible');
  });

  it('should navigate back to tours overview when clicking back link', () => {
    cy.intercept('GET', '**/api/tours/my-tours', {
      statusCode: 200,
      body: [mockTour],
    }).as('getMyTours');

    cy.visit('/tour-management/tour-123', { onBeforeLoad: loginUser });
    cy.wait('@getTourDetail');

    cy.contains('Zurück zur Tourenübersicht').click();

    cy.url().should('include', '/tour-management');
    cy.url().should('not.include', 'tour-123');
    cy.contains('Deine bevorstehenden Touren').should('be.visible');
  });
});
