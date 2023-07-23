import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

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

  async getExpensesCategories(): Promise<any> {
    try {
      const result = await this.pool.query('SELECT * FROM expense_categories');

      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving expenses categories information',
      );
    }
  }
}
