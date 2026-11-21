describe('Cadastro de Leitura Web Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');

        cy.fixture('credenciais.json').then((usuarios) => {
            cy.fazerLogin(usuarios.valida.email, usuarios.valida.password);
        })
    });

    it('Cadastro de leitura com sucesso', () => {
        const titulo = 'O Senhor dos Anéis'
        cy.get('.page-heading .btn-primary').click();
        cy.get('#title').type(titulo);
        cy.get('#author').type('J.R.R. Tolkien');
        cy.get('#genre').select('Fantasia');
        cy.get('#opinion').type('Uma obra-prima da literatura fantástica.');
        cy.get('[role="radio"][aria-label="5 estrelas"]').click();
        cy.get('input[name="recommend"]').first().check();
        cy.get('button[type="submit"]').click();
        cy.get('h1').should('contain', titulo);
        cy.get('.narrow-page a[href="/library"]').click();
    });

    it('Valida os campos obrigatórios no cadastro de leitura', () => {
        cy.get('.page-heading .btn-primary').click();
        cy.get('button[type="submit"]').click();

        cy.get('#title').should('have.attr', 'required');
        cy.get('#author').should('have.attr', 'required');
        cy.get('#genre').should('have.attr', 'required');
        cy.get('#opinion').should('have.attr', 'required');
        cy.get('input[name="recommend"]').first().should('have.attr', 'required');
        cy.get('form').then(($form) => {
            expect($form[0].checkValidity()).to.be.false;
        });

        cy.get('#title').type('Livro sem avaliação');
        cy.get('#author').type('Autora');
        cy.get('#genre').select('Fantasia');
        cy.get('#opinion').type('Ainda falta selecionar uma avaliação.');
        cy.get('input[name="recommend"]').first().check();
        cy.get('button[type="submit"]').click();
        cy.get('[role="alert"]').should(
            'have.text',
            'Preencha todos os campos, incluindo a avaliação e a recomendação.'
        );
    });

    it('Rejeita o cadastro de dois livros com o mesmo nome', () => {
        const titulo = 'Livro duplicado';
        const mensagemErro = 'Já existe um livro cadastrado com este título.';

        cy.get('.page-heading .btn-primary').click();
        cy.get('#title').type(titulo);
        cy.get('#author').type('J.R.R. Tolkien');
        cy.get('#genre').select('Fantasia');
        cy.get('#opinion').type('Uma obra-prima da literatura fantástica.');
        cy.get('[role="radio"][aria-label="5 estrelas"]').click();
        cy.get('input[name="recommend"]').first().check();
        cy.get('button[type="submit"]').click();
        cy.get('h1').should('contain', titulo);

        cy.get('.narrow-page a[href="/library"]').click();
        cy.get('.page-heading .btn-primary').click();
        cy.get('#title').type(titulo);
        cy.get('#author').type('J.R.R. Tolkien');
        cy.get('#genre').select('Fantasia');
        cy.get('#opinion').type('Uma obra-prima da literatura fantástica.');
        cy.get('[role="radio"][aria-label="5 estrelas"]').click();
        cy.get('input[name="recommend"]').first().check();
        cy.get('button[type="submit"]').click();
        cy.get('[role="alert"]').should('have.text', mensagemErro);
    });
});
