# Entre Páginas — Diário Pessoal de Leituras

Uma aplicação Web com API REST para registrar livros já lidos, consultar uma biblioteca pessoal, registrar opiniões e avaliações, editar informações e excluir leituras. As leituras são privadas por usuário autenticado.

> Projeto didático para atividades de Quality Assurance, com testes funcionais em Cypress e cenários de performance da API em k6.

## Tecnologias

- **API:** Node.js 20+, Express 4, Mongoose 8, `mongodb-memory-server` 10, JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `express-rate-limit`.
- **Web:** React 18, Vite 6, React Router 6, Lucide Icons e CSS próprio.
- **Testes de QA:** Cypress 16, `cypress-mochawesome-reporter` 5 e k6.
- **Documentação:** OpenAPI 3.0 em YAML e Swagger UI.
- **Versionamento:** Git.

## Pré-requisitos

- Node.js 22 ou superior e npm para executar todas as ferramentas do projeto. O backend, isoladamente, requer Node.js 20 ou superior; o `cypress-mochawesome-reporter` 5 requer Node.js 22 ou superior.
- Acesso à internet na primeira inicialização do backend: `mongodb-memory-server` baixa o executável do MongoDB quando ainda não está em cache. Não é necessário instalar MongoDB separadamente.

## Instalação

```bash
git clone <URL-DO-REPOSITORIO>
cd diario-leituras
npm run install:all
cp backend/.env.example backend/.env
```

Edite `backend/.env` e substitua `JWT_SECRET` por um segredo aleatório com **pelo menos 32 caracteres**. O valor do exemplo é apenas ilustrativo, nunca use em produção.

No Windows PowerShell, use `Copy-Item backend/.env.example backend/.env` em vez de `cp`, se necessário.

## Execução

Inicie backend e frontend ao mesmo tempo:

```bash
npm run dev
```

Ou em terminais separados:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Para uma execução do backend sem modo watch:

```bash
npm run start --prefix backend
```

Para compilar o frontend:

```bash
npm run build --prefix frontend
```

## Testes funcionais com Cypress

As suítes E2E cobrem a API e a interface Web. Inicie o backend e o frontend:

```bash
npm run dev
```

Em outro terminal, execute os testes em modo headless:

```bash
npm run cy:run
```

Para abrir a interface interativa do Cypress em vez de executar no modo headless:

```bash
npm run cy:open
```

Os testes ficam em `cypress/e2e/api tests/` e `cypress/e2e/web tests/`. O `cypress-mochawesome-reporter` gera um relatório HTML em `cypress/reports/html/index.html`, com os resultados e screenshots associados às falhas. Abra esse arquivo no navegador para consultar o relatório. Relatórios e screenshots são artefatos locais e não são versionados.

## Testes de performance com k6

Instale o [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) separadamente do npm e inicie a API em um terminal:

```powershell
npm.cmd run dev --prefix backend
```

Em outro terminal, execute na raiz do projeto:

```powershell
npm.cmd run perf:login
```

O cenário em `performance/login.js` envia 10 requisições de login, uma por vez, usando a conta de demonstração Ana. Ele verifica o status HTTP e a presença do token; o limiar inicial exige p90 abaixo de 2 segundos e menos de 1% de requisições com falha. A execução é curta e fica abaixo do limite de tentativas de login da API.

A execução de cadastro pode ser feita com `npm.cmd run perf:cadastro`. Ela autentica uma vez e envia uma requisição para criar uma leitura. O registro fica no banco em memória até a API ser reiniciada.

A URL padrão vem de `config/config.local.json` (`http://localhost:3001`). Para substituir a URL ou as credenciais sem editar arquivos, use variáveis de ambiente. No PowerShell:

```powershell
$env:BASE_URL = "http://localhost:3001"
$env:K6_USER_EMAIL = "ana@example.com"
$env:K6_USER_PASSWORD = "Leitura123!"
npm.cmd run perf:login
```

Use o teste somente contra uma instância sua ou para a qual tenha autorização.

### Abrir o dashboard ao vivo

