Cypress.Commands.add('fazerLoginCredenciaisValidas', () => {
    return cy.request('POST', '/api/auth/login', {
      email: 'ana@example.com',
      password: 'Leitura123!',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token').that.is.a('string').and.not.empty;
      return response.body.token;
    });
})

Cypress.Commands.add('fazerLoginCredenciaisInvalidas', () => {
    cy.fixture('credenciais').then((login) => {
      cy.get('#username').type(login.invalida.usuario)
      cy.get('#senha').type(login.invalida.senha)
    })
    cy.get('#login-section > .btn').click();
})