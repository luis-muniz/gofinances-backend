import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find({
      select: ['value', 'type'],
    });

    let balance: Balance;

    if (!transactions) {
      balance = {
        income: 0,
        outcome: 0,
        total: 0,
      };

      return balance;
    }

    const incomeTotal = transactions.reduce(
      (count, transaction) =>
        transaction.type === 'income' ? transaction.value + count : count,
      0,
    );

    const outcomeTotal = transactions.reduce(
      (count, transaction) =>
        transaction.type === 'outcome' ? transaction.value + count : count,
      0,
    );

    balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };

    return balance;
  }
}

export default TransactionsRepository;
