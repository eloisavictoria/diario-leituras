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
})