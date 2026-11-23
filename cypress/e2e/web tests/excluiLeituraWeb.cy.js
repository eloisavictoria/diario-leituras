describe('Exclusão de Leitura Web Tests', () => {
    let token ='';
  beforeEach(() => {
    cy.fixture('credenciais.json').then((usuarios) => {
      cy.fazerLogin(usuarios.valida.email, usuarios.valida.password);
      cy.fazerLoginCredenciaisValidas(usuarios.valida.email, usuarios.valida.password).then((logintoken) => {
        token = logintoken;
      });
    });
  });

  it('Exclusão de uma leitura com sucesso', () => {
        cy.request({
          method: 'POST',
          url: '/api/readings/',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'Leitura para excluir',
            author: 'Autor original',
            genre: 'Fantasia',
            opinion: 'Opinião original da leitura.',
            rating: 3,
            recommend: true,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);

          cy.visit(`http://localhost:5173/readings/${response.body._id}`);

           cy.get('.btn-danger-outline').click();
           cy.get('.modal #delete-desc').
           should('contain', 'Essa ação é definitiva. O livro e sua opinião serão removidos da biblioteca.');
           cy.get('.modal-actions .btn-danger').click();
        });    
  });

  it('Cancelar a exclusão de uma leitura sem confirmar', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Leitura sem confirmação',
        author: 'Autor original',
        genre: 'Fantasia',
        opinion: 'Opinião original da leitura.',
        rating: 3,
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);

      cy.visit(`http://localhost:5173/readings/${response.body._id}`);
      cy.get('.btn-danger-outline').click();
      cy.get('.modal #delete-desc').should(
        'contain',
        'Essa ação é definitiva. O livro e sua opinião serão removidos da biblioteca.'
      );
      cy.get('.modal-actions .btn-secondary').click();

      cy.get('.modal').should('not.exist');
      cy.get('h1').should('contain', 'Leitura sem confirmação');
      cy.url().should('include', `/readings/${response.body._id}`);
    });
  });

  it('Exclusão de leitura com falha', () => {
    cy.request({
      method: 'POST',
      url: '/api/readings/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        title: 'Leitura cuja exclusão falha',
        author: 'Autor original',
        genre: 'Fantasia',
        opinion: 'Opinião original da leitura.',
        rating: 3,
        recommend: true,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      cy.intercept('DELETE', `/api/readings/${response.body._id}`, {
        statusCode: 500,
        body: { error: 'Falha ao excluir leitura.' },
      }).as('falhaAoExcluir');

      cy.visit(`http://localhost:5173/readings/${response.body._id}`);
      cy.get('.btn-danger-outline').click();
      cy.get('.modal-actions .btn-danger').click();

      cy.wait('@falhaAoExcluir').its('response.statusCode').should('eq', 500);
      cy.get('[role="alert"]').should('have.text', 'Falha ao excluir leitura.');
      cy.get('.modal').should('not.exist');
      cy.get('h1').should('contain', 'Leitura cuja exclusão falha');
      cy.url().should('include', `/readings/${response.body._id}`);
    });
  });

});