import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Pool, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private readonly pool: Pool;
  private readonly jwtSecret: string;

  constructor() {
    this.pool = new Pool({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      host: process.env.HOST,
      port: parseInt(process.env.DBPORT, 10),
      database: process.env.DB,
    });
    this.jwtSecret = process.env.JWTSECRET;
  }

  async signin(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<any> {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const query =
        'INSERT INTO users (email, first_name, last_name, hashed_password) VALUES($1, $2, $3, $4)';
      const values = [email, firstName, lastName, hashedPassword];
      await this.pool.query(query, values);

      const token = jwt.sign({ email }, this.jwtSecret, { expiresIn: '1hr' });

      return { email, token };
    } catch (error) {
      console.error('Error during signup:', error);
      return { detail: 'Signup failed' };
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const values = [email];
      const result: QueryResult = await this.pool.query(query, values);

      if (result.rowCount === 0) {
        return { detail: 'User not found' };
      }

      const user = result.rows[0];

      const passwordMatch = await bcrypt.compare(
        password,
        user.hashed_password,
      );

      if (passwordMatch) {
        const token = jwt.sign({ email }, this.jwtSecret, { expiresIn: '1hr' });

        return { email: user.email, token };
      } else {
        return { detail: 'Invalid password' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { detail: 'Login failed' };
    }
  }

  async testConnection(): Promise<string> {
    try {
      const testQuery: QueryResult = await this.pool.query('SELECT 1');
      console.log('Connection test result:', testQuery.rows[0]);

      return 'Database connection test successful';
    } catch (error) {
      console.error('Error connecting to the database:', error);
      return 'Database connection test failed';
    }
  }
}
