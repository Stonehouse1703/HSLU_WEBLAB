import { testIdSelector } from './testing-utils';

describe('Navigation and Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display Top Level Navbar and navigate to Home by default', () => {
    cy.url().should('include', '/home');
    cy.get(testIdSelector('TOP_LEVEL_NAVBAR')).should('be.visible');

    cy.get(testIdSelector('TOP_LEVEL_NAVBAR')).within(() => {
      cy.contains('Home').should('be.visible');
      cy.contains('Touren').should('be.visible');
      cy.contains('Tour erfassen').should('be.visible');
      cy.contains('Anmelden').should('be.visible');
      cy.contains('Registrieren').should('be.visible');
    });

    cy.contains('Alles Wichtige für deine nächste Tour.').should('be.visible');
    cy.contains('Was du hier erledigen kannst').should('be.visible');
    cy.contains('Touren organisieren').should('be.visible');
  });

  it('should navigate from Home to Login page via Navbar', () => {
    const loginLink = cy.get(testIdSelector('TOP_LEVEL_NAVBAR')).contains('Anmelden');
    loginLink.click();

    cy.url().should('include', '/login');
    cy.contains('h1', 'Anmelden').should('be.visible');
    cy.get(testIdSelector('LOGIN_EMAIL_INPUT')).should('be.visible');
    cy.get(testIdSelector('LOGIN_PASSWORD_INPUT')).should('be.visible');
    cy.get(testIdSelector('LOGIN_SUBMIT_BUTTON')).should('be.visible');
  });

  it('should navigate from Login back to Home via Navbar', () => {
    cy.visit('/login');
    cy.get(testIdSelector('TOP_LEVEL_NAVBAR')).contains('Home').click();

    cy.url().should('include', '/home');
    cy.contains('Tourenverwaltung').should('be.visible');
  });
});
