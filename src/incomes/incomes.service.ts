import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { FormattedIncomes, IncomeDto, IncomesTypes } from './dtos/incomes-dto';

@Injectable()
export class IncomesService {
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

  async getIncomes(userEmail: string): Promise<FormattedIncomes[]> {
    try {
      const incomes: QueryResult = await this.pool.query(
        'SELECT * FROM incomes WHERE user_email = $1 ORDER BY updated_at DESC LIMIT 10',
        [userEmail],
      );

      const formattedIncomes: FormattedIncomes[] = incomes.rows.map(
        (income: FormattedIncomes) => {
          const formattedDate = new Date(income.income_date).toLocaleDateString(
            'en-GB',
          );
          return { ...income, income_date: formattedDate };
        },
      );
      return formattedIncomes;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving incomes information');
    }
  }

  async getIncomeInfo(
    userEmail: string,
    id: string,
  ): Promise<FormattedIncomes[]> {
    try {
      const getIncomeInfo = await this.pool.query(
        'SELECT income_type, income_amount, income_date, income_year, income_month, id, updated_at FROM incomes WHERE user_email = $1 AND id = $2',
        [userEmail, id],
      );
      return getIncomeInfo.rows;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while retrieving the income information',
      );
    }
  }

  async getIncomesTypes(userEmail: string): Promise<IncomesTypes[]> {
    try {
      const incomesTypes = await this.pool.query('SELECT * FROM income_types');
      return incomesTypes.rows;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving expense types');
    }
  }

  async createIncomeEntry(
    incomeEntry: IncomeDto,
  ): Promise<QueryResult<IncomeDto>> {
    try {
      const {
        incomeTypeName,
        incomeAmount,
        incomeDate,
        incomeYear,
        incomeMonth,
        id,
        userEmail,
      } = incomeEntry;

      const newIncome = await this.pool.query(
        `INSERT INTO incomes (income_type, income_amount, income_date, income_year, income_month, id, user_email) 
        VALUES($1, $2, $3, $4, $5, $6, $7)`,
        [
          incomeTypeName,
          incomeAmount,
          incomeDate,
          incomeYear,
          incomeMonth,
          id,
          userEmail,
        ],
      );

      return newIncome;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the expense entry');
    }
  }

  async editIncome(incomeEdit: IncomeDto): Promise<QueryResult<IncomeDto>> {
    try {
      const updated_at = new Date();
      const {
        incomeTypeName,
        incomeAmount,
        incomeDate,
        incomeYear,
        incomeMonth,
        id,
        userEmail,
      } = incomeEdit;
      const editIncome = await this.pool.query(
        'UPDATE incomes SET income_type = $1, income_amount = $2, income_date = $3, income_year = $4, income_month = $5, updated_at = $6 WHERE id = $7 AND user_email = $8;',
        [
          incomeTypeName,
          incomeAmount,
          incomeDate,
          incomeYear,
          incomeMonth,
          updated_at,
          id,
          userEmail,
        ],
      );
      return editIncome;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while modifying the income');
    }
  }
}
