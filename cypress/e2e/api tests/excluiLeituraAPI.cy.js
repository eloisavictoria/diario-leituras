describe('Excluir Leitura API Tests', () => {

  let token = '';
  beforeEach(() => {
    cy.fazerLoginCredenciaisValidas('bruno@example.com', 'Leitura123!')
    .then((loginToken) => {
      token = loginToken;
    });
  });

  it('Exclusão de leitura deve ser realizada com sucesso', () => {
   cy.request({
      method: 'POST',
      url: '/api/readings/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Quem comeu meu queijo',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 4,
        recommend: true,
      },
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201);

      return cy.request({
        method: 'DELETE',
        url: `/api/readings/${createResponse.body._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: 'GET',
      url: '/api/readings/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(200);
      expect(getResponse.body).to.be.an('array');
      expect(getResponse.body).to.be.empty;
    });
  });

  it('CT21 - Impedir exclusão de leitura usando token de outro usuário', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Leitura de Bruno',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 4,
        recommend: true,
      },
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      expect(createResponse.body).to.have.property('_id');
      
      return cy.fazerLoginCredenciaisValidas('ana@example.com', 'Leitura123!').then((otherUserToken) => {
        return cy.request({
          method: 'DELETE',
          url: `/api/readings/${createResponse.body._id}`,
          failOnStatusCode: false,
          headers: {
            Authorization: `Bearer ${otherUserToken}`,
          }
        }).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.eq('Leitura não encontrada.');
        });
      });
    });
  });
});