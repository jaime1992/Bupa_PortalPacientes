// REQ-BUPA-001
// Performance — tiempos de respuesta del portal
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Performance — Tiempos de respuesta', () => {

  it('REQ-001: página de inicio carga en menos de 3 segundos', () => {
    const start = Date.now()
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').should('be.visible').then(() => {
      const loadTime = Date.now() - start
      cy.log(`Tiempo de carga: ${loadTime}ms`)
      expect(loadTime).to.be.lessThan(3000)
    })
  })

  it('REQ-001: todos los recursos críticos de la página cargan', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').should('be.visible')
    cy.get('input[name="current-password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('REQ-001: endpoint de login responde en menos de 2 segundos', () => {
    cy.intercept('POST', '**/auth**').as('loginRequest')
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').type(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.wait('@loginRequest', { timeout: 5000 }).then((interception) => {
      cy.log(`Duración del request: ${interception.duration}ms`)
      expect(interception.duration).to.be.lessThan(2000)
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
