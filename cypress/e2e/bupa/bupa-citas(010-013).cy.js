// REQ-BUPA-010, REQ-BUPA-013
// Citas médicas — gestión y visualización
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Citas — Gestión de citas médicas', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().should('not.be.disabled').click()
    cy.viewport(1280, 720)
    cy.url({ timeout: 25000 }).should('not.include', '/inicio')
    cy.contains(/citas/i).click({ force: true })
  })

  it('REQ-010: sección mis citas es accesible', () => {
    cy.url().should('match', /citas|appointment/i)
    cy.get('body').should('be.visible')
  })

  it('REQ-013: lista de citas o mensaje vacío es visible', () => {
    cy.intercept('GET', '**/citas**').as('getCitas')
    cy.wait('@getCitas', { timeout: 10000 }).its('response.statusCode').should('eq', 200)
    cy.get('mat-card, mat-list, table, [class*="cita"], [class*="empty"]')
      .should('exist')
  })

  it('REQ-013: API de citas responde en menos de 2 segundos', () => {
    cy.intercept('GET', '**/citas**').as('getCitas')
    cy.wait('@getCitas', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.duration).to.be.lessThan(2000)
    })
  })

  it('REQ-013: página de citas tiene título visible', () => {
    cy.get('h1, h2, mat-card-title, [class*="title"]').should('be.visible')
  })

})
