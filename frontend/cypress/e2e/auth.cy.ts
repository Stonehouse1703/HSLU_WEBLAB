import { testIdSelector } from './testing-utils';

describe('Authentication and Route Protection', () => {
  it('should redirect unauthenticated users to /login when accessing protected routes', () => {
    cy.visit('/tour-management');

    cy.url().should('include', '/login');
    cy.url().should('include', 'returnUrl');
    cy.contains('h1', 'Anmelden').should('be.visible');
  });

  it('should redirect unauthenticated users when directly accessing /tour-editor', () => {
    cy.visit('/tour-editor');

    cy.url().should('include', '/login');
    cy.contains('h1', 'Anmelden').should('be.visible');
  });

  it('should show form validation errors when submitting empty login form', () => {
    cy.visit('/login');

    cy.get(testIdSelector('LOGIN_SUBMIT_BUTTON')).click();

    cy.get(testIdSelector('LOGIN_EMAIL_INPUT')).should('have.class', 'has-error');
    cy.contains('Dieses Feld ist erforderlich.').should('be.visible');
  });

  it('should allow user to successfully log in and update navbar state', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-for-e2e',
        user: {
          id: 'mock-user-id',
          firstName: 'Colin',
          lastName: 'Muster',
          email: 'colin@muster.ch',
        },
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/api/tours/my-tours', {
      statusCode: 200,
      body: [],
    }).as('getTours');

    cy.visit('/login');

    cy.get(testIdSelector('LOGIN_EMAIL_INPUT')).type('colin@muster.ch');
    cy.get(testIdSelector('LOGIN_PASSWORD_INPUT')).type('secret123');
    cy.get(testIdSelector('LOGIN_SUBMIT_BUTTON')).click();

    cy.wait('@loginRequest');

    cy.url().should('include', '/tour-management');

    cy.get(testIdSelector('TOP_LEVEL_NAVBAR')).should('contain.text', 'Colin Muster');
    cy.get(testIdSelector('NAV_LOGOUT_BUTTON')).should('be.visible');

    cy.get(testIdSelector('NAV_LOGOUT_BUTTON')).click();
    cy.get(testIdSelector('NAV_LOGIN_LINK')).should('be.visible');
  });
});