O k6 inclui um dashboard local (não é necessário instalar o Grafana). Em um segundo terminal PowerShell, habilite-o e execute o teste:

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_OPEN = "true"
$env:K6_WEB_DASHBOARD_PERIOD = "1s"
npm.cmd run perf:login
```

O navegador abre o dashboard em <http://localhost:5665>. O cenário atual dura cerca de 10 segundos; o intervalo de atualização de 1 segundo permite visualizar gráficos mesmo nesse teste curto. Feche a aba do dashboard para o processo do k6 terminar.

### Exportar um relatório HTML

Para guardar e abrir o resultado depois, use um terminal PowerShell novo (ou defina `K6_WEB_DASHBOARD_OPEN` como `false`):

```powershell
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_OPEN = "false"
$env:K6_WEB_DASHBOARD_PERIOD = "1s"
$env:K6_WEB_DASHBOARD_EXPORT = "performance-report.html"
npm.cmd run perf:login
Start-Process .\performance-report.html
```

O arquivo `performance-report.html` é criado na raiz do projeto. Consulte a [documentação oficial do dashboard k6](https://grafana.com/docs/k6/latest/results-output/web-dashboard/) para outras opções.

**Importante:** o banco de dados funciona exclusivamente em memória. Ao **reiniciar o processo da API**, os dados inseridos ou alterados desaparecem e os usuários/livros de exemplo voltam a ser criados. A aplicação não é destinada a armazenar dados reais de forma duradoura.

## URLs importantes

| Recurso | URL |
|---|---|
| Aplicação Web | http://localhost:5173 |
| Login | http://localhost:5173/login |
| Minha biblioteca | http://localhost:5173/library |
| API | http://localhost:3001/api |
| Saúde da API | http://localhost:3001/api/health |
| Documentação Swagger | **http://localhost:3001/api/docs** |
| OpenAPI YAML | http://localhost:3001/api/openapi.yaml |
| Gêneros disponíveis | http://localhost:3001/api/genres |

O arquivo-fonte da especificação fica em `backend/openapi.yaml`. No Swagger, use **Authorize** e informe o JWT obtido pelo login para executar endpoints protegidos.

## Usuários e dados de teste

Estes usuários são carregados automaticamente ao iniciar a API:

| Nome | E-mail | Senha | Leituras iniciais |
|---|---|---|---|
| Ana | `ana@example.com` | `Leitura123!` | O Hobbit, 1984 |
| Bruno | `bruno@example.com` | `Leitura123!` | Clean Code |
| Carla | `carla@example.com` | `Leitura123!` | Nenhuma (estado vazio) |

As credenciais acima são **fictícias e somente para ambiente didático**.

### Leituras de exemplo

| Proprietário | Título | Autor | Gênero | Estrelas | Recomenda? |
|---|---|---|---|---:|---|
| Ana | O Hobbit | J. R. R. Tolkien | Fantasia | 5 | Sim |
| Ana | 1984 | George Orwell | Ficção científica | 5 | Sim |
| Bruno | Clean Code | Robert C. Martin | Tecnologia | 4 | Sim |

Cada registro também possui uma opinião inicial, que pode ser consultada na página de detalhes.

## Endpoints

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | Não | Autentica usuário de teste e retorna JWT |
| GET | `/api/genres` | Não | Lista gêneros permitidos |
| GET | `/api/readings` | Sim | Lista somente minhas leituras |
| POST | `/api/readings` | Sim | Registra uma leitura |
| GET | `/api/readings/:id` | Sim | Obtém detalhe da minha leitura |
| PUT | `/api/readings/:id` | Sim | Altera todos os campos editáveis da minha leitura |
| DELETE | `/api/readings/:id` | Sim | Exclui minha leitura |
| GET | `/api/health` | Não | Retorna status da API |
| GET | `/api/docs` | Não | Interface Swagger |
| GET | `/api/openapi.yaml` | Não | Especificação OpenAPI em YAML |

### Exemplos de requisições

Login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@example.com","password":"Leitura123!"}'
```

A resposta tem `token` e `user`. Copie o token retornado e faça uma consulta:

```bash
curl http://localhost:3001/api/readings \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'
```

Cadastro de leitura (substitua o token):

