describe('Login API Tests', () => {
  it('Login deve ser realizado com sucesso', () => {
   cy.request('POST','/api/auth/login', {
      "email": 'ana@example.com',
      "password": 'Leitura123!'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('token')
    })
  })

  it('Login com credenciais inválidas deve falhar', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      failOnStatusCode: false,
      body: {
        email: 'ana@example.com',
        password: '123'
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('E-mail ou senha inválidos.');
    });
  });
});
      