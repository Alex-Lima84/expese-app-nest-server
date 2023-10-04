import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  expense_type: string;

  @Column({ type: 'varchar', length: 255 })
  expense_amount: string;

  @Column({ type: 'varchar', length: 255 })
  expense_category: string;

  @Column({ type: 'date' })
  expense_date: Date;

  @Column({ type: 'varchar', length: 255 })
  expense_year: string;

  @Column({ type: 'varchar', length: 255 })
  expense_month: string;

  @Column({ type: 'varchar', length: 25 })
  user_email: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
