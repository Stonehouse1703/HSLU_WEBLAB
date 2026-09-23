import { testIdSelector } from './testing-utils';

describe('Tour Management Flow', () => {
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

  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: {
        id: 'user-1',
        firstName: 'Colin',
        lastName: 'Muster',
        email: 'colin@muster.ch',
      },
    }).as('authMe');
  });

  it('should display tours list with tour cards and details', () => {
    const mockTours = [
      {
        id: 'tour-101',
        name: 'Pazolastock Skitour',
        date: '2099-12-31',
        time: '08:00',
        location: 'Oberalppass',
        difficulty: 'mittel',
        altitude: '1100m',
        distance: '14 km',
        cost: 20,
        requirements: 'B',
        tourManagerIds: ['user-1'],
        participantIds: [],
      },
    ];

    cy.intercept('GET', '**/api/tours/my-tours', {
      statusCode: 200,
      body: mockTours,
    }).as('getMyTours');

    cy.visit('/tour-management', { onBeforeLoad: loginUser });

    cy.wait('@getMyTours');

    cy.contains('Deine bevorstehenden Touren').should('be.visible');
    cy.contains('Tour erstellen').should('be.visible');
    cy.contains('Per Link beitreten').should('be.visible');

    const tourCard = cy.get(testIdSelector('TOUR_CARD_tour-101'));
    tourCard.should('be.visible');
    tourCard.should('contain.text', 'Pazolastock Skitour');
    tourCard.should('contain.text', 'Schwierigkeit: mittel');
    tourCard.should('contain.text', 'Oberalppass');
  });

  it('should open and close the join-by-link panel', () => {
    cy.intercept('GET', '**/api/tours/my-tours', {
      statusCode: 200,
      body: [],
    }).as('getEmptyTours');

    cy.visit('/tour-management', { onBeforeLoad: loginUser });

    cy.contains('Tour per Link oder ID beitreten').should('not.exist');

    cy.contains('Per Link beitreten').click();

    cy.contains('Tour per Link oder ID beitreten').should('be.visible');
    cy.get('input.join-input').should('be.visible');

    cy.contains('Abbrechen').click();
    cy.contains('Tour per Link oder ID beitreten').should('not.exist');
  });
});
