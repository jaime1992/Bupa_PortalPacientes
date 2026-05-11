// REQ-BUPA-001
// Performance — tiempos de respuesta del portal
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Performance — Tiempos de respuesta', () => {

  it('REQ-001: página de inicio carga en menos de 8 segundos', () => {
    const start = Date.now()
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).should('be.visible').then(() => {
      const loadTime = Date.now() - start
      cy.log(`Tiempo de carga: ${loadTime}ms`)
      expect(loadTime).to.be.lessThan(8000)
    })
  })

  it('REQ-001: todos los recursos críticos de la página cargan', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).should('be.visible')
    cy.get('button[type="submit"]').first().should('be.visible')
  })

  it('REQ-001: flujo de login completa en menos de 10 segundos', () => {
    const start = Date.now()
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().should('not.be.disabled').click()
    cy.url({ timeout: 15000 }).should('not.include', '/inicio').then(() => {
      const duracion = Date.now() - start
      cy.log(`Duración total del login: ${duracion}ms`)
      expect(duracion).to.be.lessThan(10000)
    })
  })

  it('REQ-001: página no tiene errores de consola críticos al cargar', () => {
    const erroresCriticos = []
    cy.on('window:console', (msg) => {
      if (msg.type === 'error') erroresCriticos.push(msg.message)
    })
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').should('be.visible').then(() => {
      expect(erroresCriticos.length).to.eq(0)
    })
  })

})
