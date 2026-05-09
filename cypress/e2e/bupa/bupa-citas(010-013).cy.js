// REQ-BUPA-010, REQ-BUPA-013
// Citas médicas — gestión y visualización
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Citas — Gestión de citas médicas', () => {

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().should('not.be.disabled').click()
    cy.url({ timeout: 25000 }).should('not.include', '/inicio')
    cy.contains(/citas/i).click({ force: true })
    cy.url({ timeout: 10000 }).should('match', /citas|appointment/i)
  })

  it('REQ-010: sección mis citas es accesible', () => {
    cy.url().should('match', /citas|appointment/i)
    cy.get('body').should('be.visible')
  })

  it('REQ-013: página de citas carga correctamente', () => {
    cy.get('body').should('be.visible')
    cy.get('body').then($body => {
      const contenido = $body.find('mat-card, mat-list, table, [class*="cita"], [class*="empty"], [class*="no-data"], h1, h2, p').length
      expect(contenido).to.be.greaterThan(0)
    })
  })

  it('REQ-013: API de citas responde correctamente', () => {
    cy.intercept('GET', '**/citas**').as('getCitas')
    cy.reload()
    cy.wait('@getCitas', { timeout: 15000 }).its('response.statusCode').should('eq', 200)
  })

  it('REQ-013: página de citas tiene contenido visible', () => {
    cy.get('body').should('be.visible')
    cy.get('h1, h2, mat-card-title, [class*="title"], p, span').first().should('exist')
  })

})
