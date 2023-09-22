import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pool } from 'pg';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserInfo(userEmail: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userEmail },
      });

      if (user) {
        const { first_name, email } = user;

        return { first_name, email };
      }
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while retrieving user information');
    }
  }
}
