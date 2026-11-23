describe('Edição de Leitura Web Tests', () => {
    let token ='';
  beforeEach(() => {
    cy.fixture('credenciais.json').then((usuarios) => {
      cy.fazerLogin(usuarios.valida.email, usuarios.valida.password);
      cy.fazerLoginCredenciaisValidas(usuarios.valida.email, usuarios.valida.password).then((logintoken) => {
        token = logintoken;
      });
    });
  });

  it('Edição de uma leitura com sucesso', () => {
        cy.request({
          method: 'POST',
          url: '/api/readings/',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'Leitura para editar',
            author: 'Autor original',
            genre: 'Fantasia',
            opinion: 'Opinião original da leitura.',
            rating: 3,
            recommend: true,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);

          cy.visit(`http://localhost:5173/readings/${response.body._id}/edit`);

          cy.get('h1').should('contain', 'Editar leitura');
          cy.get('#title').clear().type('Leitura editada com sucesso');
          cy.get('#author').clear().type('Autor editado');
          cy.get('#genre').select('Romance');
          cy.get('#opinion').clear().type('Opinião atualizada após a releitura.');
          cy.get('[role="radio"][aria-label="5 estrelas"]').click();
          cy.get('input[name="recommend"][type="radio"]').eq(1).check();
          cy.contains('button[type="submit"]', 'Salvar alterações').click();

          cy.get('h1').should('contain', 'Leitura editada com sucesso');
          cy.get('.detail-author').should('contain', 'Autor editado');
          cy.get('.opinion-card').should('contain', 'Opinião atualizada após a releitura.');
          cy.get('.recommend-label').should('contain', 'não recomendo');
        });
      
    
  });

  it('Edição de leitura com campos obrigatórios faltantes', () => {
        cy.request({
          method: 'POST',
          url: '/api/readings/',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'Leitura com campo vazio',
            author: 'Autor original',
            genre: 'Fantasia',
            opinion: 'Opinião original da leitura.',
            rating: 3,
            recommend: true,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);

          cy.visit(`http://localhost:5173/readings/${response.body._id}/edit`);

          cy.get('#title').clear();
          cy.get('#author').clear();
          cy.get('#opinion').clear();
          cy.contains('button[type="submit"]', 'Salvar alterações').click();

          cy.get('#title').should('have.attr', 'required');
          cy.get('#author').should('have.attr', 'required');
          cy.get('#opinion').should('have.attr', 'required');
          cy.get('form').then(($form) => {
            expect($form[0].checkValidity()).to.be.false;
          });
          cy.url().should('include', `/readings/${response.body._id}/edit`);
        });
  });

  it('Cancelar a edição de uma leitura sem salvar alterações', () => {
        cy.request({
          method: 'POST',
          url: '/api/readings/',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'Leitura que não será alterada',
            author: 'Autor original',
            genre: 'Fantasia',
            opinion: 'Opinião original da leitura.',
            rating: 3,
            recommend: true,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);

          cy.visit(`http://localhost:5173/readings/${response.body._id}/edit`);

          cy.get('#title').clear().type('Alteração cancelada');
          cy.get('#opinion').clear().type('Esta opinião não deve ser salva.');
          cy.contains('a', 'Cancelar').click();

          cy.url().should('include', `/readings/${response.body._id}`);
          cy.get('h1').should('contain', 'Leitura que não será alterada');
          cy.get('.opinion-card').should('contain', 'Opinião original da leitura.');
          cy.get('h1').should('not.contain', 'Alteração cancelada');
        });
  });
});