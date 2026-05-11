// REQ-BUPA-007
// Recuperar contraseña — flujo de recuperación de acceso
// El enlace aparece en PASO 2 (después de ingresar RUT)

describe('BUPA Recuperar contraseña', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    // Paso 1 — ingresar RUT para llegar al paso 2 donde aparece el enlace
    cy.get('input[name="rut"]', { timeout: 10000 }).type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).should('be.visible')
  })

  it('REQ-007: enlace de recuperación es visible en paso 2', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).should('be.visible')
  })

  it('REQ-007: enlace lleva a página de recuperación', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.url().should('not.include', '/inicio')
    cy.get('body').should('be.visible')
  })

  it('REQ-007: formulario de recuperación tiene campo de RUT o email', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.get('input[type="text"], input[type="email"], input[type="tel"], mat-form-field input, input', { timeout: 10000 })
      .not('[type="hidden"]')
      .first()
      .should('be.visible')
  })

  it('REQ-007: formulario de recuperación tiene botón de envío', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.get('button[type="submit"]', { timeout: 8000 }).should('be.visible')
  })

  it('REQ-007: hay enlace para volver al login', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.contains(/volver|regresar|iniciar sesión/i, { timeout: 8000 }).should('be.visible')
  })

})
