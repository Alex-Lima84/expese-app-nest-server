import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/user.entity';
import 'dotenv/config';

const { USERNAME, PASSWORD, HOST, DBPORT, DB } = process.env;
const TYPE = 'postgres';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ExpensesModule,
    IncomesModule,
    TypeOrmModule.forRoot({
      type: TYPE,
      host: HOST,
      port: parseInt(DBPORT, 10),
      username: USERNAME,
      password: PASSWORD,
      database: DB,
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
