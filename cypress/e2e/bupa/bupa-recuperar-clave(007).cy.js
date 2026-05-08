// REQ-BUPA-007
// Recuperar contraseña — flujo de recuperación de acceso
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Recuperar contraseña', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
  })

  it('REQ-007: enlace de recuperación es visible en el login', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).should('be.visible')
  })

  it('REQ-007: enlace lleva a página de recuperación', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.url().should('not.include', '/inicio')
    cy.get('body').should('be.visible')
  })

  it('REQ-007: formulario de recuperación tiene campo de RUT o email', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.get('input[name="rut"], input[type="email"], mat-form-field input')
      .should('be.visible')
  })

  it('REQ-007: formulario de recuperación tiene botón de envío', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('REQ-007: hay enlace para volver al login', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).click()
    cy.contains(/volver|regresar|iniciar sesión/i).should('be.visible')
  })

})
