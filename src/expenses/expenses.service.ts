import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { ExpenseDto } from './dtos/expense-dto';

@Injectable()
export class ExpensesService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      host: process.env.HOST,
      port: parseInt(process.env.DBPORT, 10),
      database: process.env.DB,
    });
  }

  async getExpenses(userEmail: string, expenseQuantity: string): Promise<any> {
    try {
      const expensesQuery = expenseQuantity
        ? `SELECT * FROM expenses WHERE user_email = $1 ORDER BY updated_at DESC LIMIT $2`
        : `SELECT * FROM expenses WHERE user_email = $1 ORDER BY updated_at DESC`;

      const queryParams = expenseQuantity
        ? [userEmail, parseInt(expenseQuantity, 10)]
        : [userEmail];

      const expenses: QueryResult = await this.pool.query(
        expensesQuery,
        queryParams,
      );

      const formattedExpenses = expenses.rows.map(
        (expense: { expense_date: string | number | Date }) => {
          const formattedDate = new Date(
            expense.expense_date,
          ).toLocaleDateString('en-GB');
          return { ...expense, expense_date: formattedDate };
        },
      );

      return formattedExpenses;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving expenses information',
      );
    }
  }

  async getExpenseInfo(userEmail: string, id: string): Promise<any> {
    try {
      const result: QueryResult = await this.pool.query(
        'SELECT expense_type, expense_amount, expense_category, expense_date, expense_year, expense_month, id, updated_at FROM expenses WHERE user_email = $1 AND id = $2',
        [userEmail, id],
      );

      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async getExpensesCategories(): Promise<any> {
    try {
      const result: QueryResult = await this.pool.query(
        'SELECT * FROM expense_categories',
      );

      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving expenses categories information',
      );
    }
  }

  async getExpenseTypes(userEmail: string, categoryId: string): Promise<any[]> {
    try {
      const result: QueryResult = await this.pool.query(
        'SELECT * FROM expense_types WHERE expense_category = $1',
        [categoryId],
      );
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving expense types');
    }
  }

  async createExpenseEntry(expenseEntry: ExpenseDto): Promise<any> {
    try {
      const {
        expenseTypeName,
        expenseAmount,
        expenseCategoryName,
        expenseDate,
        expenseYear,
        expenseMonth,
        id,
        userEmail,
      } = expenseEntry;
      const result = await this.pool.query(
        `INSERT INTO expenses (expense_type, expense_amount, expense_category, expense_date, expense_year, expense_month, id, user_email) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          expenseTypeName,
          expenseAmount,
          expenseCategoryName,
          expenseDate,
          expenseYear,
          expenseMonth,
          id,
          userEmail,
        ],
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the expense entry');
    }
  }

  async editExpense(expenseEntry: ExpenseDto): Promise<any> {
    try {
      const updated_at = new Date();
      const {
        expenseTypeName,
        expenseAmount,
        expenseCategoryName,
        expenseDate,
        expenseYear,
        expenseMonth,
        id,
        userEmail,
      } = expenseEntry;
      const result = await this.pool.query(
        'UPDATE expenses SET expense_type = $1, expense_amount = $2, expense_category = $3, expense_date = $4, expense_year = $5, expense_month = $6, updated_at = $7 WHERE user_email = $8 AND id = $9;',
        [
          expenseTypeName,
          expenseAmount,
          expenseCategoryName,
          expenseDate,
          expenseYear,
          expenseMonth,
          updated_at,
          userEmail,
          id,
        ],
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the expense entry');
    }
  }
}
