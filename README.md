<p align="center">   <img height="120px" src="https://github.com/restic36/vendaplus-agromarket-front/blob/dev/src/assets/logo.svg"/> </p>

<center><h1>Venda+ Agromarket</h1></center>

# Sobre o projeto

Marketplace que conecta diretamente produtores de frutas com compradores em todo o Brasil, reduzindo a complexidade das negociações, garantindo preços justos e facilitando a participação de mercado para os produtores, ao mesmo tempo em que oferecemos produtos frescos e de alta qualidade para os compradores.

# Stack

A stack utilizada é:

- Next.js (Framework Front-end)
- Node.js (Ambiente de execução Javascript onde o Back-end foi desenvolvido)
- PostgreSQL
- AWS

# Requisitos

Para rodar o front-end em ambiente de `desenvolvimento` você deve possuir os seguintes recursos/ferramentas instalados em sua máquina:

- [Node.js](https://nodejs.org/en)
- [Node Package Manager](https://www.npmjs.com/)

---

# Execução do projeto

## Importante

Para que o front-end da aplicação funcione, você precisa clonar o [repositório backend da plataforma](https://github.com/restic36/vendaplus-agromarket-back), seguir o passo-a-passo e iniciar o projeto.

### 1 - Variáveis de ambiente

Rode o seguinte comando na pasta raiz do projeto no seu terminal para copiar as variaveis de ambiente:

```bash
cp .env.example .env
```

Agora, acesse o arquivo `.env` e preencha as variáveis caso necessário (se a URL da API não estiver na porta 5000 ou a porta da aplicação não esteja na 3000).

```bash
API_URL=http://localhost:5000
SESSION_SECRET=JWT_SECRET
NEXT_PUBLIC_URL=http://localhost:3000
BUCKET_HOSTNAME=vendamaisagromarket.s3.us-east-2.amazonaws.com
```

A variável `SESSION_SECRET` pode ser preenchida com um secret gerado no seguinte [link](https://jwtsecrets.com/#generator).

## 2 - Pacotes e inicialização

Após isso, faça a instalação dos pacotes necessários com seu gerenciador de arquivos de preferência e inicie o projeto:

```bash
npm i && npm run dev
```

A aplicação estará rodando no seguinte endereço: [http://localhost:3000](http://localhost:3000).

## Documentação de rotas

Abaixo você pode verificar as rotas funcionais na versão atual do projeto:

- ✅ **"/"** - Landing Page
- ✅ **"/login"** - Página de login
- ✅ **"/register"** - Página de registro (comprador e vendedor)
- ✅ **"/market"** - Homepage do marketplace
- ✅ **"/market/cart"** - Carrinho de produtos
- ✅ **"/market/myproducts"** - Listagem de todos produtos cadastrados
- ✅ **"/market/create-product"** - Criação de novos produtos
- ❌ **"/market/edit-product/{id_produto}"** - Edição de produto cadastrado
- ✅ **"/market/pre-checkout"** - Checkout para compra
- ✅ **"/market/product_detail/{id_produto}"** - Tela de detalhamento de produto
- ✅ **"/market/profile"** - Tela de perfil do usuário
- ✅ **"/market/profile/personal-info"** - Tela de informações pessoais do usuário
- ✅ **"/market/profile/addressess"** - Tela de listagem de endereços do usuário
- ✅ **"/market/profile/addressess/{id_endereço}"** - Tela de edição de endereço do usuário
- ✅ **"/market/profile/addressess/new-address"** - Tela de criação de novo endereço do usuário
- ✅ **"/market/profile/change-user-info"** - Tela de edição de dados pessoais do usuário
- ✅ **"/market/history"** - Histórico de pedidos
