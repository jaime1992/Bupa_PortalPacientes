// REQ-BUPA-003 al REQ-BUPA-007
// Login — autenticación de pacientes con RUT
// Login de DOS pasos: paso 1 RUT → paso 2 contraseña

describe('BUPA Login — Autenticación', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
  })

  // Helper: avanza al paso 2 ingresando el RUT y clickeando continuar
  const irAPaso2 = (rut) => {
    cy.get('input[name="rut"]', { timeout: 10000 }).type(rut)
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).should('be.visible')
  }

  it('REQ-003: login exitoso con credenciales válidas', () => {
    irAPaso2(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').first().click()
    cy.url({ timeout: 15000 }).should('not.include', '/inicio')
  })

  it('REQ-004: error visible con contraseña incorrecta', () => {
    irAPaso2(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type('ClaveIncorrecta999')
    cy.get('button[type="submit"]').first().click()
    cy.contains(/contraseña|rut|incorrecta|inválida|error/i, { timeout: 8000 }).should('be.visible')
    cy.url().should('match', /\/(inicio|login)/)
  })

  it('REQ-005: error visible con RUT en formato incorrecto', () => {
    cy.get('input[name="rut"]', { timeout: 10000 }).type('noesunrut')
    cy.get('button[type="submit"]').first().click({ force: true })
    cy.get('mat-error', { timeout: 8000 }).should('be.visible')
    cy.get('button[type="submit"]').first().should('be.disabled')
    cy.url().should('match', /\/(inicio|login)/)
  })

  it('REQ-006: botón ingresar deshabilitado con campos vacíos', () => {
    cy.get('button[type="submit"]', { timeout: 10000 }).first().should('be.disabled')
  })

  it('REQ-007: enlace olvidé contraseña existe en paso 2', () => {
    irAPaso2(Cypress.env('BUPA_USER'))
    cy.contains(/olvidé|olvidaste|recuperar/i, { timeout: 10000 }).should('be.visible').click()
    cy.url().should('not.include', '/inicio')
  })

})
