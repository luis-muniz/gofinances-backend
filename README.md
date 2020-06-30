# Backend do Sistema GoFinances

### Rotas:
Retorna todas as transações e o total todas de entradas, saídas e a diferença entre elas.
```
GET /transactions
```
Cria uma transação. Deve ser passado pelo body da requisição o título, valor, tipo e categoria.
```
POST /transactions
```
Retorna uma transação passando o id como parametro na rota.
```
DELETE /transactions/:id
```
Cria transacões com base em arquivo .csv.
```
POST /transactions/import
```
### Tecnologias usadas:
- Node Js
- CSV Parse
- Express
- Multer
- TypeORM
