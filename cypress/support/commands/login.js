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