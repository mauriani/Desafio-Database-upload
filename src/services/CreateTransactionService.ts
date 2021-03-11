import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    //validar o type da aplicação
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Invalid transaction type!');
    }

    // verifica o saldo para um nova transação
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('Insufficient funds');
    }

    // busca no banco a acategoria
    let transactionsCategory = await categoryRepository.findOne({
      title: category,
    });

    // verifica se existe
    if (!transactionsCategory) {
      // se não existir a gnt cria ela
      transactionsCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionsCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionsCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
