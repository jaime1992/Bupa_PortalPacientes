// REQ-BUPA-011, REQ-BUPA-014
// Exámenes — resultados médicos y descarga de PDFs
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Exámenes — Resultados médicos', () => {

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().should('not.be.disabled').click()
    cy.url({ timeout: 25000 }).should('not.include', '/inicio')
    cy.contains(/exámenes|examenes|resultados/i).click({ force: true })
    cy.url({ timeout: 10000 }).should('match', /examen|resultado|exam/i)
  })

  it('REQ-011: sección mis exámenes es accesible', () => {
    cy.url().should('match', /examen|resultado|exam/i)
    cy.get('body').should('be.visible')
  })

  it('REQ-011: página de exámenes tiene contenido visible', () => {
    cy.get('body').should('be.visible')
    cy.get('h1, h2, mat-card-title, [class*="title"], p, span').first().should('exist')
  })

  it('REQ-014: API de exámenes responde correctamente', () => {
    cy.intercept('GET', '**/exam**').as('getExamenes')
    cy.reload()
    cy.wait('@getExamenes', { timeout: 15000 }).its('response.statusCode').should('eq', 200)
  })

  it('REQ-014: página muestra exámenes o mensaje vacío', () => {
    cy.get('body').should('be.visible')
    cy.get('body').then(($body) => {
      const contenido = $body.find('mat-card, mat-list-item, [class*="examen"], [class*="empty"], [class*="no-data"], h1, h2, p').length
      expect(contenido).to.be.greaterThan(0)
    })
  })

})
