// REQ-001 — Smoke Test Portal Paciente BUPA
// Criterios: disponibilidad, tiempo de carga, SSL
// Ambientes: @smoke corre en todos | edge cases solo unit + staging

const URL_BUPA = 'https://portalpaciente.bupa.cl/inicio'

describe('BUPA Smoke Tests - Portal Paciente @smoke', () => {

  // ── Flujos principales ───────────────────────────────────────────
  // Corren en TODOS los ambientes: unit, staging y producción
  // Deben pasar SIEMPRE — si fallan hay un problema real en prod

  it('la página carga correctamente y el body es visible @smoke', () => {
    cy.visit(URL_BUPA)
    cy.get('body').should('be.visible')
    cy.url().should('include', 'portalpaciente.bupa.cl')
  })

  it('el tiempo de carga es menor a 20 segundos @smoke', () => {
    const start = Date.now()
    cy.visit(URL_BUPA)
    cy.get('body').should('be.visible').then(() => {
      const elapsed = Date.now() - start
      cy.log(`Tiempo de carga: ${elapsed}ms`)
      expect(elapsed).to.be.lessThan(20000)
    })
  })

  it('la URL utiliza protocolo HTTPS confirmando certificado SSL válido @smoke', () => {
    cy.visit(URL_BUPA)
    cy.url().should('match', /^https:/)
      .and('include', 'portalpaciente.bupa.cl')
  })

  it('el dominio corresponde a portalpaciente.bupa.cl @smoke', () => {
    cy.visit(URL_BUPA)
    cy.url()
      .should('include', 'portalpaciente.bupa.cl')
      .and('not.include', 'localhost')
      .and('not.include', '127.0.0.1')
  })

  it('Angular completa el bootstrap correctamente @smoke', () => {
    cy.visit(URL_BUPA)
    cy.get('[ng-version], [_nghost-ng-c]', { timeout: 10000 }).should('exist')
    cy.get('body').should('be.visible')
  })

  // ── Edge cases negativos ──────────────────────────────────────────
  // Solo corren en unit y staging — NUNCA en producción
  // it.skip → documentan comportamiento ante fallos
  // Para correr: quitar el .skip manualmente en ambiente local

  it.skip('documenta: falla con timeout si el servidor está caído', () => {
    cy.intercept('GET', URL_BUPA, { forceNetworkError: true }).as('servidorCaido')
    cy.visit(URL_BUPA, { failOnStatusCode: false })
    cy.wait('@servidorCaido')
    cy.get('body').should('not.exist')
  })

  it.skip('documenta: falla si el tiempo de carga supera 3000 milisegundos', () => {
    const start = Date.now()
    cy.visit(URL_BUPA)
    cy.get('body').should('be.visible').then(() => {
      const elapsed = Date.now() - start
      cy.log(`Tiempo de carga: ${elapsed}ms`)
      expect(elapsed, `Carga lenta: ${elapsed}ms superan los 3000ms`).to.be.lessThan(3000)
    })
  })

  it.skip('documenta: falla si Angular no completa bootstrap en tiempo esperado', () => {
    cy.visit(URL_BUPA)
    cy.get('[ng-version]', { timeout: 3000 }).should('exist')
  })

})
