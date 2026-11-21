 describe('Edição de Leitura API Tests', () => {
  let token = '';

  beforeEach(() => {
    cy.fazerLoginCredenciaisValidas('ana@example.com', 'Leitura123!').then((loginToken) => {
      token = loginToken;
    });
  });

 it('Edição de leitura deve ser realizada com sucesso', () => {
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
        method: 'PUT',
        url: `/api/readings/${createResponse.body._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: 'Sete anos',
          author: 'Frank Herbert',
          genre: 'Ficção científica',
          opinion: 'Uma aventura ainda mais envolvente.',
          rating: 5,
          recommend: false,
        },
      });
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.title).to.eq('Sete anos');
      expect(response.body.author).to.eq('Frank Herbert');
      expect(response.body.genre).to.eq('Ficção científica');
      expect(response.body.opinion).to.eq('Uma aventura ainda mais envolvente.');
      expect(response.body.rating).to.eq(5);
      expect(response.body.recommend).to.eq(false);
    });
  });

  it('CT16 - Validar que PUT exige o objeto completo da leitura', () => {
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
        method: 'PUT',
        url: `/api/readings/${createResponse.body._id}`,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: 'Sete anos',
          //author: 'Frank Herbert',
          genre: 'Ficção científica',
          opinion: 'Uma aventura ainda mais envolvente.',
          rating: 5,
          recommend: false,
        },
      });
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('O campo author é obrigatório.');
    });
  });

  it('CT20 - Impedir edição de leitura usando token de outro usuário', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Leitura de Ana',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 4,
        recommend: true,
      },
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      expect(createResponse.body).to.have.property('_id');

      return cy.fazerLoginCredenciaisValidas('bruno@example.com', 'Leitura123!').then((otherUserToken) => {
        return cy.request({
          method: 'PUT',
          url: `/api/readings/${createResponse.body._id}`,
          failOnStatusCode: false,
          headers: {
            Authorization: `Bearer ${otherUserToken}`,
          },
          body: {
            title: 'Leitura de Bruno',
            author: 'Frank Herbert',
            genre: 'Ficção científica',
            opinion: 'Uma aventura ainda mais envolvente.',
            rating: 5,
            recommend: false,
          },
        });
      });
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('Leitura não encontrada.');
    });
  });

})