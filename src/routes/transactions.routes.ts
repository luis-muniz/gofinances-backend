import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import upload from '../config/upload';

const uplaodCSV = multer(upload);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    join: {
      alias: 'transaction',
      innerJoinAndSelect: {
        category: 'transaction.category',
      },
    },
  });
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    categoryTitle: category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionRepository = new DeleteTransactionService();

  await deleteTransactionRepository.execute({ id });

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  uplaodCSV.single('file'),
  async (request, response) => {
    const { file } = request;
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute({ file });

    return response.json(transactions);
  },
);

export default transactionsRouter;
