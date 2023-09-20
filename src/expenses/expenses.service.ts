import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import {
  Expense,
  FormattedExpense,
  ExpensesCategories,
  ExpensesTypes,
  TransformedExpenseMonth,
  TransformedExpenseDate,
} from './dtos/expenses.dto';

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

  async getExpenses(
    userEmail: string,
    expenseQuantity: string,
  ): Promise<FormattedExpense[]> {
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

      const formattedExpenses: FormattedExpense[] = expenses.rows.map(
        (expense: FormattedExpense) => {
          const formattedDate = new Date(
            expense.expense_date,
          ).toLocaleDateString('en-GB');
          return {
            expense_type: expense.expense_type,
            expense_amount: expense.expense_amount,
            expense_category: expense.expense_category,
            expense_date: formattedDate,
            expense_year: expense.expense_year,
            expense_month: expense.expense_month,
            id: expense.id,
            user_email: expense.user_email,
            created_at: expense.created_at,
            updated_at: expense.updated_at,
          };
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

  async getExpenseInfo(
    userEmail: string,
    id: string,
  ): Promise<FormattedExpense[]> {
    try {
      const expenseInfo: QueryResult = await this.pool.query(
        'SELECT expense_type, expense_amount, expense_category, expense_date, expense_year, expense_month, id, updated_at FROM expenses WHERE user_email = $1 AND id = $2',
        [userEmail, id],
      );

      return expenseInfo.rows;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving the expense information',
      );
    }
  }

  async getExpensesCategories(): Promise<ExpensesCategories[]> {
    try {
      const expensesCategories: QueryResult = await this.pool.query(
        'SELECT * FROM expense_categories',
      );

      return expensesCategories.rows;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving expenses categories information',
      );
    }
  }

  async getExpensesTypes(
    userEmail: string,
    categoryId: string,
  ): Promise<ExpensesTypes[]> {
    try {
      const expensesTypes: QueryResult = await this.pool.query(
        'SELECT * FROM expense_types WHERE expense_category = $1',
        [categoryId],
      );

      return expensesTypes.rows;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving expense types');
    }
  }

  async getExpensesYears(userEmail: string) {
    try {
      const expensesYears: QueryResult = await this.pool.query(
        `SELECT DISTINCT expense_year FROM expenses WHERE user_email = $1 ORDER BY expense_year DESC`,
        [userEmail],
      );

      return expensesYears.rows;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving expenses information',
      );
    }
  }

  async getExpenseMonthsByYear(
    userEmail: string,
    expenseYear: string,
  ): Promise<TransformedExpenseMonth[]> {
    try {
      const expenseMonthsByYear: QueryResult = await this.pool.query(
        'SELECT DISTINCT expense_month FROM expenses WHERE user_email = $1 AND expense_year = $2 ORDER BY expense_month ASC',
        [userEmail, expenseYear],
      );

      const transformedExpenseMonths = expenseMonthsByYear.rows.map(
        (row: { expense_month: string }) => {
          const expenseMonth = row.expense_month;
          const monthNames = [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
          ];
          const transformedMonth = monthNames[parseInt(expenseMonth) - 1];

          return { expense_month: transformedMonth };
        },
      );

      return transformedExpenseMonths;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving expense types');
    }
  }

  async getExpensesByMonthAndYear(
    userEmail: string,
    expenseMonth: string,
    currentExpenseYear: string,
  ): Promise<TransformedExpenseDate[]> {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const transformedMonthIndex = monthNames.findIndex(
      (month) => month.toLowerCase() === expenseMonth.toLowerCase(),
    );

    if (transformedMonthIndex === -1) {
      throw new Error('Invalid expense month');
    }

    const originalMonth = String(transformedMonthIndex + 1).padStart(2, '0');
    try {
      const expenses = await this.pool.query(
        `SELECT * FROM expenses WHERE user_email = $1 AND expense_month = $2 AND expense_year = $3`,
        [userEmail, originalMonth, currentExpenseYear],
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
      throw new Error('An error occurred while retrieving all expenses');
    }
  }

  async createExpensesEntry(
    expenseEntry: Expense,
  ): Promise<QueryResult<Expense>> {
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
      const createExpense = await this.pool.query(
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

      return createExpense;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the expense entry');
    }
  }

  async editExpense(expenseEdit: Expense): Promise<QueryResult<Expense>> {
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
      } = expenseEdit;
      const editExpense = await this.pool.query(
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
      return editExpense;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while modifying the expense');
    }
  }

  async deleteExpense(userEmail: string, id: string): Promise<void> {
    try {
      await this.pool.query(
        'DELETE FROM expenses WHERE user_email = $1 AND id = $2',
        [userEmail, id],
      );

      return;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while deleting the expense');
    }
  }
}
