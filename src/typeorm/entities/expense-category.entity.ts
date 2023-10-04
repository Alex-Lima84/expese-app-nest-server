import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExpenseType } from './expense-type.entity';

@Entity('expense_categories')
export class ExpenseCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  expense_category: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @OneToMany(() => ExpenseType, (expenseType) => expenseType.expense_category)
  expenseTypes: ExpenseType[];
}
