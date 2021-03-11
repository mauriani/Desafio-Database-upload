import { In, getRepository, getCustomRepository } from 'typeorm';

import csvParse from 'csv-parse';
import fs from 'fs';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    // verifica se as categories existem no banco

    // vamos mapear
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });
    // pega o que encontrou para que tenhamos só o titulo

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    // verificar as que não existem
    const addCategories = categories
      .filter(
        category => !existentCategoriesTitles.includes(category),
        // tirar o duplicado
      )
      .filter((value, index, self) => self.indexOf(value) === index);

    // categories que não existem add no banco
    const newCategories = categoriesRepository.create(
      addCategories.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        // soma das novas categories com as existentes, procurando pela mesma do meu titulo
        category: existentCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);

    // exclui o arquivo depois de rodar
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
