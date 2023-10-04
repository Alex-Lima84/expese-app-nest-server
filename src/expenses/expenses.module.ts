// expenses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { Expense } from 'src/typeorm/entities/expense.entity';
import { ExpenseCategory } from 'src/typeorm/entities/expense-category.entity';
import { ExpenseType } from 'src/typeorm/entities/expense-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseCategory, ExpenseType])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
