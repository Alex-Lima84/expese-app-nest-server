import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { FormattedIncomes, IncomesTypes } from './dtos/incomes-dto';

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
      console.log(incomesTypes.rows);
      return incomesTypes.rows;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving expense types');
    }
  }
}
