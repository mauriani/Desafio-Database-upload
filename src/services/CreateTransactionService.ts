// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    //validar o type da aplicação
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Invalid transaction type!');
    }

    // const { total } = transactionsRepository.getBalance();

    /*  if (type == 'outcome' && total < value) {
      throw new Error('Insufficient funds!');
    }*/

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