```bash
curl -X POST http://localhost:3001/api/readings \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Duna","author":"Frank Herbert","genre":"Ficção científica","opinion":"Uma aventura complexa e envolvente.","rating":5,"recommend":true}'
```

### Códigos HTTP

- `200`: consulta, edição ou login bem-sucedidos.
- `201`: leitura criada.
- `204`: leitura excluída; corpo vazio.
- `400`: campos ausentes ou inválidos.
- `401`: credenciais incorretas, token ausente/inválido/expirado.
- `404`: leitura não existe ou não pertence ao usuário autenticado.
- `429`: excesso de tentativas de login.

## Regras de negócio

- **RN01:** um usuário autenticado pode registrar quantos livros desejar.
- **RN02:** título, autor, gênero, opinião, avaliação e recomendação são obrigatórios; textos só com espaços não são aceitos.
- **RN03:** avaliação aceita apenas **inteiros entre 1 e 5**.
- **RN04:** gênero deve ser um destes: Romance, Fantasia, Ficção científica, Suspense, Terror, Biografia, Desenvolvimento pessoal, Tecnologia, Outros.
- **RN05:** recomendação exige Sim ou Não no frontend e `true` ou `false` na API.
- **RN06:** todas as informações editáveis de uma leitura podem ser alteradas pelo proprietário, obedecendo às mesmas regras do cadastro. `PUT` exige o objeto completo.
- **RN07:** a interface Web solicita confirmação antes de excluir. Chamadas diretas à API não exibem confirmação interativa.
- **RN08:** um usuário só lista, visualiza, modifica e exclui leituras associadas ao seu ID de autenticação. O backend determina o proprietário pelo JWT, nunca pelo corpo da requisição. Registros de terceiros retornam `404`.

## Segurança e limites do escopo

- Senhas de exemplo são armazenadas com hash bcrypt; login emite JWT assinado.
- A API valida os dados independentemente do frontend, evita aceitar `userId` fornecido pelo cliente e exige autorização em todos os endpoints de leitura.
- O frontend usa `sessionStorage` para manter o login durante a sessão da aba; em um produto real seria adequado rever a estratégia de armazenamento e implementar políticas de sessão mais completas.
- Este é um projeto para estudo, não um serviço de produção. Não há cadastro de usuários, recuperação de senha, persistência após reinicialização nem infraestrutura de deploy.
- Os testes funcionais automatizados são executados com Cypress; os cenários de performance são executados separadamente com k6 e exigem que a API esteja em execução.

## Organização dos arquivos

```text
diario-leituras/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB em memória
│   │   ├── constants/    # Gêneros válidos
│   │   ├── controllers/  # Login e operações sobre leituras
│   │   ├── middlewares/  # JWT e tratamento de erros
│   │   ├── models/       # Mongoose User e Reading
│   │   ├── routes/       # Rotas HTTP
│   │   ├── seeds/        # Massa de teste
│   │   ├── app.js
│   │   └── server.js
│   ├── openapi.yaml
│   └── .env.example
├── cypress/
│   ├── e2e/
│   │   ├── api tests/
│   │   └── web tests/
│   ├── fixtures/
│   └── support/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles.css
│   └── vite.config.js
├── performance/
│   ├── cadastro.js
│   └── login.js
├── cypress.config.js
└── README.md
```

## Versionamento e Pull Request

O histórico Git possui commits separados para API, interface, documentação e acabamentos. O arquivo `.gitignore` exclui dependências instaladas, segredos (`.env`) e saídas de build.

Para publicar em um novo repositório no GitHub, após criá-lo pela interface do GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/diario-leituras.git
git push -u origin main
git switch -c feat/diario-leituras
git push -u origin feat/diario-leituras
```

**Nota:** para abrir um PR com alterações reais, crie uma branch de implementação a partir de um `main` inicial (por exemplo, só com `.gitignore`) **antes** de enviar os commits de implementação. Não abra um PR entre duas branches que apontam para o mesmo commit. Se o projeto já foi todo enviado a `main`, faça um PR somente para mudanças novas, ou reorganize o histórico com cuidado. A entrega local inclui o histórico dos commits, mas não pressupõe publicação no GitHub.
