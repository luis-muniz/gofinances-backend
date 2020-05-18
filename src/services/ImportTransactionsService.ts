import fs from 'fs';
import csvParse from 'csv-parse';
import { getRepository, In } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
// import CreateTransactionService from './CreateTransactionService';

interface Request {
  file: Express.Multer.File;
}

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface DataFile {
  transactions: Array<CSVTransaction>;
  categories: Array<string>;
}

class ImportTransactionsService {
  async execute({ file }: Request): Promise<Transaction[]> {
    // const createTransactionService = new CreateTransactionService();
    const trasactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);
    const data = await this.loadCSV(file.path);

    if (!data) {
      throw new Error('Invalid file');
    }

    const registeredCategories = await categoryRepository.find({
      where: {
        title: In(data.categories),
      },
    });

    const registeredCategoriesTitle = registeredCategories.map(
      category => category.title,
    );

    const addCategoriesTitle = data.categories
      .filter(category => {
        return !registeredCategoriesTitle.includes(category);
      })
      .filter((category, index, array) => {
        return index === array.indexOf(category);
      });

    const newCategories = categoryRepository.create(
      addCategoriesTitle.map(category => {
        return { title: category };
      }),
    );

    await categoryRepository.save(newCategories);

    const allCategories = [...newCategories, ...registeredCategories];

    const newTransactions = trasactionRepository.create(
      data.transactions.map(transaction => {
        return {
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: allCategories.find(
            category => category.title === transaction.category,
          ),
        };
      }),
    );

    await trasactionRepository.save(newTransactions);
    // const transactions: Array<Transaction> = [];

    // for (let i = 0; i < data.length; i++) {
    //   const newTransaction = await createTransactionService.execute({
    //     title: data[i].title,
    //     type: data[i].type,
    //     value: data[i].value,
    //     categoryTitle: data[i].category,
    //   });

    //   transactions.push(newTransaction);
    // }
    return newTransactions;
  }

  private async loadCSV(csvFilePath: string): Promise<DataFile> {
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const dataFile: DataFile = {
      transactions: [],
      categories: [],
    };

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;
      dataFile.transactions.push({
        title,
        type,
        value,
        category,
      });

      dataFile.categories.push(category);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return dataFile;
  }
}

export default ImportTransactionsService;
