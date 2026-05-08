// REQ-BUPA-008, REQ-BUPA-009
// Navegación post-login — dashboard y menú principal
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Navegación — Post Login', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').type(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.url().should('not.include', '/inicio')
  })

  it('REQ-008: dashboard visible después del login', () => {
    cy.get('body').should('be.visible')
    cy.url().should('not.include', '/inicio')
  })

  it('REQ-009: menú de navegación principal existe', () => {
    cy.get('nav, [role="navigation"], mat-nav-list, mat-sidenav')
      .should('exist')
  })

  it('REQ-009: sección Citas es accesible desde el menú', () => {
    cy.contains(/citas/i).should('be.visible').click()
    cy.url().should('match', /citas|appointment/i)
  })

  it('REQ-009: sección Exámenes es accesible desde el menú', () => {
    cy.contains(/exámenes|examenes|resultados/i).should('be.visible').click()
    cy.url().should('match', /examen|resultado|exam/i)
  })

  it('REQ-009: sección Perfil es accesible desde el menú', () => {
    cy.contains(/perfil|mi cuenta|cuenta/i).should('be.visible').click()
    cy.url().should('match', /perfil|profile|cuenta/i)
  })

})
