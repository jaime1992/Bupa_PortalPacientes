// REQ-BUPA-008, REQ-BUPA-009
// Navegación post-login — dashboard y menú principal
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Navegación — Post Login', () => {

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    // Paso 1 — ingresar RUT y continuar
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    // Paso 2 — ingresar contraseña
    cy.get('input[name="current-password"]', { timeout: 10000 }).type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().should('not.be.disabled').click()
    cy.url({ timeout: 25000 }).should('not.include', '/inicio')
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
    cy.contains(/citas/i).click({ force: true })
    cy.url({ timeout: 10000 }).should('match', /citas|appointment/i)
  })

  it('REQ-009: sección Exámenes es accesible desde el menú', () => {
    cy.contains(/exámenes|examenes|resultados/i).click({ force: true })
    cy.url({ timeout: 10000 }).should('match', /examen|resultado|exam/i)
  })

  it('REQ-009: sección Perfil es accesible desde el menú', () => {
    cy.contains(/perfil|mi cuenta|cuenta/i).click({ force: true })
    cy.url({ timeout: 10000 }).should('match', /perfil|profile|cuenta/i)
  })

})
