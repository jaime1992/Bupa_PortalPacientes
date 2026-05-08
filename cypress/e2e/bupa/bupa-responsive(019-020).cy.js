// REQ-BUPA-019, REQ-BUPA-020
// Responsive — comportamiento en móvil y tablet
// Selectores reales Angular Material — inspeccionados 2026-05-06

const viewports = [
  { nombre: 'iPhone 12', width: 390, height: 844, req: 'REQ-019' },
  { nombre: 'Samsung Galaxy S21', width: 360, height: 800, req: 'REQ-019' },
  { nombre: 'iPad', width: 768, height: 1024, req: 'REQ-020' },
  { nombre: 'iPad Pro', width: 1024, height: 1366, req: 'REQ-020' },
]

viewports.forEach(({ nombre, width, height, req }) => {

  describe(`${req}: ${nombre} (${width}x${height})`, () => {

    beforeEach(() => {
      cy.viewport(width, height)
      cy.visit('https://portalpaciente.bupa.cl/inicio')
    })

    it(`formulario de login visible en ${nombre}`, () => {
      cy.get('input[name="rut"]').should('be.visible')
      cy.get('input[name="current-password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it(`no hay scroll horizontal en ${nombre}`, () => {
      cy.get('body').should(($body) => {
        expect($body[0].scrollWidth).to.be.lte(width + 5)
      })
    })

    it(`botón Iniciar sesión es visible en ${nombre}`, () => {
      cy.get('button[type="submit"]')
        .should('be.visible')
        .contains(/iniciar sesión/i)
    })

    it(`textos son legibles en ${nombre}`, () => {
      cy.get('mat-label, label, h1, h2').first().should('be.visible')
    })

  })

})
