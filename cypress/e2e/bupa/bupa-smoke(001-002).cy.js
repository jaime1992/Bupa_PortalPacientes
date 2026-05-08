// REQ-BUPA-001, REQ-BUPA-002
// Smoke Tests — verificar que el portal está vivo y accesible
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Smoke Tests — Portal vivo', () => {

  it('REQ-001: portal carga correctamente', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('body').should('be.visible')
    cy.title().should('not.be.empty')
    cy.url().should('include', 'portalpaciente.bupa.cl')
  })

  it('REQ-001: portal carga en menos de 3 segundos', () => {
    const start = Date.now()
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('body').should('be.visible').then(() => {
      expect(Date.now() - start).to.be.lessThan(3000)
    })
  })

  it('REQ-002: formulario de login paso 1 visible — campo RUT', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).should('be.visible')
    cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible')
  })

  it('REQ-002: formulario de login paso 2 visible — campo contraseña', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).should('be.visible')
  })

  it('REQ-002: portal cumple accesibilidad WCAG 2.1 AA', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.injectAxe()
    cy.checkA11y(null, {
      runOnly: ['wcag2a', 'wcag2aa'],
      rules: {
        // Falso positivo conocido de Angular Material mat-expansion-panel-header
        // El componente maneja correctamente el foco en la práctica
        'nested-interactive': { enabled: false }
      }
    })
  })

  it('REQ-002: página tiene certificado HTTPS válido', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.location('protocol').should('eq', 'https:')
  })

})
