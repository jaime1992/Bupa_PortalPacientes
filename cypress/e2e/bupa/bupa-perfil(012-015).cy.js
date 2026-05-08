// REQ-BUPA-012, REQ-BUPA-015
// Perfil — datos personales del paciente
// Selectores reales Angular Material — inspeccionados 2026-05-06

describe('BUPA Perfil — Datos personales', () => {

  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('input[name="rut"]').type(Cypress.env('BUPA_USER'))
    cy.get('input[name="current-password"]').type(Cypress.env('BUPA_PASS'), { log: false })
    cy.get('button[type="submit"]').should('not.be.disabled').click()
    cy.url().should('not.include', '/inicio')
    cy.contains(/perfil|mi cuenta/i).click()
  })

  it('REQ-012: sección mi perfil es accesible', () => {
    cy.url().should('match', /perfil|profile|cuenta/i)
    cy.get('body').should('be.visible')
  })

  it('REQ-012: datos del paciente son visibles', () => {
    cy.get('mat-card, mat-form-field, form').should('exist')
  })

  it('REQ-015: campos de contacto editables existen', () => {
    cy.get('mat-form-field input[type="tel"], mat-form-field input[type="email"]')
      .should('exist')
  })

  it('REQ-015: botón guardar cambios existe', () => {
    cy.get('button[type="submit"]').contains(/guardar|actualizar|save/i)
      .should('exist')
  })

})
