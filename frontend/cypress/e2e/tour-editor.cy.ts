import { testIdSelector } from './testing-utils';

describe('Tour Editor (Create Tour)', () => {
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
    });
  });

  it('should display the tour editor form with required sections', () => {
    cy.visit('/tour-editor', { onBeforeLoad: loginUser });

    cy.contains('Tourenplanung').should('be.visible');
    cy.get('#name').should('be.visible');
    cy.contains('Treffpunkt & Zeit').should('be.visible');
    cy.get('#date').should('be.visible');
    cy.get('#time').should('be.visible');
    cy.get('#place').should('be.visible');
    cy.contains('Tourenplanung & Anforderungen').should('be.visible');
    cy.get(testIdSelector('TOUR_SUBMIT_BUTTON')).should('be.visible');
  });

  it('should show validation error when submitting an empty form', () => {
    cy.visit('/tour-editor', { onBeforeLoad: loginUser });

    cy.get(testIdSelector('TOUR_SUBMIT_BUTTON')).click();

    cy.get('#name').should('have.class', 'has-error');
    cy.contains('Dieses Feld ist erforderlich.').should('be.visible');
  });

  it('should fill and submit a new tour successfully', () => {
    cy.intercept('POST', '**/api/tours', {
      statusCode: 201,
      body: {
        id: 'new-tour-42',
        name: 'Gotthard Skitour',
        date: '2099-12-31',
        time: '08:30',
        location: 'Andermatt',
        difficulty: 'mittel',
        altitude: '1200m',
        distance: '14 km',
        cost: 20,
        travelRoute: 'ÖV',
        requirements: 'B',
        tourManagerIds: ['user-1'],
        participantIds: [],
      },
    }).as('createTourRequest');

    cy.intercept('GET', '**/api/tours/my-tours', {
      statusCode: 200,
      body: [
        {
          id: 'new-tour-42',
          name: 'Gotthard Skitour',
          date: '2099-12-31',
          time: '08:30',
          location: 'Andermatt',
          difficulty: 'mittel',
          altitude: '1200m',
          distance: '14 km',
          cost: 20,
          travelRoute: 'ÖV',
          requirements: 'B',
          tourManagerIds: ['user-1'],
          participantIds: [],
        },
      ],
    }).as('getMyTours');

    cy.visit('/tour-editor', { onBeforeLoad: loginUser });

    cy.get('#name').type('Gotthard Skitour');
    cy.get('#date').type('2099-12-31');
    cy.get('#time').type('08:30');
    cy.get('#place').type('Andermatt');
    cy.get('#distance').type('14');
    cy.get('#altitude').type('1200');
    cy.get('#difficulty').select('mittel');
    cy.get('#travelRoute').select('ÖV');
    cy.get('#cost').type('20');
    cy.get('#requirements').select('B');

    cy.get(testIdSelector('TOUR_SUBMIT_BUTTON')).click();

    cy.wait('@createTourRequest');

    cy.url().should('include', '/tour-management');
    cy.contains('Gotthard Skitour').should('be.visible');
  });
});
