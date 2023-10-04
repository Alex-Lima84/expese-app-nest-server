import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';

@Entity('expense_types')
export class ExpenseType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  expense_type: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @ManyToOne(
    () => ExpenseCategory,
    (expenseCategory) => expenseCategory.expenseTypes,
  )
  @JoinColumn({ name: 'expense_category' })
  expense_category: ExpenseCategory;
}
