import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
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

  async getUserInfo(userEmail: string): Promise<any> {
    try {
      const result = await this.pool.query(
        'SELECT first_name, email FROM users WHERE email = $1',
        [userEmail],
      );
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving user information');
    }
  }
}
