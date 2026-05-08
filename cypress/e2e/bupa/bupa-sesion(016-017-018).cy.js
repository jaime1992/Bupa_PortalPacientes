// REQ-BUPA-016, REQ-BUPA-017, REQ-BUPA-018
// Sesión — persistencia, logout y seguridad
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Sesión — Persistencia y seguridad', () => {

  const doLogin = () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').type(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.url().should('not.include', '/inicio')
  }

  it('REQ-016: sesión persiste al recargar la página', () => {
    doLogin()
    cy.reload()
    cy.url().should('not.include', '/inicio')
    cy.get('body').should('be.visible')
  })

  it('REQ-017: logout redirige a la página de inicio', () => {
    doLogin()
    cy.get('button, a').contains(/cerrar sesión|logout|salir/i).click()
    cy.url().should('include', '/inicio')
  })

  it('REQ-017: después del logout no se puede acceder al dashboard', () => {
    doLogin()
    cy.get('button, a').contains(/cerrar sesión|logout|salir/i).click()
    cy.url().should('include', '/inicio')
    cy.visit('https://portalpaciente.bupa.cl/dashboard')
    cy.url().should('include', '/inicio')
  })

  it('REQ-018: usuario no autenticado es redirigido al login', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('https://portalpaciente.bupa.cl/dashboard')
    cy.url().should('include', '/inicio')
  })

})
