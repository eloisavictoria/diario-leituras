describe('Login Web Tests', () => {
    it('Login com credenciais válidas', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('#email').type('ana@example.com');
        cy.get('#password').type('Leitura123!');
        cy.get('button[type="submit"]').click();
        cy.get('h1').should('contain', 'Minha biblioteca');
    });

    it('Login com credenciais inválidas', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('#email').type('ana@example.com');
        cy.get('#password').type('123');
        cy.get('button[type="submit"]').click();
        cy.get('.error-banner').should('contain', 'E-mail ou senha inválidos.');
    });
});