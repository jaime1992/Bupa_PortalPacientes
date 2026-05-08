// REQ-BUPA-003 al REQ-BUPA-007
// Login — autenticación de pacientes con RUT
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Login — Autenticación', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
  })

  it('REQ-003: login exitoso con credenciales válidas', () => {
    cy.get('input[name="rut"]').type(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.url().should('not.include', '/inicio')
  })

  it('REQ-004: error visible con credenciales inválidas', () => {
    cy.get('input[name="rut"]').type('12345678K')
    cy.get('input[name="current-password"]').type('ClaveIncorrecta999')
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.get('mat-error').should('be.visible')
    cy.get('mat-error').should('contain.text', 'Rut o contraseña incorrecta')
    cy.url().should('include', '/inicio')
  })

  it('REQ-005: error visible con RUT en formato incorrecto', () => {
    cy.get('input[name="rut"]').type('noesunrut')
    cy.get('input[name="current-password"]').type('MiClave123')
    cy.get('mat-error').should('be.visible')
    cy.url().should('include', '/inicio')
  })

  it('REQ-006: botón ingresar deshabilitado con campos vacíos', () => {
    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('REQ-007: enlace olvidé contraseña existe y es clickeable', () => {
    cy.contains(/olvidé|olvidaste|recuperar/i).should('be.visible').click()
    cy.url().should('not.include', '/inicio')
  })

})
