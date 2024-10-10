# API Sonoriza

Node API Solid PostgreSQL

## RFs (Requisitos funcionais)

- [] Deve ser possível se cadastrar;
- [] Deve ser possível editar;
- [] Deve ser possível buscar;
-
## RNs (Regras de negócio)


## RNFs (Requisitos não-funcionais)

- [] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [] Deve haver a documentação da API(Swagger), com todas rotas e com exemplos práticos;
- [] Métodos POST não devem poder substituir informações já cadastradas;
- [] Métodos PUT não devem poder criar uma inforção;

<br/>

#### Step 1 (Clone the project)
```sh
$ git clone https://github.com/joseiltonjunior/api-sonoriza.git
```
#### Step 2 (Open a project)
```sh
$ cd api-sonoriza
```
#### Step 3 (Install yours dependencies)
```sh
$ npm i or yarn 
```
#### Step 4 (Run docker-compose)
```sh
$ docker compose up -d
```

#### Step 5 (Run migrations)
```sh
$ npx prisma migrate dev
```
#### Step 6 (Run server) 
```sh
$ npm run start:dev or yarn start:dev
```
#### Step 6 (Run Prisma Studio) 
```sh
$ npx prisma studio
```

## Credits

<a href="https://www.instagram.com/dvlp.code/" target="_blank">Junior Ferreira</a> at Full-stack Developer JS