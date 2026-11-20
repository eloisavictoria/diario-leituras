describe('Cadastro de Leitura API Tests', () => {
  let token = '';

  beforeEach(() => {
    cy.fazerLoginCredenciaisValidas().then((loginToken) => {
      token = loginToken;
    });
  });

  it('Cadastro de leitura deve ser realizado com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Duna',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 5,
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.title).to.eq('Duna');
      expect(response.body.author).to.eq('Frank Herbert');
      expect(response.body.genre).to.eq('Ficção científica');
      expect(response.body.opinion).to.eq('Uma aventura complexa e envolvente.');
      expect(response.body.rating).to.eq(5);
      expect(response.body.recommend).to.eq(true);
    });
  });

  it('CT07 - Validar os valores-limite da avaliação de 1 a 5 estrelas', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Duna',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 6,
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('A avaliação deve ser um inteiro de 1 a 5.');
    });
  });
  
  it('CT08 - Rejeitar avaliações com valores não inteiros', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Duna',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 5.5,
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('A avaliação deve ser um inteiro de 1 a 5.');
    });
  });

  it('CT09 - Validar que a avaliação aceita apenas números', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Duna',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 'CINCO',
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('A avaliação deve ser um inteiro de 1 a 5.');
    });
  })

  it('CT11 - Impedir o cadastro de um gênero não previsto', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Duna',
        author: 'Frank Herbert',
        genre: 'Ficção',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 4,
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('Selecione um gênero válido.');
    });
  })

  it('CT13 - Validar o envio da recomendação como booleano para a API', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Duna',
        author: 'Frank Herbert',
        genre: 'Ficção científica',
        opinion: 'Uma aventura complexa e envolvente.',
        rating: 4,
        recommend: 'sim',
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('A recomendação deve ser true ou false.');
    });
  });

 
});