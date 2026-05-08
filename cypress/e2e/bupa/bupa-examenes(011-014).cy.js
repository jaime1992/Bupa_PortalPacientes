// REQ-BUPA-011, REQ-BUPA-014
// Exámenes — resultados médicos y descarga de PDFs
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Exámenes — Resultados médicos', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().should('not.be.disabled').click()
    cy.url({ timeout: 15000 }).should('not.include', '/inicio')
    cy.contains(/exámenes|examenes|resultados/i).click()
  })

  it('REQ-011: sección mis exámenes es accesible', () => {
    cy.url().should('match', /examen|resultado|exam/i)
    cy.get('body').should('be.visible')
  })

  it('REQ-011: página de exámenes tiene encabezado visible', () => {
    cy.get('h1, h2, mat-card-title, [class*="title"]').should('be.visible')
  })

  it('REQ-014: API de exámenes responde correctamente', () => {
    cy.intercept('GET', '**/examenes**').as('getExamenes')
    cy.wait('@getExamenes', { timeout: 10000 })
      .its('response.statusCode').should('eq', 200)
  })

  it('REQ-014: botón de descarga existe si hay exámenes disponibles', () => {
    cy.intercept('GET', '**/examenes**').as('getExamenes')
    cy.wait('@getExamenes', { timeout: 10000 })
    cy.get('body').then(($body) => {
      const tieneExamenes = $body.find('mat-card, mat-list-item, [class*="examen"]').length > 0
      if (tieneExamenes) {
        cy.get('button[aria-label*="descargar"], a[href*=".pdf"], mat-icon-button')
          .first().should('be.visible')
      } else {
        cy.get('[class*="empty"], mat-card').should('exist')
      }
    })
  })

})
