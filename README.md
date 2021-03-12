<img alt="GoStack" src="[https://storage.googleapis.com/golden-wind/bootcamp-gostack/header-desafios-new.png](https://storage.googleapis.com/golden-wind/bootcamp-gostack/header-desafios-new.png)" />

<h3 align="center">
Desafio 06: Banco de dados e upload de arquivos no Node.js
</h3>

## Conceitos

**Repository**

O Repository é um conceito introduzido no Data Mapper Pattern ou Repository Pattern que consiste em uma ponte entre nossa aplicação e a fonte de dados, seja ela um banco de dados, um arquivo físico ou qualquer outro meio de persistência de dados da aplicação.

No repositório definimos as **operações** que queremos fazer com as notas que estão no banco de dados.

Para usar o banco de dados, temos 3 formas, da mais baixo nível até a mais abstrata/prática:

1. Usando um **driver nativo**, como o [mysql2](https://www.npmjs.com/package/mysql2);
2. Usando um **query builder**, como o [knex.js](https://www.npmjs.com/package/knex); ou
3. Usando um **Object-Relational Mapping** (ou **ORM**), como Sequelize ou (especialmente com Typescript) o [TypeORM](https://typeorm.io/#/), que foi a minha escolha para esse projeto.

Um ORM faz o mapeamento das entidades do banco para classes/interfaces/módulos/estruturas (seja lá como a linguagem chame) no código da aplicação e também mapeia os relacionamentos.

Na maior parte do tempo, ao usar um ORM, não precisamos escrever SQL “na mão”, só pra alguma query muito elaborada (o que chegou mais perto disso foi filtragem ao listar as notas).

**Exemplo** no repository realizamos o calculo das transações e no service criamos essa transação com os dados do repositories.

**Service**

- Ele tem como objetivo abstrair regras de negócio das rotas, além de tornar nosso código mais reutilizável;
- O Service deve ter um nome descritivo (ex.: updateDeliveryManProfileService);
- O service só tem um método, aqui chamado de **`execute()`**. É nele que a mágica acontece;
- Para este service funcionar, foi preciso ter acesso aos usuários, tags e notas. Como abstraímos o banco de dados em **repositories**, é eles que utilizamos para tal.

## :rocket: Sobre o desafio

Nesse desafio vamos fazer a conexão do banco de dados com a nossa aplicação, o projeto de gestão de transações. Nossa estrutura é baseada em service, model e repositories. Ao fazer a conexão com o banco precisamos vamos usar o ***TypeOrm, a***lém disso vamos utilizar o envio de arquivos com o multer.

A ideia principal do nosso projeto e amarzenar as transações do usuário permitindo que o mesmo possa realizar transações e criar novos registro no banco de daod sa partir do envio de um arquivo csv.

### Clonando o projeto

### Requisitos para instalação em seu ambiente

- [x]  NodeJS na versão 8 ou superior;
- [x]  yarn ou npm;
- [x]  Postman ou Insomnia, ( para teste de API).

Agora vamos clonar o repositório

```
https://github.com/mauriani/Desafio-Database-upload.git

```

### Executando

Antes de dá start na aplicação você tem que instalar as dependências através do comando:

```
yarn
or
npm install

```

Depois disso basta rodar:

```
yarn dev:server

```
