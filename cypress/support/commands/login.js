Cypress.Commands.add('fazerLoginCredenciaisValidas', (email, password) => {
    return cy.request('POST', '/api/auth/login', {
      email: email,
      password: password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token').that.is.a('string').and.not.empty;
      return response.body.token;
    });
})

Cypress.Commands.add('fazerLoginCredenciaisInvalidas', (email, password) => {
     return cy.request('POST', '/api/auth/login', {
      email: email,
      password: password,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('E-mail ou senha inválidos.');
    });
})

Cypress.Commands.add('fazerLogin', (email, password) => {
  cy.visit('http://localhost:5173/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.get('h1').should('contain', 'Minha biblioteca');
})