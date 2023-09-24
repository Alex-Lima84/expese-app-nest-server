import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.jwtSecret = process.env.JWTSECRET;
  }

  async signin(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      const user = this.userRepository.create({
        email,
        first_name: firstName,
        last_name: lastName,
        hashed_password: hashedPassword,
      });

      const createdUser = await this.userRepository.save(user);

      const token = jwt.sign({ email }, this.jwtSecret, { expiresIn: '1hr' });

      if (createdUser) {
        return { email: createdUser.email, token };
      }
    } catch (error) {
      console.error('Error during signin:', error);
      return { detail: error };
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return { detail: 'User not found' };
      }

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
      return { detail: error.detail };
    }
  }

  async testConnection(): Promise<string> {
    try {
      const result = await this.userRepository.query('SELECT 1');
      console.log('Connection test result:', result[0]);

      return 'Database connection test successful';
    } catch (error) {
      console.error('Error connecting to the database:', error);
      return 'Database connection test failed';
    }
  }
}
